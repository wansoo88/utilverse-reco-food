'use client';
import { useState, useCallback, useEffect } from 'react';
import type { MenuRecommendResponse, FoodItem } from '@/types/recommend';

export interface HistoryEntry {
  id: string;
  query: string;
  result: MenuRecommendResponse;
  mode: 'text' | 'ai' | 'kpop';
  timestamp: number;
}

const STORAGE_KEY = 'wmj_session_history';
const MAX_HISTORY = 5;

function loadHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

export const useRecommendHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const addHistory = useCallback((entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const next = [newEntry, ...prev].slice(0, MAX_HISTORY);
      saveHistory(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  // 세션 내 제외 메뉴 목록 (이건 아니야)
  const [excludedMenus, setExcludedMenus] = useState<string[]>([]);

  const excludeMenu = useCallback((menuName: string) => {
    setExcludedMenus((prev) => Array.from(new Set([...prev, menuName])));
  }, []);

  const isExcluded = useCallback(
    (menuName: string) => excludedMenus.includes(menuName),
    [excludedMenus],
  );

  return { history, addHistory, clearHistory, excludedMenus, excludeMenu, isExcluded };
};
