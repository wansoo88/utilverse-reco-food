'use client';

import dynamic from 'next/dynamic';
import type { RecommendResponse } from '@/types/recommend';

const RecipeLinks = dynamic(
  () => import('./RecipeLinks').then((m) => m.RecipeLinks),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface RecommendCardProps {
  data: RecommendResponse;
  lang: string;
  isFallback?: boolean;
}

export const RecommendCard = ({ data, lang, isFallback }: RecommendCardProps) => {
  const mainItem = data.items[0];

  return (
    <div className="space-y-3">

      {/* 추천 유형 레이블 */}
      <p className="text-xs font-bold tracking-wide text-gray-400 uppercase">
        {data.type === 'cook' ? '🍳 해먹기 추천' : '🛵 시켜먹기 추천'}
      </p>

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

      {/* 유튜브 + 블로그 레시피 링크 (첫 번째 메뉴 기준) */}
      {mainItem && !isFallback && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            🔥 레시피 찾기 — {mainItem.name}
          </p>
          <RecipeLinks foodName={mainItem.name} lang={lang} />
        </div>
      )}
    </div>
  );
};
