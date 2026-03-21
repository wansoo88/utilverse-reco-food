'use client';

import { useState } from 'react';
import { CHEFS } from '@/data/chefs';

interface ChefCardProps {
  lang: string;
  onChefSelect?: (chefName: string, menu: string) => void;
}

const CHEF_CARD_LABELS: Record<string, { title: string; subtitle: string; season: string; badge: string }> = {
  ko: { title: '🏆 흑백요리사 셰프 추천', subtitle: '시그니처 메뉴를 AI 추천으로 바로 경험해보세요', season: '시즌', badge: '셰프 추천' },
  en: { title: '🏆 Chef Picks', subtitle: 'Experience signature dishes from the show', season: 'Season', badge: "Chef's Pick" },
  ja: { title: '🏆 シェフのおすすめ', subtitle: 'シグネチャーメニューをAIで体験', season: 'シーズン', badge: 'シェフ推薦' },
  zh: { title: '🏆 大厨推荐', subtitle: '通过AI体验招牌菜单', season: '季节', badge: '大厨推荐' },
};

export const ChefCard = ({ lang, onChefSelect }: ChefCardProps) => {
  const [selectedSeason, setSelectedSeason] = useState<1 | 2>(1);
  const labels = CHEF_CARD_LABELS[lang] ?? CHEF_CARD_LABELS.ko;

  const filteredChefs = CHEFS.filter((c) => c.season === selectedSeason);

  return (
    <section className="rounded-[2rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-purple-700">{labels.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{labels.subtitle}</p>
        </div>
        {/* 시즌 탭 */}
        <div className="flex rounded-xl overflow-hidden border border-purple-200 text-xs font-semibold">
          {([1, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-3 py-1.5 transition-colors ${
                selectedSeason === s
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              {labels.season} {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {filteredChefs.map((chef) => (
          <button
            key={chef.id}
            onClick={() => {
              const menu = chef.signature[0];
              if (menu) onChefSelect?.(chef.name, menu);
            }}
            className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-purple-300 hover:shadow-md active:scale-95"
          >
            <span className="text-2xl">{chef.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{chef.name}</p>
              <p className="text-xs text-gray-500 truncate">{chef.specialty}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {chef.signature.slice(0, 2).map((menu) => (
                  <span
                    key={menu}
                    className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700"
                  >
                    {menu}
                  </span>
                ))}
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white">
              {labels.badge}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
