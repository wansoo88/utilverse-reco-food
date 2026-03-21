'use client';

import { useMemo } from 'react';

// 시간대 키 타입
type TimeSlot = 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late';

// 시간대별 자동 제안 키워드 (검색창에 주입)
const TIME_SLOT_QUERIES: Record<TimeSlot, string> = {
  morning: '아침 간단하게',
  lunch: '점심 든든하게',
  afternoon: '간식 달달하게',
  dinner: '저녁 맛있게',
  late: '야식 빠르게',
};

const getTimeSlot = (hour: number): TimeSlot => {
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 15) return 'lunch';
  if (hour >= 15 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 22) return 'dinner';
  return 'late';
};

interface TimeSuggestCardProps {
  messages: {
    morning: string;
    lunch: string;
    afternoon: string;
    dinner: string;
    late: string;
    cta: string;
  };
  onSuggest: (query: string) => void;
}

export const TimeSuggestCard = ({ messages, onSuggest }: TimeSuggestCardProps) => {
  const slot = useMemo(() => getTimeSlot(new Date().getHours()), []);
  const message = messages[slot];
  const query = TIME_SLOT_QUERIES[slot];

  return (
    <div className="flex items-center justify-between gap-4 rounded-[2rem] border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 shadow-sm">
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <button
        onClick={() => onSuggest(query)}
        className="shrink-0 rounded-2xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
      >
        {messages.cta}
      </button>
    </div>
  );
};
