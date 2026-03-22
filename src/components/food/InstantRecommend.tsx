'use client';
import { useState, useEffect } from 'react';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import type { FoodItem } from '@/types/recommend';

const SESSION_KEY = 'wmj_instant_shown';

function getTimeSlot(): 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late' {
  const h = new Date().getHours();
  if (h >= 6 && h < 10) return 'morning';
  if (h >= 10 && h < 15) return 'lunch';
  if (h >= 15 && h < 18) return 'afternoon';
  if (h >= 18 && h < 22) return 'dinner';
  return 'late';
}

function pickMenu(slot: ReturnType<typeof getTimeSlot>): FoodItem {
  const pool =
    slot === 'morning' || slot === 'afternoon'
      ? [...COOK_MENUS]
      : slot === 'late'
      ? [...ORDER_MENUS]
      : [...COOK_MENUS, ...ORDER_MENUS];

  // 이전에 보여준 메뉴 제외
  let shown: string[] = [];
  try {
    shown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '[]');
  } catch {}

  const filtered = pool.filter((m) => !shown.includes(m.name));
  const source = filtered.length > 0 ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

interface InstantRecommendProps {
  onSearch: (menuName: string) => void;
  lastMenu?: string; // wmj_calendar 마지막 메뉴
  hidden?: boolean;
}

export const InstantRecommend = ({ onSearch, lastMenu, hidden }: InstantRecommendProps) => {
  const [menu, setMenu] = useState<FoodItem | null>(null);

  useEffect(() => {
    const slot = getTimeSlot();
    const picked = pickMenu(slot);
    setMenu(picked);
    // 표시 기록
    try {
      const shown: string[] = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? '[]');
      shown.push(picked.name);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(shown.slice(-20)));
    } catch {}
  }, []);

  if (hidden || !menu) return null;

  const handleClick = () => {
    onSearch(menu.name);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-left hover:border-orange-400 hover:bg-orange-100 transition-colors group"
    >
      <span className="text-2xl shrink-0">{menu.emoji ?? '🍽️'}</span>
      <div className="flex-1 min-w-0">
        {lastMenu ? (
          <>
            <p className="text-xs text-gray-500">지난번에 <span className="font-semibold">{lastMenu}</span> 드셨죠? 오늘은 이건 어때요?</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">{menu.name}</p>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-500">지금 딱 좋은 메뉴</p>
            <p className="text-sm font-bold text-gray-900">{menu.name}</p>
          </>
        )}
      </div>
      <span className="shrink-0 text-xs font-semibold text-orange-500 group-hover:translate-x-0.5 transition-transform">
        자세히 →
      </span>
    </button>
  );
};
