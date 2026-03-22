'use client';
import { useState, useEffect } from 'react';
import { COOK_MENUS, ORDER_MENUS } from '@/data/localMenus';
import { trackEvent } from '@/lib/analytics';

interface BattleRecord {
  date: string;
  menuA: string;
  menuB: string;
  choice: 'A' | 'B';
}

const STORAGE_KEY = 'wmj_battles';

function loadBattles(): BattleRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as BattleRecord[];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return all.filter((r) => new Date(r.date) >= cutoff);
  } catch {
    return [];
  }
}

function saveBattles(records: BattleRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {}
}

function pickTwoDifferent() {
  const allMenus = [...COOK_MENUS, ...ORDER_MENUS];
  const shuffled = [...allMenus].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]] as const;
}

interface MenuBattleProps {
  lang?: string;
  labels?: {
    title?: string;
    vs?: string;
    sameChoice?: string;
  };
}

export const MenuBattle = ({ lang = 'ko', labels }: MenuBattleProps) => {
  const [menuA, setMenuA] = useState<(typeof COOK_MENUS)[0] | null>(null);
  const [menuB, setMenuB] = useState<(typeof COOK_MENUS)[0] | null>(null);
  const [choice, setChoice] = useState<'A' | 'B' | null>(null);
  const [samePercent, setSamePercent] = useState<number | null>(null);

  useEffect(() => {
    const [a, b] = pickTwoDifferent();
    setMenuA(a);
    setMenuB(b);
  }, []);

  const handleChoice = (picked: 'A' | 'B') => {
    if (choice) return;
    setChoice(picked);

    const records = loadBattles();
    const today = new Date().toISOString().split('T')[0];
    const menu = picked === 'A' ? menuA?.name : menuB?.name;
    if (!menu || !menuA || !menuB) return;

    const newRecord: BattleRecord = { date: today, menuA: menuA.name, menuB: menuB.name, choice: picked };
    const updated = [newRecord, ...records].slice(0, 200);
    saveBattles(updated);

    // 같은 배틀에서 같은 선택 비율 계산
    const sameBattle = records.filter(
      (r) => r.menuA === menuA.name && r.menuB === menuB.name,
    );
    const sameCount = sameBattle.filter((r) => r.choice === picked).length;
    const total = sameBattle.length + 1;
    setSamePercent(Math.round(((sameCount + 1) / total) * 100));

    trackEvent('battle_choice', { lang, menuA: menuA.name, menuB: menuB.name, choice: picked });
  };

  const handleRefresh = () => {
    const [a, b] = pickTwoDifferent();
    setMenuA(a);
    setMenuB(b);
    setChoice(null);
    setSamePercent(null);
  };

  const title = labels?.title ?? '오늘의 메뉴 대결';
  const vsLabel = labels?.vs ?? 'VS';
  const sameChoiceLabel = labels?.sameChoice ?? '같은 선택';

  if (!menuA || !menuB) return null;

  return (
    <section className="rounded-[2rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-purple-700">⚔️ {title}</p>
        <button
          onClick={handleRefresh}
          className="text-xs text-gray-400 hover:text-purple-500 transition-colors"
        >
          🔄 새로운 대결
        </button>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* 메뉴 A */}
        <button
          onClick={() => handleChoice('A')}
          disabled={!!choice}
          className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
            choice === 'A'
              ? 'border-purple-400 bg-purple-50 scale-105 shadow-md'
              : choice === 'B'
              ? 'border-gray-100 bg-gray-50 opacity-50'
              : 'border-purple-200 bg-white hover:border-purple-400 hover:shadow-md cursor-pointer'
          }`}
        >
          <span className="text-3xl">{menuA.emoji ?? '🍽️'}</span>
          <p className="text-sm font-bold text-gray-900 text-center">{menuA.name}</p>
          {choice === 'A' && samePercent !== null && (
            <span className="text-xs text-purple-600 font-semibold">
              {samePercent}% {sameChoiceLabel}
            </span>
          )}
        </button>

        {/* VS */}
        <div className="text-sm font-extrabold text-gray-400">{vsLabel}</div>

        {/* 메뉴 B */}
        <button
          onClick={() => handleChoice('B')}
          disabled={!!choice}
          className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
            choice === 'B'
              ? 'border-pink-400 bg-pink-50 scale-105 shadow-md'
              : choice === 'A'
              ? 'border-gray-100 bg-gray-50 opacity-50'
              : 'border-pink-200 bg-white hover:border-pink-400 hover:shadow-md cursor-pointer'
          }`}
        >
          <span className="text-3xl">{menuB.emoji ?? '🍽️'}</span>
          <p className="text-sm font-bold text-gray-900 text-center">{menuB.name}</p>
          {choice === 'B' && samePercent !== null && (
            <span className="text-xs text-pink-600 font-semibold">
              {samePercent}% {sameChoiceLabel}
            </span>
          )}
        </button>
      </div>

      {!choice && (
        <p className="mt-3 text-center text-xs text-gray-400">둘 중 오늘 더 당기는 걸 골라보세요!</p>
      )}
    </section>
  );
};
