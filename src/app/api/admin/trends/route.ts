import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { isAdminAuthorized } from '@/lib/adminAuth';

const TRENDS_FILE = path.join('/tmp', 'wmj_trends.json');

export interface TrendEntry {
  id: string;
  name: string;
  category: string;
  reason: string;
  addedAt: number;
  source: 'manual' | 'ai';
}

function loadTrends(): TrendEntry[] {
  try {
    return JSON.parse(readFileSync(TRENDS_FILE, 'utf-8')) as TrendEntry[];
  } catch {
    return [];
  }
}

function saveTrends(trends: TrendEntry[]) {
  try {
    writeFileSync(TRENDS_FILE, JSON.stringify(trends));
  } catch {}
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ trends: loadTrends() });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as {
    action: 'add' | 'remove' | 'ai-refresh';
    entry?: Omit<TrendEntry, 'id' | 'addedAt'>;
    id?: string;
  };

  const trends = loadTrends();

  if (body.action === 'add' && body.entry) {
    const newEntry: TrendEntry = {
      ...body.entry,
      id: Date.now().toString(),
      addedAt: Date.now(),
    };
    trends.unshift(newEntry);
    saveTrends(trends.slice(0, 100));
    return NextResponse.json({ ok: true, entry: newEntry });
  }

  if (body.action === 'remove' && body.id) {
    const updated = trends.filter((t) => t.id !== body.id);
    saveTrends(updated);
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'ai-refresh') {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set' }, { status: 500 });
    }

    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

      const prompt = `현재 한국에서 트렌디한 음식 메뉴 10가지를 JSON 배열로 추천해주세요.
각 항목: { "name": "메뉴명", "category": "카테고리(한식/양식/중식/일식/분식/디저트)", "reason": "트렌딩 이유 (한 문장)" }
JSON만 출력하세요.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
      const aiMenus = JSON.parse(text) as Array<{ name: string; category: string; reason: string }>;

      const newEntries: TrendEntry[] = aiMenus.map((m) => ({
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: m.name,
        category: m.category,
        reason: m.reason,
        addedAt: Date.now(),
        source: 'ai' as const,
      }));

      const merged = [...newEntries, ...trends].slice(0, 100);
      saveTrends(merged);
      return NextResponse.json({ ok: true, added: newEntries.length, trends: merged });
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
