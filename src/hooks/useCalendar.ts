'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CalendarEntry } from '@/types/calendar';
import type { RecommendResponse } from '@/types/recommend';

const STORAGE_KEY = 'wmj_calendar';

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const isCalendarEntry = (value: unknown): value is CalendarEntry => {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.date === 'string' &&
    typeof entry.menu === 'string' &&
    typeof entry.reason === 'string' &&
    (entry.type === 'cook' || entry.type === 'order')
  );
};

export const useCalendar = () => {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved) as unknown;
      if (!Array.isArray(parsed)) return;

      setEntries(parsed.filter(isCalendarEntry));
    } catch {
      // Ignore malformed storage values.
    }
  }, []);

  const persist = useCallback((next: CalendarEntry[]) => {
    setEntries(next);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const saveRecommendation = useCallback((data: RecommendResponse, date = formatLocalDate(new Date())) => {
    const mainItem = data.items[0];
    if (!mainItem) return false;

    const nextEntry: CalendarEntry = {
      date,
      menu: mainItem.name,
      reason: mainItem.reason,
      type: data.type,
    };

    const nextEntries = [
      nextEntry,
      ...entries.filter((entry) => entry.date !== date),
    ].sort((a, b) => a.date.localeCompare(b.date));

    persist(nextEntries);
    return true;
  }, [entries, persist]);

  const removeEntry = useCallback((date: string) => {
    const nextEntries = entries.filter((entry) => entry.date !== date);
    const changed = nextEntries.length !== entries.length;
    if (changed) {
      persist(nextEntries);
    }
    return changed;
  }, [entries, persist]);

  const updateEntry = useCallback((date: string, updates: Pick<CalendarEntry, 'menu' | 'reason' | 'type'>) => {
    let changed = false;

    const nextEntries = entries.map((entry) => {
      if (entry.date !== date) return entry;
      changed = true;
      return {
        ...entry,
        ...updates,
      };
    });

    if (changed) {
      persist(nextEntries);
    }

    return changed;
  }, [entries, persist]);

  // 최근 N일 식단 메뉴명 반환 (Gemini exclude 파라미터용)
  const getRecentMenus = useCallback((days = 7): string[] => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = formatLocalDate(cutoff);

    return entries
      .filter((entry) => entry.date >= cutoffStr)
      .map((entry) => entry.menu)
      .filter(Boolean);
  }, [entries]);

  return {
    entries,
    saveRecommendation,
    removeEntry,
    updateEntry,
    getRecentMenus,
  };
};
