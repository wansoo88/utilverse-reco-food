'use client';

interface ChefBannerProps {
  onClick: () => void;
  active: boolean;
}

export const ChefBanner = ({ onClick, active }: ChefBannerProps) => {
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
            트렌드 1위 · 흑백요리사
          </p>
          <p className={`text-base font-bold ${active ? 'text-white' : 'text-purple-800'}`}>
            👨‍🍳 흑백요리사 셰프 스타일로 추천받기
          </p>
        </div>
        <span className={`text-2xl ml-2 ${active ? 'grayscale-0' : 'opacity-60'}`}>🏆</span>
      </div>
    </button>
  );
};
