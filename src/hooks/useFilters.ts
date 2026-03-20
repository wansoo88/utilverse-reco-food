'use client';
import { useState, useEffect, useCallback } from 'react';
import type { FilterState } from '@/types/filter';
import { DEFAULT_FILTER } from '@/types/filter';

const STORAGE_KEY = 'wmj_filters';

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER);
  const [restored, setRestored] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FilterState;
        setFilters(parsed);
        setRestored(true);
      }
    } catch {
      // localStorage 접근 실패 시 기본값 유지
    }
  }, []);

  const updateFilters = useCallback((next: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...next };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // 저장 실패 무시
      }
      return updated;
    });
  }, []);

  const toggleVibe = useCallback((vibe: FilterState['vibes'][number]) => {
    setFilters((prev) => {
      const vibes = prev.vibes.includes(vibe)
        ? prev.vibes.filter((v) => v !== vibe)
        : [...prev.vibes, vibe];
      const updated = { ...prev, vibes };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { filters, updateFilters, toggleVibe, resetFilters, restored };
};
