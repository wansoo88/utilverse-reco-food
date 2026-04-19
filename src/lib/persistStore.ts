/**
 * 퍼시스턴트 스토리지 추상화 — 어드민 데이터(사용량·트렌드)를 서버 재기동 후에도 유지
 *
 * 백엔드 우선순위 (환경에 따라 자동 선택):
 *   1. Upstash Redis REST  — UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN 설정 시 (Vercel 운영 권장)
 *   2. 프로젝트 `.data/` 파일 — 로컬 개발 FS가 쓰기 가능할 때 (dev 재기동 시 유지)
 *   3. `/tmp` 파일 — 마지막 수단 (Vercel 기본, 콜드 스타트 시 소실)
 *
 * 기존 `/tmp` 데이터가 있을 경우 최초 읽기 시 상위 계층으로 자동 이관(마이그레이션).
 */
import { readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from 'fs';
import path from 'path';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY_PREFIX = 'wmj:';

const LOCAL_DATA_DIR = path.join(process.cwd(), '.data');
const TMP_DIR = '/tmp';

type Backend = 'upstash' | 'local' | 'tmp';

let detectedBackend: Backend | null = null;

function pickBackend(): Backend {
  if (detectedBackend) return detectedBackend;
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    detectedBackend = 'upstash';
    return 'upstash';
  }
  // 프로젝트 루트에 .data/ 디렉터리 생성 시도 — 실패하면 /tmp 폴백
  try {
    mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    const probe = path.join(LOCAL_DATA_DIR, '.write-probe');
    writeFileSync(probe, '1');
    unlinkSync(probe);
    detectedBackend = 'local';
    return 'local';
  } catch {
    detectedBackend = 'tmp';
    return 'tmp';
  }
}

function filePath(backend: 'local' | 'tmp', key: string): string {
  const dir = backend === 'local' ? LOCAL_DATA_DIR : TMP_DIR;
  return path.join(dir, `wmj_${key}.json`);
}

// ── Upstash REST helpers ────────────────────────────────────────────────────

async function upstashCall(command: string[]): Promise<{ result: unknown } | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()) as { result: unknown };
  } catch {
    return null;
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/** 저장된 JSON을 읽어옴. 없으면 fallback 반환. */
export async function readJson<T>(key: string, fallback: T): Promise<T> {
  const backend = pickBackend();

  if (backend === 'upstash') {
    const res = await upstashCall(['GET', `${KEY_PREFIX}${key}`]);
    const raw = res?.result;
    if (typeof raw === 'string' && raw.length > 0) {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    }
    // Upstash 미저장 시 이전 `/tmp` 데이터가 있으면 이관
    return migrateFromTmp(key, fallback);
  }

  // 파일 기반 — 현재 백엔드 파일 우선, 없으면 /tmp 마이그레이션 시도
  const primary = filePath(backend, key);
  try {
    return JSON.parse(readFileSync(primary, 'utf-8')) as T;
  } catch {
    if (backend === 'local') {
      return migrateFromTmp(key, fallback);
    }
    return fallback;
  }
}

async function migrateFromTmp<T>(key: string, fallback: T): Promise<T> {
  const tmpPath = filePath('tmp', key);
  if (!existsSync(tmpPath)) return fallback;
  try {
    const data = JSON.parse(readFileSync(tmpPath, 'utf-8')) as T;
    await writeJson(key, data); // 상위 백엔드로 복사
    return data;
  } catch {
    return fallback;
  }
}

/** JSON 값을 저장. 실패 시 silent. */
export async function writeJson<T>(key: string, value: T): Promise<void> {
  const backend = pickBackend();
  const serialized = JSON.stringify(value);

  if (backend === 'upstash') {
    await upstashCall(['SET', `${KEY_PREFIX}${key}`, serialized]);
    return;
  }

  try {
    writeFileSync(filePath(backend, key), serialized);
  } catch {
    // 쓰기 실패 무시
  }
}

/** 키 삭제 */
export async function deleteKey(key: string): Promise<void> {
  const backend = pickBackend();

  if (backend === 'upstash') {
    await upstashCall(['DEL', `${KEY_PREFIX}${key}`]);
    return;
  }

  try {
    const p = filePath(backend, key);
    if (existsSync(p)) unlinkSync(p);
  } catch {
    // 삭제 실패 무시
  }
}

/** 현재 사용 중인 백엔드 (admin UI 배너에 표시) */
export function getBackendName(): Backend {
  return pickBackend();
}
