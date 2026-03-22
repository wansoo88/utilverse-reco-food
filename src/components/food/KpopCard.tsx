'use client';

import { useState, useMemo } from 'react';
import { getGroupsByPopularity, getIdolsByPopularity, getIdolName, getGroupName, type KpopIdol, type KpopGroup } from '@/data/kpopIdols';
import { KpopIdolSearch } from './KpopIdolSearch';

interface KpopCardProps {
  lang: string;
  onIdolSelect?: (idol: KpopIdol) => void;
  onGroupSelect?: (group: KpopGroup) => void;
}

const LABELS: Record<string, {
  title: string; subtitle: string; tabIdol: string; tabGroup: string;
  shuffle: string; favoriteLabel: string; searchPlaceholder: string;
}> = {
  ko: { title: '⭐ K-pop 아이돌 추천 메뉴', subtitle: '좋아하는 아이돌이 즐겨먹는 메뉴를 추천받으세요', tabIdol: '인기 아이돌', tabGroup: '인기 그룹', shuffle: '🔀 셔플', favoriteLabel: '좋아하는 메뉴', searchPlaceholder: '아이돌 이름으로 바로 검색' },
  en: { title: '⭐ K-pop Idol Food Picks', subtitle: 'Discover what your favorite idols love to eat', tabIdol: 'Popular Idols', tabGroup: 'Popular Groups', shuffle: '🔀 Shuffle', favoriteLabel: 'Favorites', searchPlaceholder: 'Search idol name directly' },
  ja: { title: '⭐ K-popアイドルおすすめメニュー', subtitle: '推しアイドルの好きな料理をチェック', tabIdol: '人気アイドル', tabGroup: '人気グループ', shuffle: '🔀 シャッフル', favoriteLabel: 'お気に入り', searchPlaceholder: 'アイドル名で直接検索' },
  zh: { title: '⭐ K-pop偶像推荐美食', subtitle: '看看你喜欢的偶像爱吃什么', tabIdol: '人气偶像', tabGroup: '人气组合', shuffle: '🔀 随机', favoriteLabel: '最爱美食', searchPlaceholder: '直接搜索偶像名字' },
};

type CardTab = 'idol' | 'group';

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const KpopCard = ({ lang, onIdolSelect, onGroupSelect }: KpopCardProps) => {
  const [tab, setTab] = useState<CardTab>('idol');
  const [shuffleKey, setShuffleKey] = useState(0);
  const labels = LABELS[lang] ?? LABELS.ko;
  const locale = (lang as 'ko' | 'en' | 'ja' | 'zh') || 'ko';

  // 카드 내부 검색 핸들러
  const handleInternalSearch = (idol: KpopIdol) => {
    onIdolSelect?.(idol);
  };

  const topIdols = useMemo(
    () => {
      const idols = getIdolsByPopularity(locale, 30);
      return shuffleKey > 0 ? shuffle(idols).slice(0, 12) : idols.slice(0, 12);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, shuffleKey],
  );

  const topGroups = useMemo(
    () => getGroupsByPopularity(locale, 15),
    [locale],
  );

  return (
    <section className="rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-purple-50 p-5 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-pink-700">{labels.title}</p>
          <p className="mt-0.5 text-xs text-gray-500">{labels.subtitle}</p>
        </div>
      </div>

      {/* 카드 내부 아이돌 검색창 */}
      <div className="mb-3">
        <KpopIdolSearch
          lang={lang}
          placeholder={labels.searchPlaceholder}
          onSelect={handleInternalSearch}
        />
      </div>

      {/* 탭 + 셔플 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex rounded-xl overflow-hidden border border-pink-200 text-xs font-semibold">
          <button
            onClick={() => setTab('idol')}
            className={`px-3 py-1.5 transition-colors ${
              tab === 'idol' ? 'bg-pink-600 text-white' : 'text-pink-600 hover:bg-pink-50'
            }`}
          >
            {labels.tabIdol}
          </button>
          <button
            onClick={() => setTab('group')}
            className={`px-3 py-1.5 transition-colors ${
              tab === 'group' ? 'bg-pink-600 text-white' : 'text-pink-600 hover:bg-pink-50'
            }`}
          >
            {labels.tabGroup}
          </button>
        </div>
        {tab === 'idol' && (
          <button
            onClick={() => setShuffleKey((k) => k + 1)}
            className="rounded-xl border border-pink-200 px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-50 transition-colors"
          >
            {labels.shuffle}
          </button>
        )}
      </div>

      {/* 아이돌 그리드 */}
      {tab === 'idol' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {topIdols.map((idol) => (
            <button
              key={idol.id}
              onClick={() => onIdolSelect?.(idol)}
              className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-pink-300 hover:shadow-md active:scale-95"
            >
              <span className="text-2xl">{idol.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-gray-900 truncate">{getIdolName(idol, lang)}</p>
                  <span className="shrink-0 text-[10px] text-gray-400">{idol.groupEn}</span>
                </div>
                {idol.favoriteMenus.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {idol.favoriteMenus.slice(0, 3).map((menu) => (
                      <span
                        key={menu}
                        className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700"
                      >
                        {menu}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
                K-pop
              </span>
            </button>
          ))}
        </div>
      )}

      {/* 그룹 그리드 */}
      {tab === 'group' && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {topGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onGroupSelect?.(group)}
              className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-purple-300 hover:shadow-md active:scale-95"
            >
              <span className="text-2xl">{group.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{getGroupName(group, lang)}</p>
                <p className="text-[10px] text-gray-400">
                  {group.type === 'boy' ? '👦' : group.type === 'girl' ? '👧' : '🎤'} {group.generation} gen · {group.members.length} members
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
