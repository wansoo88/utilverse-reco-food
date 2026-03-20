'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { CalendarView } from '@/components/food/CalendarView';
import { useFilters } from '@/hooks/useFilters';
import { useRecommend } from '@/hooks/useRecommend';
import { useCalendar } from '@/hooks/useCalendar';
import { useToast } from '@/components/ui/ToastProvider';
import { FilterSection } from '@/components/food/FilterSection';
import { RecommendCard } from '@/components/food/RecommendCard';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { FooterAd } from '@/components/ads/FooterAd';
import { validateInput } from '@/lib/security';
import { HOUSE_KEYWORDS, VIBE_KEYWORDS, BUDGET_KEYWORDS } from '@/data/filterKeywords';
import type { Locale } from '@/config/site';
import type { FilterState } from '@/types/filter';

interface HomeClientProps {
  lang: Locale;
}

export const HomeClient = ({ lang }: HomeClientProps) => {
  const t = useTranslations();
  const { showToast } = useToast();
  const { filters, updateFilters, toggleVibe, resetFilters, restored } = useFilters();
  const { status, data, error, recommend, reset } = useRecommend();
  const { entries, saveRecommendation, removeEntry, updateEntry } = useCalendar();
  const [query, setQuery] = useState('');
  const [restoredShown, setRestoredShown] = useState(false);

  // 필터 복원 토스트
  useEffect(() => {
    if (restored && !restoredShown) {
      showToast(t('home.filterRestored'), 'success');
      setRestoredShown(true);
    }
  }, [restored, restoredShown, showToast, t]);

  // 에러 토스트
  useEffect(() => {
    if (error === 'food_only') {
      showToast(t('home.blockToast'), 'error');
    }
  }, [error, showToast, t]);

  // 필터 → 검색창 키워드 자동 동기화
  const syncQueryFromFilters = useCallback((f: FilterState) => {
    const parts: string[] = [];
    const houseKw = HOUSE_KEYWORDS[lang];
    const vibeKw = VIBE_KEYWORDS[lang];
    const budgetKw = BUDGET_KEYWORDS[lang];

    if (f.house && houseKw?.[f.house]) parts.push(houseKw[f.house]);
    f.vibes.forEach((v) => { if (vibeKw?.[v]) parts.push(vibeKw[v]); });
    if (f.budget !== 'any' && budgetKw?.[f.budget]) parts.push(budgetKw[f.budget]!);

    setQuery(parts.join(' '));
  }, [lang]);

  const handleModeChange = (mode: FilterState['mode']) => {
    updateFilters({ mode });
  };

  const handleHouseChange = (house: FilterState['house']) => {
    const next = { ...filters, house };
    updateFilters({ house });
    syncQueryFromFilters(next);
  };

  const handleVibeToggle = (vibe: FilterState['vibes'][number]) => {
    const vibes = filters.vibes.includes(vibe)
      ? filters.vibes.filter((v) => v !== vibe)
      : [...filters.vibes, vibe];
    const next = { ...filters, vibes };
    toggleVibe(vibe);
    syncQueryFromFilters(next);
  };

  const handleBudgetChange = (budget: FilterState['budget']) => {
    const next = { ...filters, budget };
    updateFilters({ budget });
    syncQueryFromFilters(next);
  };

  const handleReset = () => {
    resetFilters();
    setQuery('');
    reset();
  };

  const handleSubmit = async () => {
    const validation = validateInput(query);
    if (!validation.valid) {
      if (validation.reason === 'injection') showToast(t('home.errorInjection'), 'error');
      else if (validation.reason === 'too_long') showToast(t('home.errorTooLong'), 'error');
      else if (validation.reason === 'not_food') showToast(t('home.blockToast'), 'error');
      return;
    }
    await recommend(query, filters, lang);
  };

  const handleSaveToday = () => {
    if (!data) return;

    const saved = saveRecommendation(data);
    if (saved) {
      showToast(t('calendar.saved'), 'success');
    }
  };

  const handleDeleteEntry = (date: string) => {
    const removed = removeEntry(date);
    if (removed) {
      showToast(t('calendar.deleted'), 'info');
    }
  };

  const handleUpdateEntry = (date: string, updates: { menu: string; reason: string; type: 'cook' | 'order' }) => {
    const updated = updateEntry(date, updates);
    if (updated) {
      showToast(t('calendar.updated'), 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">오늘뭐먹지</span>
          <LanguageSelector current={lang} />
        </div>
      </header>

      {/* 메인 */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">
        {/* 히어로 */}
        <div className="text-center pt-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('home.title')}
          </h1>
          <p className="mt-1 text-gray-500 text-sm">{t('home.subtitle')}</p>
        </div>

        {/* 필터 섹션 */}
        <FilterSection
          filters={filters}
          onModeChange={handleModeChange}
          onHouseChange={handleHouseChange}
          onVibeToggle={handleVibeToggle}
          onBudgetChange={handleBudgetChange}
          t={t}
        />

        {/* 검색창 */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder={t('home.searchPlaceholder')}
            maxLength={200}
            className="w-full px-4 py-3 pr-20 rounded-2xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
          />
          {query && (
            <button
              onClick={handleReset}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
            >
              ✕
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {status === 'loading' ? '...' : t('home.recommend')}
          </button>
        </div>

        {/* 로딩 */}
        {status === 'loading' && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {/* 결과 */}
        {status === 'success' && data && (
          <div className="space-y-4">
            <RecommendCard data={data} isFallback={data._fallback} />
            <button
              onClick={handleSaveToday}
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600"
            >
              {t('calendar.saveToday')}
            </button>
          </div>
        )}

        <CalendarView
          entries={entries}
          lang={lang}
          title={t('calendar.title')}
          emptyLabel={t('calendar.empty')}
          cookLabel={t('calendar.cook')}
          orderLabel={t('calendar.order')}
          weekLabel={t('calendar.week')}
          monthLabel={t('calendar.month')}
          deleteLabel={t('calendar.delete')}
          editLabel={t('calendar.edit')}
          saveLabel={t('calendar.save')}
          cancelLabel={t('calendar.cancel')}
          menuPlaceholder={t('calendar.menuPlaceholder')}
          reasonPlaceholder={t('calendar.reasonPlaceholder')}
          onDelete={handleDeleteEntry}
          onUpdate={handleUpdateEntry}
        />
      </main>

      {/* 푸터 + 광고 */}
      <footer className="border-t border-gray-100 bg-white">
        <FooterAd />
        <div className="max-w-5xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          <p>{t('footer.copyright')}</p>
          <p className="mt-0.5">{t('footer.description')}</p>
        </div>
      </footer>
    </div>
  );
};
