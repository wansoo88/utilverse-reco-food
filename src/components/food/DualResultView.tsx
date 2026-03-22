'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { MenuRecommendResponse, FoodItem } from '@/types/recommend';

const RecipeLinks = dynamic(
  () => import('./RecipeLinks').then((m) => m.RecipeLinks),
  { loading: () => <div className="h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

const NearbyRestaurants = dynamic(
  () => import('./NearbyRestaurants').then((m) => m.NearbyRestaurants),
  { loading: () => <div className="h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface DualResultViewProps {
  data: MenuRecommendResponse;
  lang: string;
}

export const DualResultView = ({ data, lang }: DualResultViewProps) => {
  const [activeTab, setActiveTab] = useState<'cook' | 'order'>('cook');
  const menuNames = data.items.map((item) => item.name);

  return (
    <div className="space-y-3">
      {/* 모바일: 탭 전환 */}
      <div className="flex gap-1 md:hidden">
        <button
          onClick={() => setActiveTab('cook')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'cook'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🍳 해먹기
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === 'order'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          🛵 시켜먹기
        </button>
      </div>

      {/* 데스크탑: 좌우 반반 / 모바일: 탭별 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 해먹기 (좌측) */}
        <div className={`${activeTab !== 'cook' ? 'hidden md:block' : ''}`}>
          <CookSection items={data.items} tip={data.tip} lang={lang} />
        </div>

        {/* 시켜먹기 (우측) */}
        <div className={`${activeTab !== 'order' ? 'hidden md:block' : ''}`}>
          <OrderSection items={data.items} tip={data.tip} lang={lang} menuNames={menuNames} />
        </div>
      </div>
    </div>
  );
};

// 해먹기: 메뉴 + 이유 + 레시피 링크
function CookSection({ items, tip, lang }: {
  items: FoodItem[];
  tip?: string;
  lang: string;
}) {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/30 p-4 space-y-3">
      <p className="text-xs font-bold tracking-wide text-orange-600 uppercase">
        🍳 해먹기
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
              i === 0
                ? 'border-orange-300 bg-white shadow-sm'
                : 'border-orange-100 bg-white/80'
            }`}
          >
            <span className="text-xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <div className="min-w-0 flex-1">
              <p className={`font-bold text-gray-900 ${i === 0 ? 'text-sm' : 'text-xs'}`}>
                {item.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-5">{item.reason}</p>
            </div>
            {i === 0 && (
              <span className="ml-auto shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                TOP
              </span>
            )}
          </div>
        ))}
      </div>

      {tip && <p className="text-xs text-center text-gray-400">💡 {tip}</p>}

      {/* 레시피 링크 (항상 표시) */}
      {items[0] && (
        <div className="rounded-xl border border-orange-100 bg-white p-3">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            🔥 레시피 찾기 — {items[0].name}
          </p>
          <RecipeLinks foodName={items[0].name} lang={lang} />
        </div>
      )}
    </div>
  );
}

// 시켜먹기: 메뉴명만 + 근처 맛집
function OrderSection({ items, tip, lang, menuNames }: {
  items: FoodItem[];
  tip?: string;
  lang: string;
  menuNames: string[];
}) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-4 space-y-3">
      <p className="text-xs font-bold tracking-wide text-blue-600 uppercase">
        🛵 시켜먹기
      </p>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              i === 0
                ? 'border-blue-300 bg-white shadow-sm'
                : 'border-blue-100 bg-white/80'
            }`}
          >
            <span className="text-xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <p className={`font-bold text-gray-900 flex-1 ${i === 0 ? 'text-sm' : 'text-xs'}`}>
              {item.name}
            </p>
            {i === 0 && (
              <span className="ml-auto shrink-0 rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold text-white">
                TOP
              </span>
            )}
          </div>
        ))}
      </div>

      {tip && <p className="text-xs text-center text-gray-400">💡 {tip}</p>}

      {/* 근처 맛집 */}
      <div className="rounded-xl border border-blue-100 bg-white p-3">
        <NearbyRestaurants menuNames={menuNames} lang={lang} />
      </div>
    </div>
  );
}
