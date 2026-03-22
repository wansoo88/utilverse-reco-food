'use client';
import { useState, useCallback } from 'react';
import type { FilterState } from '@/types/filter';
import type { RecommendResponse, DualRecommendResponse, AnyRecommendResponse, RecommendError } from '@/types/recommend';
import type { Locale } from '@/config/site';

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useRecommend = () => {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<AnyRecommendResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recommend = useCallback(async (
    query: string,
    filters: FilterState,
    lang: Locale,
    ingredients?: string[],
    exclude?: string[],
    dual?: boolean,
  ) => {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, lang, ingredients, exclude, dual }),
      });

      const json = await res.json() as AnyRecommendResponse | RecommendError;

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

// 타입 가드 유틸리티
export const isDualResponse = (data: AnyRecommendResponse): data is DualRecommendResponse =>
  'dual' in data && data.dual === true;

export const isSingleResponse = (data: AnyRecommendResponse): data is RecommendResponse =>
  'type' in data;
