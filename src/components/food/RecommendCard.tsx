'use client';
import type { RecommendResponse } from '@/types/recommend';

interface RecommendCardProps {
  data: RecommendResponse;
  isFallback?: boolean;
}

export const RecommendCard = ({ data, isFallback }: RecommendCardProps) => {
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
          <div>
            <p className="font-bold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-500 mt-0.5">{item.reason}</p>
          </div>
        </div>
      ))}
      {data.tip && (
        <p className="text-xs text-center text-gray-400 pt-1">💡 {data.tip}</p>
      )}
    </div>
  );
};
