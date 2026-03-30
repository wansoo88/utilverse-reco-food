'use client';
import { useState, useMemo } from 'react';
import type { FavoriteItem } from '@/hooks/useFavorites';
import { trackEvent } from '@/lib/analytics';

// 카테고리 필터 다국어
const CATEGORY_LABELS: Record<string, string[]> = {
  ko: ['전체', '한식', '중식', '양식', '일식', '기타'],
  en: ['All', 'Korean', 'Chinese', 'Western', 'Japanese', 'Other'],
  ja: ['全て', '韓国料理', '中華', '洋食', '和食', 'その他'],
  zh: ['全部', '韩食', '中餐', '西餐', '日料', '其他'],
};

// 카테고리 내부 키 (스토리지 값)
const CATEGORY_KEYS = ['전체', '한식', '중식', '양식', '일식', '기타'] as const;

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
  onRemove: (menuName: string) => void;
  onRecommend: (menuName: string) => void;
  labels?: {
    title?: string;
    empty?: string;
    recommend?: string;
  };
  lang?: string;
}

export const FavoritesSection = ({
  favorites,
  onRemove,
  onRecommend,
  labels,
  lang = 'ko',
}: FavoritesSectionProps) => {
  const [open, setOpen] = useState(false);
  const [filterCatIdx, setFilterCatIdx] = useState(0); // 0 = 전체

  const catLabels = CATEGORY_LABELS[lang] ?? CATEGORY_LABELS.ko;
  const catKey = CATEGORY_KEYS[filterCatIdx] ?? '전체';

  const title = labels?.title ?? '♥ 즐겨찾기 메뉴북';
  const emptyMsg = labels?.empty ?? '아직 즐겨찾기가 없어요. 추천받은 메뉴에서 ♥를 눌러보세요!';
  const recommendLabel = labels?.recommend ?? '이 메뉴로 추천받기';

  const filtered = useMemo(
    () => (filterCatIdx === 0 ? favorites : favorites.filter((f) => f.category === catKey)),
    [favorites, filterCatIdx, catKey],
  );

  return (
    <section className="rounded-2xl border border-red-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[56px]"
      >
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">{title}</span>
          {favorites.length > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
              {favorites.length}
            </span>
          )}
        </div>
        <span
          className={`text-gray-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-1.5">
            {catLabels.map((cat, idx) => (
              <button
                key={cat}
                onClick={() => setFilterCatIdx(idx)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[32px] ${
                  filterCatIdx === idx
                    ? 'bg-red-500 text-white'
                    : 'border border-gray-200 text-gray-600 hover:border-red-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">{emptyMsg}</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {filtered.map((item) => (
                <div
                  key={item.menuName}
                  className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-2.5"
                >
                  <span className="text-xl">{item.emoji || '🍽️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.menuName}</p>
                    <p className="text-[10px] text-gray-400">{item.category}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => {
                        trackEvent('favorite_recommend_click', { lang, menu: item.menuName });
                        onRecommend(item.menuName);
                      }}
                      className="text-[10px] font-semibold text-orange-500 hover:text-orange-700 whitespace-nowrap py-1 px-1.5 rounded hover:bg-orange-50 transition-colors min-h-[28px] flex items-center"
                    >
                      {recommendLabel}
                    </button>
                    <button
                      onClick={() => {
                        trackEvent('favorite_remove', { lang, menu: item.menuName });
                        onRemove(item.menuName);
                      }}
                      aria-label="즐겨찾기 삭제"
                      className="flex items-center justify-center w-7 h-7 rounded-full text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
