import type { Vibe, Budget } from '@/types/filter';

export const HOUSE_KEYWORDS: Record<string, Record<string, string>> = {
  ko: { solo: '혼밥', couple: '2인', family: '가족' },
  en: { solo: 'solo', couple: 'couple', family: 'family' },
  ja: { solo: '一人', couple: '二人', family: '家族' },
  zh: { solo: '一人', couple: '两人', family: '家庭' },
};

export const VIBE_KEYWORDS: Record<string, Record<Vibe, string>> = {
  ko: { chef: '흑백요리사', sweet: '단짠단짠', rain: '비오는날', late: '야근후', diet: '다이어트' },
  en: { chef: "chef's pick", sweet: 'sweet&salty', rain: 'rainy day', late: 'after work', diet: 'diet' },
  ja: { chef: 'シェフ推薦', sweet: '甘辛', rain: '雨の日', late: '残業後', diet: 'ダイエット' },
  zh: { chef: '大厨推荐', sweet: '甜咸', rain: '下雨天', late: '加班后', diet: '减肥' },
};

export const BUDGET_KEYWORDS: Record<string, Partial<Record<Budget, string>>> = {
  ko: { under10k: '만원이하', under20k: '2만이하', over20k: '2만이상' },
  en: { under10k: 'under $10', under20k: 'under $20', over20k: '$20+' },
  ja: { under10k: '1000円以下', under20k: '2000円以下', over20k: '2000円+' },
  zh: { under10k: '60元以下', under20k: '120元以下', over20k: '120元+' },
};
