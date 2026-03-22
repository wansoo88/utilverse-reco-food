'use client';

import type { HistoryEntry } from '@/hooks/useRecommendHistory';

interface RecommendHistoryProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  label?: string;
}

export const RecommendHistory = ({ history, onRestore, label = '최근 추천' }: RecommendHistoryProps) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {history.map((entry) => {
          const firstItem = entry.result.items[0];
          return (
            <button
              key={entry.id}
              onClick={() => onRestore(entry)}
              className="flex-none flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors shadow-sm"
            >
              <span>{firstItem?.emoji ?? '🍽️'}</span>
              <span className="max-w-[80px] truncate">{firstItem?.name ?? '—'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
