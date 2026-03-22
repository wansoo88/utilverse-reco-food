'use client';
import { FilterChip } from './FilterChip';
import { ChefBanner } from './ChefBanner';
import type { FilterState } from '@/types/filter';

interface FilterSectionProps {
  filters: FilterState;
  onModeChange: (mode: FilterState['mode']) => void;
  onHouseChange: (house: FilterState['house']) => void;
  onBabyChange?: (baby: FilterState['baby']) => void;
  onVibeToggle: (vibe: FilterState['vibes'][number]) => void;
  onBudgetChange: (budget: FilterState['budget']) => void;
  t: (key: string) => string;
}

export const FilterSection = ({
  filters,
  onModeChange,
  onHouseChange,
  onBabyChange,
  onVibeToggle,
  onBudgetChange,
  t,
}: FilterSectionProps) => {
  const MODES: { key: FilterState['mode']; label: string }[] = [
    { key: 'cook', label: t('filter.cook') },
    { key: 'order', label: t('filter.order') },
    { key: 'any', label: t('filter.any') },
  ];

  const HOUSES: { key: NonNullable<FilterState['house']>; label: string }[] = [
    { key: 'solo', label: t('filter.solo') },
    { key: 'couple', label: t('filter.couple') },
    { key: 'family', label: t('filter.family') },
  ];

  const VIBES: { key: FilterState['vibes'][number]; label: string; isChef?: boolean }[] = [
    { key: 'chef', label: t('filter.chef'), isChef: true },
    { key: 'sweet', label: t('filter.sweet') },
    { key: 'rain', label: t('filter.rain') },
    { key: 'late', label: t('filter.late') },
    { key: 'diet', label: t('filter.diet') },
  ];

  const BUDGETS: { key: FilterState['budget']; label: string }[] = [
    { key: 'any', label: t('filter.any') },
    { key: 'under10k', label: t('filter.under10k') },
    { key: 'under20k', label: t('filter.under20k') },
    { key: 'over20k', label: t('filter.over20k') },
  ];

  return (
    <div className="space-y-4">
      {/* 흑백요리사 배너 */}
      <ChefBanner
        active={filters.vibes.includes('chef')}
        onClick={() => onVibeToggle('chef')}
      />

      {/* 어떻게? */}
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">{t('filter.mode')}</p>
        <div className="flex flex-wrap gap-2">
          {MODES.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filters.mode === key}
              onClick={() => onModeChange(key)}
            />
          ))}
        </div>
      </div>

      {/* 누구와? */}
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">{t('filter.house')}</p>
        <div className="flex flex-wrap gap-2">
          {HOUSES.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filters.house === key}
              onClick={() => onHouseChange(filters.house === key ? null : key)}
            />
          ))}
        </div>
      </div>

      {/* 가족 → 아이 유무 서브옵션 */}
      {filters.house === 'family' && onBabyChange && (
        <div className="ml-4 flex gap-2">
          <FilterChip
            label={t('filter.withKids')}
            selected={filters.baby === 'withKids'}
            onClick={() => onBabyChange(filters.baby === 'withKids' ? null : 'withKids')}
          />
          <FilterChip
            label={t('filter.noKids')}
            selected={filters.baby === 'noKids'}
            onClick={() => onBabyChange(filters.baby === 'noKids' ? null : 'noKids')}
          />
        </div>
      )}

      {/* 상황 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">{t('filter.vibe')}</p>
        <div className="flex flex-wrap gap-2">
          {VIBES.map(({ key, label, isChef }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filters.vibes.includes(key)}
              onClick={() => onVibeToggle(key)}
              variant={isChef ? 'chef' : 'default'}
            />
          ))}
        </div>
      </div>

      {/* 예산 */}
      <div>
        <p className="text-xs font-semibold text-gray-400 mb-2">{t('filter.budget')}</p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map(({ key, label }) => (
            <FilterChip
              key={key}
              label={label}
              selected={filters.budget === key}
              onClick={() => onBudgetChange(key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
