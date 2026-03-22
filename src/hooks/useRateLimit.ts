'use client';
import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'wmj_session';
const SESSION_DURATION_MS = 30 * 60 * 1000; // 30분

// 세션 내 검색 제한
const RATE_LIMITS = [
  { windowMs: 10 * 1000, maxCount: 2 },     // 10초에 2번
  { windowMs: 60 * 1000, maxCount: 5 },     // 1분에 5번
  { windowMs: 5 * 60 * 1000, maxCount: 10 }, // 5분에 10번
] as const;

interface SessionData {
  timestamps: number[];
  sessionStart: number;
}

function loadSession(): SessionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return newSession();
    const parsed = JSON.parse(raw) as SessionData;
    // 30분 지나면 세션 초기화
    if (Date.now() - parsed.sessionStart > SESSION_DURATION_MS) {
      return newSession();
    }
    return parsed;
  } catch {
    return newSession();
  }
}

function newSession(): SessionData {
  return { timestamps: [], sessionStart: Date.now() };
}

function saveSession(session: SessionData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage 실패 무시
  }
}

/**
 * 세션 기반 검색 속도 제한 훅
 * - AI 일일 한도가 차면 제한 해제 (quotaExhausted=true)
 */
export const useRateLimit = () => {
  const [blocked, setBlocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const quotaExhaustedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // AI 일일 한도 차면 제한 해제
  const setQuotaExhausted = useCallback((exhausted: boolean) => {
    quotaExhaustedRef.current = exhausted;
    if (exhausted) {
      setBlocked(false);
      setRemainingSeconds(0);
    }
  }, []);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 검색 가능 여부 확인 + 기록
  const checkAndRecord = useCallback((): { allowed: boolean; waitSeconds: number } => {
    // AI 일일 한도 소진 시 제한 해제
    if (quotaExhaustedRef.current) {
      return { allowed: true, waitSeconds: 0 };
    }

    const now = Date.now();
    const session = loadSession();

    // 세션 만료 체크
    if (now - session.sessionStart > SESSION_DURATION_MS) {
      const fresh = newSession();
      fresh.timestamps.push(now);
      saveSession(fresh);
      setBlocked(false);
      return { allowed: true, waitSeconds: 0 };
    }

    // 각 제한 윈도우 확인
    for (const limit of RATE_LIMITS) {
      const windowStart = now - limit.windowMs;
      const recentCount = session.timestamps.filter((ts) => ts > windowStart).length;
      if (recentCount >= limit.maxCount) {
        // 가장 오래된 타임스탬프가 윈도우를 벗어나는 시점 계산
        const oldestInWindow = session.timestamps
          .filter((ts) => ts > windowStart)
          .sort((a, b) => a - b)[0];
        const waitMs = oldestInWindow ? (oldestInWindow + limit.windowMs - now) : limit.windowMs;
        const waitSeconds = Math.ceil(waitMs / 1000);

        setBlocked(true);
        setRemainingSeconds(waitSeconds);

        // 카운트다운 타이머
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setRemainingSeconds((prev) => {
            if (prev <= 1) {
              setBlocked(false);
              if (timerRef.current) clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return { allowed: false, waitSeconds };
      }
    }

    // 통과 → 타임스탬프 기록
    session.timestamps.push(now);
    // 오래된 기록 정리 (5분 이전 삭제)
    const cutoff = now - 5 * 60 * 1000;
    session.timestamps = session.timestamps.filter((ts) => ts > cutoff);
    saveSession(session);
    setBlocked(false);
    return { allowed: true, waitSeconds: 0 };
  }, []);

  return { blocked, remainingSeconds, checkAndRecord, setQuotaExhausted };
};
