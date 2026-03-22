/**
 * 토큰 사용량 추적기
 * - 서버 메모리 + /tmp 파일로 이중 저장
 * - API 호출 통계: provider, model, 추정 토큰, timestamp
 */
import { writeFileSync, readFileSync } from 'fs';
import path from 'path';

const USAGE_FILE = path.join('/tmp', 'wmj_usage.json');

export interface UsageRecord {
  ts: number;           // Unix timestamp (ms)
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

// 메모리 내 버퍼 (최대 500개)
let memBuffer: UsageRecord[] = [];
const MAX_RECORDS = 500;

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

function getRecords(): UsageRecord[] {
  if (memBuffer.length === 0) {
    memBuffer = loadFromFile();
  }
  return memBuffer;
}

/** 사용량 기록 추가 */
export function trackUsage(record: UsageRecord) {
  const records = getRecords();
  records.push(record);
  if (records.length > MAX_RECORDS) {
    records.splice(0, records.length - MAX_RECORDS);
  }
  memBuffer = records;
  saveToFile(records);
}

/** 사용량 요약 반환 */
export function getUsageSummary(): UsageSummary {
  const records = getRecords();
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
  memBuffer = [];
  saveToFile([]);
}

/** 토큰 추정 (글자 수 기반 rough estimate) */
export function estimateTokens(text: string): number {
  // 한글/일본어/중국어: ~2자 = 1토큰, 영어: ~4자 = 1토큰
  const cjkCount = (text.match(/[\u1100-\u11FF\u3040-\u9FFF\uAC00-\uD7AF]/g) ?? []).length;
  const latinCount = text.length - cjkCount;
  return Math.ceil(cjkCount / 2 + latinCount / 4);
}
