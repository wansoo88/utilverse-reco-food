'use client';

import { useEffect, useState } from 'react';
import type { RecipeItem } from '@/app/api/recipes/route';

interface RecipeLinksProps {
  foodName: string;
  lang: string;
}

interface RecipesData {
  youtube: RecipeItem[];
  blog: RecipeItem[];
}

const PLATFORM_LABELS: Record<string, { youtube: string; blog: string }> = {
  ko: { youtube: '유튜브', blog: '블로그' },
  en: { youtube: 'YouTube', blog: 'Blog' },
  ja: { youtube: 'YouTube', blog: 'ブログ' },
  zh: { youtube: 'YouTube', blog: '博客' },
};

const SECTION_LABELS: Record<string, { youtube: string; blog: string; loading: string }> = {
  ko: { youtube: '🎬 유튜브 레시피', blog: '📝 블로그 레시피', loading: '레시피 불러오는 중...' },
  en: { youtube: '🎬 YouTube Recipes', blog: '📝 Blog Recipes', loading: 'Loading recipes...' },
  ja: { youtube: '🎬 YouTube レシピ', blog: '📝 ブログ レシピ', loading: 'レシピ読み込み中...' },
  zh: { youtube: '🎬 YouTube 食谱', blog: '📝 博客 食谱', loading: '加载食谱中...' },
};

function SkeletonCard() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 animate-pulse">
      <div className="w-10 h-7 rounded bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-2.5 bg-gray-200 rounded w-2/5" />
      </div>
    </div>
  );
}

function RecipeCard({ item, badge, badgeClass }: {
  item: RecipeItem;
  badge: string;
  badgeClass: string;
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition-colors hover:border-orange-200 hover:bg-orange-50"
    >
      {/* YouTube 썸네일 or 플랫폼 아이콘 */}
      {item.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-14 h-10 object-cover rounded-lg shrink-0"
        />
      ) : (
        <span className="text-xl shrink-0 w-10 text-center">
          {item.platform === 'youtube' ? '▶️' : '📖'}
        </span>
      )}

      {/* 제목 + 채널 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug">
          {item.title}
        </p>
        {item.channel && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.channel}</p>
        )}
      </div>

      {/* 플랫폼 배지 */}
      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
        {badge}
      </span>
    </a>
  );
}

export const RecipeLinks = ({ foodName, lang }: RecipeLinksProps) => {
  const [data, setData] = useState<RecipesData | null>(null);
  const [loading, setLoading] = useState(true);

  const labels = PLATFORM_LABELS[lang] ?? PLATFORM_LABELS.ko;
  const sectionLabels = SECTION_LABELS[lang] ?? SECTION_LABELS.ko;

  useEffect(() => {
    if (!foodName) return;
    setLoading(true);
    setData(null);

    fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodName, lang }),
    })
      .then((r) => r.json())
      .then((json: RecipesData) => setData(json))
      .catch(() => setData({ youtube: [], blog: [] }))
      .finally(() => setLoading(false));
  }, [foodName, lang]);

  if (loading) {
    return (
      <div className="space-y-4 pt-3 border-t border-gray-100">
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">{sectionLabels.youtube}</p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">{sectionLabels.blog}</p>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400">{sectionLabels.loading}</p>
      </div>
    );
  }

  if (!data || (data.youtube.length === 0 && data.blog.length === 0)) return null;

  return (
    <div className="space-y-4 pt-3 border-t border-gray-100">
      {/* 유튜브 섹션 */}
      {data.youtube.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-red-500 mb-2">{sectionLabels.youtube}</p>
          <div className="space-y-2">
            {data.youtube.map((item, i) => (
              <RecipeCard
                key={i}
                item={item}
                badge={labels.youtube}
                badgeClass="bg-red-100 text-red-600"
              />
            ))}
          </div>
        </div>
      )}

      {/* 블로그 섹션 */}
      {data.blog.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-emerald-600 mb-2">{sectionLabels.blog}</p>
          <div className="space-y-2">
            {data.blog.map((item, i) => (
              <RecipeCard
                key={i}
                item={item}
                badge={labels.blog}
                badgeClass="bg-emerald-100 text-emerald-700"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
