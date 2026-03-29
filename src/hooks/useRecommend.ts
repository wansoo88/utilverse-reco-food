'use client';
import { useState, useCallback } from 'react';
import type { FilterState } from '@/types/filter';
import type { MenuRecommendResponse, RecommendError } from '@/types/recommend';
import type { Locale } from '@/config/site';
import { apiUrl } from '@/lib/basePath';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useRecommend = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<MenuRecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const recommend = useCallback(async (
    query: string,
    filters: FilterState,
    lang: Locale,
    exclude?: string[],
  ) => {
    setStatus('loading');
    setError(null);
    setIsFallback(false);
    try {
      const res = await fetch(apiUrl('/api/recommend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, lang, exclude }),
      });

      const json = await res.json() as MenuRecommendResponse | RecommendError;

      if ('error' in json) {
        setError(json.error === 'food_only' ? 'food_only' : 'unknown');
        setStatus('error');
        return;
      }

      // 빈 결과 방어 — items가 비어있으면 로컬 폴백 재시도
      if (!json.items || json.items.length === 0) {
        const fallbackRes = await fetch(apiUrl('/api/recommend'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: '', filters, lang, exclude }),
        });
        const fallbackJson = await fallbackRes.json() as MenuRecommendResponse;
        setData(fallbackJson);
        setIsFallback(true);
      } else {
        setData(json);
        setIsFallback(Boolean(json._fallback));
      }
      setStatus('success');
    } catch {
      setError('unknown');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
    setIsFallback(false);
  }, []);

  return { status, data, error, isFallback, recommend, reset };
};
