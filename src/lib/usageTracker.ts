/**
 * 토큰 사용량 추적기
 * - persistStore 기반 퍼시스턴스 (Upstash > .data/ > /tmp 자동 선택)
 * - 서버 재기동·재배포 시에도 데이터 유지 (Upstash/`.data/` 구성 시)
 */
import { readJson, writeJson, deleteKey, getBackendName } from './persistStore';

const USAGE_KEY = 'usage';
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
  storage: 'upstash' | 'local' | 'tmp';
}

/** 사용량 기록 추가 — 매번 스토리지 read/write (인스턴스 간 공유 보장) */
export async function trackUsage(record: UsageRecord): Promise<void> {
  const records = await readJson<UsageRecord[]>(USAGE_KEY, []);
  records.push(record);
  await writeJson(USAGE_KEY, records.slice(-MAX_RECORDS));
}

/** 사용량 요약 반환 (from/to 옵션: Unix ms) */
export async function getUsageSummary(from?: number, to?: number): Promise<UsageSummary> {
  const all = await readJson<UsageRecord[]>(USAGE_KEY, []);
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
    storage: getBackendName(),
  };
}

/** 사용량 초기화 */
export async function clearUsage(): Promise<void> {
  await deleteKey(USAGE_KEY);
}

/** 토큰 추정 (글자 수 기반) */
export function estimateTokens(text: string): number {
  const cjkCount = (text.match(/[\u1100-\u11FF\u3040-\u9FFF\uAC00-\uD7AF]/g) ?? []).length;
  const latinCount = text.length - cjkCount;
  return Math.ceil(cjkCount / 2 + latinCount / 4);
}
