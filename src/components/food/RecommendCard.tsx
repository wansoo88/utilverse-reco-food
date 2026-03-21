'use client';
import type { RecommendResponse } from '@/types/recommend';

interface RecommendCardProps {
  data: RecommendResponse;
  isFallback?: boolean;
}

// 메뉴 이름으로 외부 실행 링크 생성
const buildActionLinks = (menuName: string, type: 'cook' | 'order') => {
  const encoded = encodeURIComponent(menuName);
  if (type === 'cook') {
    return [
      {
        label: '🍳 레시피 보기',
        href: `https://www.10000recipe.com/recipe/list.html?q=${encoded}`,
      },
      {
        label: '📺 유튜브 레시피',
        href: `https://www.youtube.com/results?search_query=${encoded}+레시피`,
      },
    ];
  }
  return [
    {
      label: '🛵 배달의민족',
      href: `https://baemin.com/search/keyword?q=${encoded}`,
    },
    {
      label: '🚀 쿠팡이츠',
      href: `https://www.coupangeats.com/search?q=${encoded}`,
    },
  ];
};

export const RecommendCard = ({ data, isFallback }: RecommendCardProps) => {
  const mainItem = data.items[0];

  return (
    <div className="mt-6 space-y-3">
      {isFallback && (
        <p className="text-xs text-center text-gray-400">
          ⚡ AI 서버가 바쁩니다. 잠시 후 다시 시도해보세요.
        </p>
      )}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-bold text-gray-500">
          {data.type === 'cook' ? '🍳 해먹기 추천' : '🛵 시켜먹기 추천'}
        </span>
      </div>
      {data.items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-2xl shrink-0">{item.emoji ?? '🍽️'}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{item.reason}</p>
            {/* 첫 번째 메뉴에만 실행 링크 표시 — 주요 추천 항목 */}
            {i === 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {buildActionLinks(item.name, data.type).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
      {data.tip && (
        <p className="text-xs text-center text-gray-400 pt-1">💡 {data.tip}</p>
      )}
      {/* 나머지 메뉴에 대한 간단 실행 링크 (검색 링크) */}
      {mainItem && data.items.length > 1 && (
        <p className="text-xs text-center text-gray-400">
          다른 메뉴도{' '}
          <a
            href={
              data.type === 'cook'
                ? `https://www.10000recipe.com/recipe/list.html?q=${encodeURIComponent(data.items[1]?.name ?? '')}`
                : `https://baemin.com/search/keyword?q=${encodeURIComponent(data.items[1]?.name ?? '')}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-orange-500"
          >
            바로 찾기 →
          </a>
        </p>
      )}
    </div>
  );
};
