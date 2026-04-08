/**
 * 토큰 사용량 추적기
 * - /tmp 파일 기반 퍼시스턴스 (항상 파일에서 읽어 staleness 방지)
 */
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

const USAGE_FILE = path.join('/tmp', 'wmj_usage.json');
const MAX_RECORDS = 500;

export interface UsageRecord {
  ts: number;
  provider: 'gemini' | 'gpt' | 'local';
  model: string;
  endpoint: 'recommend' | 'kpop-recommend';
  estimatedTokens: number;
}

export interface UsageSummary {
  total: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  byEndpoint: Record<string, number>;
  totalEstimatedTokens: number;
  recentRecords: UsageRecord[];
  lastUpdated: number;
}

function loadFromFile(): UsageRecord[] {
  try {
    const raw = readFileSync(USAGE_FILE, 'utf-8');
    return JSON.parse(raw) as UsageRecord[];
  } catch {
    return [];
  }
}

function saveToFile(records: UsageRecord[]) {
  try {
    writeFileSync(USAGE_FILE, JSON.stringify(records.slice(-MAX_RECORDS)));
  } catch {
    // /tmp 쓰기 실패 무시
  }
}

/** 사용량 기록 추가 — 매번 파일 read/write (서버리스 인스턴스 간 공유 보장) */
export function trackUsage(record: UsageRecord) {
  const records = loadFromFile();
  records.push(record);
  saveToFile(records);
}

/** 사용량 요약 반환 (from/to 옵션: Unix ms) */
export function getUsageSummary(from?: number, to?: number): UsageSummary {
  const all = loadFromFile();
  const records =
    from || to
      ? all.filter((r) => (!from || r.ts >= from) && (!to || r.ts <= to))
      : all;

  const byProvider: Record<string, number> = {};
  const byModel: Record<string, number> = {};
  const byEndpoint: Record<string, number> = {};
  let totalTokens = 0;

  for (const r of records) {
    byProvider[r.provider] = (byProvider[r.provider] ?? 0) + 1;
    byModel[r.model] = (byModel[r.model] ?? 0) + 1;
    byEndpoint[r.endpoint] = (byEndpoint[r.endpoint] ?? 0) + 1;
    totalTokens += r.estimatedTokens;
  }

  return {
    total: records.length,
    byProvider,
    byModel,
    byEndpoint,
    totalEstimatedTokens: totalTokens,
    recentRecords: records.slice(-20).reverse(),
    lastUpdated: Date.now(),
  };
}

/** 사용량 초기화 */
export function clearUsage() {
  saveToFile([]);
}

/** 토큰 추정 (글자 수 기반) */
export function estimateTokens(text: string): number {
  const cjkCount = (text.match(/[\u1100-\u11FF\u3040-\u9FFF\uAC00-\uD7AF]/g) ?? []).length;
  const latinCount = text.length - cjkCount;
  return Math.ceil(cjkCount / 2 + latinCount / 4);
}
