'use client';
import { useState, useCallback, useEffect } from 'react';

export interface FavoriteItem {
  menuName: string;
  emoji: string;
  category: string;
  savedAt: string;
}

const STORAGE_KEY = 'wmj_favorites';
const MAX_FAVORITES = 50;

function load(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
}

function save(items: FavoriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    setFavorites(load());
  }, []);

  const addFavorite = useCallback(
    (item: Omit<FavoriteItem, 'savedAt'>): 'added' | 'overflow' => {
      let overflow = false;
      setFavorites((prev) => {
        if (prev.some((f) => f.menuName === item.menuName)) return prev;
        const next = [{ ...item, savedAt: new Date().toISOString() }, ...prev];
        if (next.length > MAX_FAVORITES) {
          next.splice(MAX_FAVORITES);
          overflow = true;
        }
        save(next);
        return next;
      });
      return overflow ? 'overflow' : 'added';
    },
    [],
  );

  const removeFavorite = useCallback((menuName: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.menuName !== menuName);
      save(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (menuName: string) => favorites.some((f) => f.menuName === menuName),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (item: Omit<FavoriteItem, 'savedAt'>): 'added' | 'removed' | 'overflow' => {
      if (favorites.some((f) => f.menuName === item.menuName)) {
        removeFavorite(item.menuName);
        return 'removed';
      }
      return addFavorite(item);
    },
    [favorites, addFavorite, removeFavorite],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
};
