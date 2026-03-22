'use client';

import { useState, useMemo } from 'react';
import { CHEFS } from '@/data/chefs';

interface ChefCardProps {
  lang: string;
  onChefSelect?: (chefName: string, menu: string) => void;
}

const LABELS: Record<string, {
  title: string; subtitle: string; season: string; badge: string;
  tabTop: string; tabOther: string; shuffle: string;
}> = {
  ko: { title: '🏆 흑백요리사 셰프 추천', subtitle: '시그니처 메뉴를 AI 추천으로 바로 경험해보세요', season: '시즌', badge: '셰프 추천', tabTop: 'Top 10', tabOther: '출연자', shuffle: '🔀 셔플' },
  en: { title: '🏆 Chef Picks', subtitle: 'Experience signature dishes from the show', season: 'Season', badge: "Chef's Pick", tabTop: 'Top 10', tabOther: 'Cast', shuffle: '🔀 Shuffle' },
  ja: { title: '🏆 シェフのおすすめ', subtitle: 'シグネチャーメニューをAIで体験', season: 'シーズン', badge: 'シェフ推薦', tabTop: 'Top 10', tabOther: '出演者', shuffle: '🔀 シャッフル' },
  zh: { title: '🏆 大厨推荐', subtitle: '通过AI体验招牌菜单', season: '季节', badge: '大厨推荐', tabTop: 'Top 10', tabOther: '参赛者', shuffle: '🔀 随机' },
};

type ChefTab = 'top' | 'other';

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ChefCard = ({ lang, onChefSelect }: ChefCardProps) => {
  const [selectedSeason, setSelectedSeason] = useState<1 | 2>(1);
  const [chefTab, setChefTab] = useState<ChefTab>('top');
  const [shuffleKey, setShuffleKey] = useState(0);
  const labels = LABELS[lang] ?? LABELS.ko;

  const seasonChefs = CHEFS.filter((c) => c.season === selectedSeason);
  const topChefs = seasonChefs.filter((c) => c.rank <= 10).sort((a, b) => a.rank - b.rank);
  const otherChefs = seasonChefs.filter((c) => c.rank > 10);

  // 출연자 랜덤 10명 (셔플 키 변경 시 리셔플)
  const shuffledOthers = useMemo(
    () => shuffle(otherChefs).slice(0, 10),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedSeason, shuffleKey],
  );

  const displayChefs = chefTab === 'top' ? topChefs : shuffledOthers;

  return (
    <section className="rounded-[2rem] border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 shadow-sm">
      {/* 헤더 */}
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
              onClick={() => { setSelectedSeason(s); setChefTab('top'); }}
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

      {/* Top 10 / 출연자 탭 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex rounded-xl overflow-hidden border border-purple-200 text-xs font-semibold">
          <button
            onClick={() => setChefTab('top')}
            className={`px-3 py-1.5 transition-colors ${
              chefTab === 'top'
                ? 'bg-purple-600 text-white'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            {labels.tabTop}
          </button>
          <button
            onClick={() => setChefTab('other')}
            className={`px-3 py-1.5 transition-colors ${
              chefTab === 'other'
                ? 'bg-purple-600 text-white'
                : 'text-purple-600 hover:bg-purple-50'
            }`}
          >
            {labels.tabOther}
          </button>
        </div>
        {/* 출연자 탭에서만 셔플 버튼 */}
        {chefTab === 'other' && (
          <button
            onClick={() => setShuffleKey((k) => k + 1)}
            className="rounded-xl border border-purple-200 px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-50 transition-colors"
          >
            {labels.shuffle}
          </button>
        )}
      </div>

      {/* 셰프 그리드 */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {displayChefs.map((chef) => (
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
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-gray-900 truncate">{chef.name}</p>
                {chef.rank <= 10 && (
                  <span className="shrink-0 rounded-full bg-yellow-400 px-1.5 py-0.5 text-[9px] font-bold text-yellow-900">
                    #{chef.rank}
                  </span>
                )}
              </div>
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
