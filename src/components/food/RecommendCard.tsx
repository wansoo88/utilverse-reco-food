'use client';

import dynamic from 'next/dynamic';
import type { MenuRecommendResponse } from '@/types/recommend';
import { ShareButton } from '@/components/ui/ShareButton';
import { trackEvent } from '@/lib/analytics';

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
  onRetry?: () => void;
  onExclude?: (menuName: string) => void;
  onToggleFavorite?: (menuName: string, emoji: string) => void;
  isFavorite?: (menuName: string) => boolean;
  shareUrl?: string;
  labels?: {
    retry?: string;
    notThis?: string;
    shareCopied?: string;
    shareCopy?: string;
  };
}

export const RecommendCard = ({
  data,
  lang,
  mode,
  onRetry,
  onExclude,
  onToggleFavorite,
  isFavorite,
  shareUrl,
  labels,
}: RecommendCardProps) => {
  const mainItem = data.items[0];
  const isCook = mode === 'cook' || mode === 'any';
  const isOrder = mode === 'order' || mode === 'any';

  const retryLabel = labels?.retry ?? '🔄 다른 메뉴 추천받기';
  const notThisLabel = labels?.notThis ?? '이건 아니야';

  const shareText = mainItem
    ? `오늘 AI가 추천한 메뉴: ${mainItem.name} 🍽️ — 오늘뭐먹지`
    : '오늘뭐먹지';

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
            <div className="flex flex-col items-end gap-1 shrink-0">
              {i === 0 && (
                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                  TOP
                </span>
              )}
              {onToggleFavorite && (
                <button
                  onClick={() => {
                    onToggleFavorite(item.name, item.emoji ?? '🍽️');
                    trackEvent('favorite_toggle', { lang, menu: item.name });
                  }}
                  className="text-lg leading-none hover:scale-110 transition-transform"
                  title="즐겨찾기"
                >
                  {isFavorite?.(item.name) ? '❤️' : '🤍'}
                </button>
              )}
              {onExclude && (
                <button
                  onClick={() => onExclude(item.name)}
                  aria-label={notThisLabel}
                  className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.tip && (
        <p className="text-xs text-center text-gray-400">💡 {data.tip}</p>
      )}

      {/* 액션 버튼 행 */}
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={() => {
              trackEvent('re_recommend_click', { lang });
              onRetry();
            }}
            className="flex-1 rounded-2xl border border-orange-200 bg-orange-50 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-100 transition-colors"
          >
            {retryLabel}
          </button>
        )}
        {shareUrl && mainItem && (
          <ShareButton
            text={shareText}
            url={shareUrl}
            lang={lang}
            labels={{ copied: labels?.shareCopied, copy: labels?.shareCopy ?? '공유' }}
          />
        )}
      </div>

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
