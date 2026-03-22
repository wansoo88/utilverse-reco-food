'use client';

import dynamic from 'next/dynamic';
import type { MenuRecommendResponse } from '@/types/recommend';

const RecipeLinks = dynamic(
  () => import('./RecipeLinks').then((m) => m.RecipeLinks),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

const NearbyRestaurants = dynamic(
  () => import('./NearbyRestaurants').then((m) => m.NearbyRestaurants),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface RecommendCardProps {
  data: MenuRecommendResponse;
  lang: string;
  mode: 'cook' | 'order' | 'any';
}

export const RecommendCard = ({ data, lang, mode }: RecommendCardProps) => {
  const mainItem = data.items[0];
  const isCook = mode === 'cook' || mode === 'any';
  const isOrder = mode === 'order' || mode === 'any';

  return (
    <div className="space-y-3">
      {/* 추천 메뉴 목록 */}
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-shadow ${
              i === 0
                ? 'border-orange-200 bg-orange-50 shadow-sm'
                : 'border-gray-100 bg-white hover:shadow-sm'
            }`}
          >
            <span className="text-2xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <div className="min-w-0 flex-1">
              <p className={`font-bold text-gray-900 ${i === 0 ? 'text-base' : 'text-sm'}`}>
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

      {data.tip && (
        <p className="text-xs text-center text-gray-400">💡 {data.tip}</p>
      )}

      {/* 해먹기: 레시피 링크 */}
      {isCook && mainItem && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            🔥 레시피 찾기 — {mainItem.name}
          </p>
          <RecipeLinks foodName={mainItem.name} lang={lang} />
        </div>
      )}

      {/* 시켜먹기: 근처 맛집 */}
      {isOrder && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <NearbyRestaurants
            menuNames={data.items.map((item) => item.name)}
            lang={lang}
          />
        </div>
      )}
    </div>
  );
};
