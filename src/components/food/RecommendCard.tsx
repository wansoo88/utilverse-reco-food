'use client';

import dynamic from 'next/dynamic';
import type { RecommendResponse } from '@/types/recommend';

const RecipeLinks = dynamic(
  () => import('./RecipeLinks').then((m) => m.RecipeLinks),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

const NearbyRestaurants = dynamic(
  () => import('./NearbyRestaurants').then((m) => m.NearbyRestaurants),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface RecommendCardProps {
  data: RecommendResponse;
  lang: string;
  isFallback?: boolean;
}

export const RecommendCard = ({ data, lang }: RecommendCardProps) => {
  const mainItem = data.items[0];
  const isCook = data.type === 'cook';

  return (
    <div className="space-y-3">

      {/* 추천 유형 레이블 */}
      <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
        {isCook ? '🍳 메뉴 추천 (해먹기)' : '🛵 메뉴 추천 (시켜먹기)'}
      </p>

      {/* 추천 메뉴 목록 */}
      <div className="space-y-2">
        {data.items.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-shadow ${
              i === 0
                ? isCook
                  ? 'border-orange-200 bg-orange-50 shadow-sm'
                  : 'border-blue-200 bg-blue-50 shadow-sm'
                : 'border-gray-100 bg-white hover:shadow-sm'
            }`}
          >
            <span className="text-2xl shrink-0">{item.emoji ?? '🍽️'}</span>
            <div className="min-w-0 flex-1">
              <p className={`font-bold text-gray-900 ${i === 0 ? 'text-base' : 'text-sm'}`}>
                {item.name}
              </p>
              {/* 시켜먹기는 메뉴명만, 해먹기는 이유도 표시 */}
              {isCook && (
                <p className="text-xs text-gray-500 mt-0.5 leading-5">{item.reason}</p>
              )}
            </div>
            {i === 0 && (
              <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold text-white ${
                isCook ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                TOP
              </span>
            )}
          </div>
        ))}
      </div>

      {data.tip && (
        <p className="text-xs text-center text-gray-400">💡 {data.tip}</p>
      )}

      {/* 해먹기: 유튜브 + 블로그 레시피 링크 (항상 표시) */}
      {isCook && mainItem && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            🔥 레시피 찾기 — {mainItem.name}
          </p>
          <RecipeLinks foodName={mainItem.name} lang={lang} />
        </div>
      )}

      {/* 시켜먹기: 근처 맛집 */}
      {!isCook && (
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
