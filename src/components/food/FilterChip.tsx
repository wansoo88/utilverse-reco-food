'use client';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'chef';
}

export const FilterChip = ({ label, selected, onClick, variant = 'default' }: FilterChipProps) => {
  // WCAG AA 권장 터치 타겟 ≥44px — 인접 칩 잘못 누름 방지
  if (variant === 'chef') {
    return (
      <button
        onClick={onClick}
        aria-pressed={selected}
        className={`px-4 py-2 min-h-[40px] rounded-full text-sm font-semibold border-2 transition-all cursor-pointer ${
          selected
            ? 'bg-purple-600 border-purple-600 text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]'
            : 'bg-purple-50 border-purple-300 border-dashed text-purple-700 hover:border-purple-500'
        }`}
      >
        👨‍🍳 {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`px-4 py-2 min-h-[40px] rounded-full text-sm font-medium border transition-all cursor-pointer ${
        selected
          ? 'bg-orange-500 border-orange-500 text-white shadow-sm'
          : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
      }`}
    >
      {label}
    </button>
  );
};
