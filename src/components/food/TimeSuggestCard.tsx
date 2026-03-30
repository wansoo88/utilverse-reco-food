'use client';

import { useMemo } from 'react';

// 시간대 키 타입
type TimeSlot = 'morning' | 'lunch' | 'afternoon' | 'dinner' | 'late';

// 시간대별 자동 제안 키워드 (검색창에 주입)
const TIME_SLOT_QUERIES: Record<string, Record<TimeSlot, string>> = {
  ko: { morning: '아침 간단하게', lunch: '점심 든든하게', afternoon: '간식 달달하게', dinner: '저녁 맛있게', late: '야식 빠르게' },
  en: { morning: 'quick breakfast', lunch: 'hearty lunch', afternoon: 'sweet snack', dinner: 'tasty dinner', late: 'late night snack' },
  ja: { morning: '朝食 簡単に', lunch: 'ランチ しっかり', afternoon: 'おやつ 甘く', dinner: '夕食 美味しく', late: '夜食 さっと' },
  zh: { morning: '早餐 简单', lunch: '午餐 丰盛', afternoon: '下午茶 甜点', dinner: '晚餐 美味', late: '宵夜 快速' },
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
    subtitle: string;
  };
  onSuggest: (query: string) => void;
}

export const TimeSuggestCard = ({ messages }: TimeSuggestCardProps) => {
  const slot = useMemo(() => getTimeSlot(new Date().getHours()), []);
  const message = messages[slot];

  return (
    <div className="rounded-[2rem] border border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 shadow-sm">
      <p className="text-sm font-medium text-gray-700">{message}</p>
      <p className="mt-1 text-sm text-gray-500">{messages.subtitle}</p>
    </div>
  );
};
