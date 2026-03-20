'use client';
import { useState, useCallback } from 'react';
import type { FilterState } from '@/types/filter';
import type { RecommendResponse, RecommendError } from '@/types/recommend';
import type { Locale } from '@/config/site';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useRecommend = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(async (query: string, filters: FilterState, lang: Locale) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, lang }),
      });

      const json = await res.json() as RecommendResponse | RecommendError;

      if ('error' in json) {
        if (json.error === 'food_only') {
          setError('food_only');
        } else {
          setError('unknown');
        }
        setStatus('error');
        return;
      }

      setData(json);
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
  }, []);

  return { status, data, error, recommend, reset };
};
