'use client';

import { BAKERY_ENTRIES, type BakeryEntry } from '@/data/bakeryShow';

interface BakeryShowCardProps {
  lang: string;
  onMenuSearch: (searchQuery: string) => void;
}

const LABELS: Record<string, { title: string; subtitle: string; map: string }> = {
  ko: { title: '천하제빵', subtitle: '넷플릭스 천하제빵 출연진의 빵집 & 대표 메뉴', map: '📍 지도' },
  en: { title: 'Bake Your Dream', subtitle: 'Netflix baking show bakeries & signature items', map: '📍 Map' },
  ja: { title: '天下製パン', subtitle: 'Netflix製パン番組の出演者ベーカリー＆看板メニュー', map: '📍 地図' },
  zh: { title: '天下制面包', subtitle: 'Netflix烘焙节目参赛者面包店＆招牌', map: '📍 地图' },
};

export const BakeryShowCard = ({ lang, onMenuSearch }: BakeryShowCardProps) => {
  const labels = LABELS[lang] ?? LABELS.ko;

  const handleNaverMap = (entry: BakeryEntry) => {
    const url = `https://map.naver.com/v5/search/${encodeURIComponent(entry.naverMapQuery)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-[2rem] border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🍞</span>
        <p className="text-sm font-semibold text-amber-700">{labels.title}</p>
      </div>
      <p className="text-xs text-gray-500 mb-3">{labels.subtitle}</p>

      <div className="space-y-2.5">
        {BAKERY_ENTRIES.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white px-3 py-2.5 shadow-sm"
          >
            <span className="text-xl shrink-0">{entry.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{entry.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{entry.bakeryName} · {entry.location}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.signature.slice(0, 3).map((menu) => (
                  <button
                    key={menu}
                    onClick={() => onMenuSearch(`${entry.name} ${menu}`)}
                    className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    {menu}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => handleNaverMap(entry)}
              className="shrink-0 rounded-lg bg-green-500 hover:bg-green-600 px-2.5 py-1.5 text-[10px] font-bold text-white transition-colors"
              title="네이버 지도에서 보기"
            >
              {labels.map}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
