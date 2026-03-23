'use client';
import { useState, useCallback } from 'react';
import type { FoodItem, RecommendError } from '@/types/recommend';
import type { Locale } from '@/config/site';
import { apiUrl } from '@/lib/basePath';

export interface KpopRecommendData {
  idol: string;
  group: string;
  items: FoodItem[];
  tip?: string;
  _fallback?: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useKpopRecommend = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<KpopRecommendData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const recommend = useCallback(async (
    query: string,
    lang: Locale,
    idolName?: string,
    groupName?: string,
  ) => {
    setStatus('loading');
    setError(null);
    setIsFallback(false);
    try {
      const res = await fetch(apiUrl('/api/kpop-recommend'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang, idolName, groupName }),
      });

      const json = await res.json() as KpopRecommendData | RecommendError;

      if ('error' in json) {
        setError(json.error === 'food_only' ? 'food_only' : 'unknown');
        setStatus('error');
        return;
      }

      setData(json);
      setIsFallback(Boolean(json._fallback));
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
