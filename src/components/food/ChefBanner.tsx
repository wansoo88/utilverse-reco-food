'use client';

interface ChefBannerProps {
  lang: string;
  onClick: () => void;
  active: boolean;
}

const LABELS: Record<string, { tag: string; cta: string }> = {
  ko: { tag: '트렌드 1위 · 흑백요리사', cta: '👨‍🍳 흑백요리사 셰프 스타일로 추천받기' },
  en: { tag: 'Trending #1 · Black & White Chef', cta: '👨‍🍳 Get recommendations in chef style' },
  ja: { tag: 'トレンド1位 · 白黒シェフ', cta: '👨‍🍳 シェフスタイルでおすすめを見る' },
  zh: { tag: '热门第1 · 黑白厨师', cta: '👨‍🍳 以大厨风格获取推荐' },
};

export const ChefBanner = ({ lang, onClick, active }: ChefBannerProps) => {
  const labels = LABELS[lang] ?? LABELS.ko;

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl p-4 text-left transition-all cursor-pointer border-2 ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-violet-500 border-purple-500 text-white shadow-lg shadow-purple-200'
          : 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 border-dashed hover:border-purple-400'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-semibold mb-0.5 ${active ? 'text-purple-100' : 'text-purple-400'}`}>
            {labels.tag}
          </p>
          <p className={`text-base font-bold ${active ? 'text-white' : 'text-purple-800'}`}>
            {labels.cta}
          </p>
        </div>
        <span className={`text-2xl ml-2 ${active ? 'grayscale-0' : 'opacity-60'}`}>🏆</span>
      </div>
    </button>
  );
};
