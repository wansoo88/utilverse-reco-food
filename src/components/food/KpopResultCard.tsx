'use client';

import { getIdolById, getIdolName, searchIdols, type KpopIdol } from '@/data/kpopIdols';
import type { KpopRecommendData } from '@/hooks/useKpopRecommend';
import { ShareButton } from '@/components/ui/ShareButton';
import { trackEvent } from '@/lib/analytics';

interface KpopResultCardProps {
  data: KpopRecommendData;
  lang: string;
  /** 레시피 검색 연동 */
  onRecipeSearch?: (menuName: string) => void;
  onRetry?: () => void;
  onToggleFavorite?: (menuName: string, emoji: string) => void;
  isFavorite?: (menuName: string) => boolean;
  shareUrl?: string;
  labels?: {
    retry?: string;
    shareCopied?: string;
    shareCopy?: string;
  };
}

const LABELS: Record<string, {
  idolPick: string; recipeBtn: string; tip: string;
}> = {
  ko: { idolPick: '이(가) 좋아하는 메뉴', recipeBtn: '🔍 레시피 찾기', tip: '💡 팁' },
  en: { idolPick: "'s Favorite Menu", recipeBtn: '🔍 Find Recipe', tip: '💡 Tip' },
  ja: { idolPick: 'のお気に入りメニュー', recipeBtn: '🔍 レシピ検索', tip: '💡 ヒント' },
  zh: { idolPick: '最爱的菜单', recipeBtn: '🔍 找食谱', tip: '💡 提示' },
};

export const KpopResultCard = ({
  data,
  lang,
  onRecipeSearch,
  onRetry,
  onToggleFavorite,
  isFavorite,
  shareUrl,
  labels,
}: KpopResultCardProps) => {
  const labelSet = LABELS[lang] ?? LABELS.ko;

  // 아이돌 프로필 찾기
  const matches = searchIdols(data.idol, (lang as 'ko' | 'en' | 'ja' | 'zh') || 'ko');
  const idol: KpopIdol | undefined = matches[0] ?? getIdolById(data.idol);

  const displayName = idol ? getIdolName(idol, lang) : data.idol;
  const mainItem = data.items[0];
  const shareText = mainItem
    ? `${displayName}이(가) 좋아하는 ${mainItem.name}! — 오늘뭐먹지`
    : '오늘뭐먹지';

  return (
    <div className="space-y-3">
      {/* 아이돌 프로필 헤더 */}
      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-3">
        <span className="text-3xl">{idol?.emoji ?? '⭐'}</span>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {displayName}{labelSet.idolPick}
          </p>
          <p className="text-xs text-gray-500">{data.group}</p>
        </div>
      </div>

      {/* 메뉴 카드 */}
      <div className="grid gap-2">
        {data.items.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
          >
            <span className="text-lg">🍽️</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleFavorite && (
                <button
                  onClick={() => {
                    onToggleFavorite(item.name, '🍽️');
                    trackEvent('favorite_toggle', { lang, menu: item.name });
                  }}
                  className="text-base leading-none hover:scale-110 transition-transform"
                >
                  {isFavorite?.(item.name) ? '❤️' : '🤍'}
                </button>
              )}
              {onRecipeSearch && (
                <button
                  onClick={() => onRecipeSearch(item.name)}
                  className="shrink-0 rounded-xl border border-pink-200 px-2.5 py-1 text-[10px] font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
                >
                  {labelSet.recipeBtn}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 팁 */}
      {data.tip && (
        <div className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-700">
          {labelSet.tip} {data.tip}
        </div>
      )}

      {/* 액션 버튼 행 */}
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={() => {
              trackEvent('re_recommend_click', { lang, mode: 'kpop' });
              onRetry();
            }}
            className="flex-1 rounded-2xl border border-pink-200 bg-pink-50 py-2.5 text-sm font-semibold text-pink-600 hover:bg-pink-100 transition-colors"
          >
            {labels?.retry ?? '🔄 다른 메뉴 추천받기'}
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
    </div>
  );
};
