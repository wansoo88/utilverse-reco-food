'use client';

import dynamic from 'next/dynamic';
import type { RecommendResponse } from '@/types/recommend';

const RecipeSuggestions = dynamic(
  () => import('./RecipeSuggestions').then((m) => m.RecipeSuggestions),
  { loading: () => <div className="mt-4 h-24 animate-pulse rounded-xl bg-gray-100" /> },
);

interface RecommendCardProps {
  data: RecommendResponse;
  lang: string;
  isFallback?: boolean;
  labelRecipe: string;
  labelYoutube: string;
  labelRecipeLoading: string;
  labelRecipeTitle: string;
}

export const RecommendCard = ({
  data,
  lang,
  isFallback,
  labelRecipe,
  labelYoutube,
  labelRecipeLoading,
  labelRecipeTitle,
}: RecommendCardProps) => {
  const mainItem = data.items[0];

  return (
    <div className="space-y-3">
      {isFallback && (
        <p className="text-xs text-center text-gray-400">
          ⚡ AI 서버가 바쁩니다. 잠시 후 다시 시도해보세요.
        </p>
      )}

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
            <div className="min-w-0">
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

      {/* Gemini 트렌드 레시피 (해먹기 또는 시켜먹기 공통으로 첫 메뉴 기준) */}
      {mainItem && (
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">
            🔥 {labelRecipeTitle} — {mainItem.name}
          </p>
          <RecipeSuggestions
            foodName={mainItem.name}
            lang={lang}
            labelRecipe={labelRecipe}
            labelYoutube={labelYoutube}
            labelLoading={labelRecipeLoading}
          />
        </div>
      )}
    </div>
  );
};
