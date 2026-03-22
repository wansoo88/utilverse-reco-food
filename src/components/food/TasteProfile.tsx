'use client';
import { useMemo } from 'react';
import type { CalendarEntry } from '@/types/calendar';
import type { FavoriteItem } from '@/hooks/useFavorites';

// 한식/중식/양식/일식/기타 분류 (간단한 키워드 기반)
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  한식: ['김치', '불고기', '비빔', '삼겹', '된장', '순두부', '갈비', '제육', '냉면', '해물', '국밥', '떡', '잡채', '삼계탕', '청국장', '오징어', '미역', '곰탕', '설렁탕', '보쌈', '족발', '순대', '탕평채', '감자탕', '닭볶음'],
  중식: ['짜장', '짬뽕', '탕수육', '마파두부', '볶음밥', '딤섬', '마라', '훠궈', '양장피', '깐풍기', '유린기', '팔보채'],
  일식: ['스시', '초밥', '라멘', '우동', '소바', '돈까스', '오므라이스', '가라아게', '규동', '텐동', '야끼토리', '타코야키', '오코노미야키'],
  양식: ['파스타', '피자', '스테이크', '버거', '샌드위치', '리조또', '그라탱', '수프', '샐러드', '프렌치', '치킨마요'],
};

function guessCategory(menuName: string): string {
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => menuName.includes(kw))) return cat;
  }
  return '기타';
}

interface TasteProfileProps {
  entries: CalendarEntry[];
  favorites: FavoriteItem[];
  labels?: {
    title?: string;
    minDataMsg?: string;
    categoryTitle?: string;
    topMenusTitle?: string;
    streakLabel?: string;
    recordCount?: string;
    cookLabel?: string;
    orderLabel?: string;
  };
}

const MIN_DATA = 5;

export const TasteProfile = ({ entries, favorites, labels }: TasteProfileProps) => {
  const t = {
    title: labels?.title ?? '🍱 나의 음식 DNA',
    minDataMsg: labels?.minDataMsg ?? `메뉴를 ${MIN_DATA}개 이상 기록하면 취향 분석을 해드려요!`,
    categoryTitle: labels?.categoryTitle ?? '카테고리 분포',
    topMenusTitle: labels?.topMenusTitle ?? '많이 먹은 메뉴 Top 5',
    streakLabel: labels?.streakLabel ?? '연속 기록일',
    recordCount: labels?.recordCount ?? '이번 달 기록',
    cookLabel: labels?.cookLabel ?? '해먹기',
    orderLabel: labels?.orderLabel ?? '시켜먹기',
  };

  const stats = useMemo(() => {
    if (entries.length < MIN_DATA) return null;

    // 카테고리 분포
    const catCount: Record<string, number> = {};
    entries.forEach((e) => {
      const cat = guessCategory(e.menu);
      catCount[cat] = (catCount[cat] ?? 0) + 1;
    });
    const total = entries.length;
    const categories = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }));

    // 해먹기 vs 시켜먹기
    const cookCount = entries.filter((e) => e.type === 'cook').length;
    const orderCount = entries.length - cookCount;
    const cookPct = Math.round((cookCount / total) * 100);

    // Top 5 메뉴
    const menuCount: Record<string, number> = {};
    entries.forEach((e) => {
      menuCount[e.menu] = (menuCount[e.menu] ?? 0) + 1;
    });
    const topMenus = Object.entries(menuCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // 이번 달 기록
    const nowMonth = new Date().toISOString().slice(0, 7);
    const thisMonthCount = entries.filter((e) => e.date.startsWith(nowMonth)).length;

    // 연속 기록일 (streak)
    const uniqueDates = Array.from(new Set(entries.map((e) => e.date)));
    const sortedDates = uniqueDates.sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sortedDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(today.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (sortedDates[i] === expectedStr) streak++;
      else break;
    }

    return { categories, cookCount, orderCount, cookPct, topMenus, thisMonthCount, streak };
  }, [entries]);

  const CATEGORY_COLORS: Record<string, string> = {
    한식: 'bg-red-400',
    중식: 'bg-orange-400',
    일식: 'bg-yellow-400',
    양식: 'bg-blue-400',
    기타: 'bg-gray-400',
  };

  if (!stats) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-500">{t.minDataMsg}</p>
        <p className="mt-1 text-xs text-gray-400">현재 {entries.length}개 기록됨</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 요약 숫자 카드 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3 text-center">
          <p className="text-2xl font-extrabold text-orange-600">{stats.thisMonthCount}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{t.recordCount}</p>
        </div>
        <div className="rounded-2xl bg-green-50 border border-green-100 p-3 text-center">
          <p className="text-2xl font-extrabold text-green-600">{stats.streak}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{t.streakLabel}</p>
        </div>
        <div className="rounded-2xl bg-pink-50 border border-pink-100 p-3 text-center">
          <p className="text-2xl font-extrabold text-pink-600">{favorites.length}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">즐겨찾기</p>
        </div>
      </div>

      {/* 해먹기 vs 시켜먹기 */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-600">{t.cookLabel} vs {t.orderLabel}</p>
        <div className="h-3 w-full rounded-full overflow-hidden bg-gray-100 flex">
          <div
            className="h-full bg-orange-400 transition-all"
            style={{ width: `${stats.cookPct}%` }}
          />
          <div className="h-full bg-blue-400 flex-1" />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>🍳 {t.cookLabel} {stats.cookPct}%</span>
          <span>🛵 {t.orderLabel} {100 - stats.cookPct}%</span>
        </div>
      </div>

      {/* 카테고리 분포 */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-600">{t.categoryTitle}</p>
        {stats.categories.map(({ name, pct }) => (
          <div key={name} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-8 shrink-0">{name}</span>
            <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${CATEGORY_COLORS[name] ?? 'bg-gray-400'} transition-all`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
          </div>
        ))}
      </div>

      {/* Top 5 메뉴 */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-gray-600">{t.topMenusTitle}</p>
        <div className="space-y-1">
          {stats.topMenus.map(({ name, count }, idx) => (
            <div key={name} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-1.5">
              <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}</span>
              <span className="text-sm flex-1 text-gray-800">{name}</span>
              <span className="text-xs text-gray-400">{count}회</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
