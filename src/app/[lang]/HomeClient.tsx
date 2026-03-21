'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useFilters } from '@/hooks/useFilters';
import { useRecommend } from '@/hooks/useRecommend';
import { useCalendar } from '@/hooks/useCalendar';
import { useToast } from '@/components/ui/ToastProvider';
import { FilterSection } from '@/components/food/FilterSection';
import { ChefCard } from '@/components/food/ChefCard';
import { TimeSuggestCard } from '@/components/food/TimeSuggestCard';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { validateInput } from '@/lib/security';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { trackEvent } from '@/lib/analytics';
import type { Locale } from '@/config/site';
import type { FilterState } from '@/types/filter';

type SearchMode = 'text' | 'ai' | 'fridge';

interface HomeClientProps {
  lang: Locale;
}

const RecommendCard = dynamic(
  () => import('@/components/food/RecommendCard').then((m) => m.RecommendCard),
  { loading: () => <div className="min-h-[200px] animate-pulse rounded-2xl bg-gray-100" /> },
);

const CalendarView = dynamic(
  () => import('@/components/food/CalendarView').then((m) => m.CalendarView),
  { loading: () => <div className="min-h-[360px] animate-pulse rounded-3xl bg-gray-100" /> },
);

export const HomeClient = ({ lang }: HomeClientProps) => {
  const t = useTranslations();
  const { showToast } = useToast();
  const { filters, updateFilters, toggleVibe, resetFilters, restored } = useFilters();
  const { status, data, error, recommend, reset } = useRecommend();
  const { entries, saveRecommendation, removeEntry, updateEntry, getRecentMenus } = useCalendar();

  const [searchMode, setSearchMode] = useState<SearchMode>('ai');
  const [query, setQuery] = useState('');
  const [fridgeInput, setFridgeInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [restoredShown, setRestoredShown] = useState(false);

  const quickTopics = SEO_KEYWORDS.slice(0, 8);

  // 필터 복원 토스트
  useEffect(() => {
    if (restored && !restoredShown) {
      showToast(t('home.filterRestored'), 'success');
      setRestoredShown(true);
    }
  }, [restored, restoredShown, showToast, t]);

  // 에러 토스트
  useEffect(() => {
    if (error === 'food_only') showToast(t('home.blockToast'), 'error');
  }, [error, showToast, t]);

  const handleReset = useCallback(() => {
    resetFilters();
    setQuery('');
    setFridgeInput('');
    reset();
  }, [resetFilters, reset]);

  const handleModeChange = (mode: FilterState['mode']) => updateFilters({ mode });
  const handleHouseChange = (house: FilterState['house']) => {
    updateFilters({ house: filters.house === house ? null : house });
  };
  const handleVibeToggle = (vibe: FilterState['vibes'][number]) => toggleVibe(vibe);
  const handleBudgetChange = (budget: FilterState['budget']) => updateFilters({ budget });

  // 공통 제출 로직
  const handleSubmit = useCallback(async () => {
    // 최근 7일 식단으로 중복 추천 방지 exclude 목록 생성
    const recentMenus = getRecentMenus(7);

    if (searchMode === 'fridge') {
      if (!fridgeInput.trim()) return;
      const ingredients = fridgeInput.split(',').map((s) => s.trim()).filter(Boolean);
      trackEvent('fridge_submit', { lang, count: ingredients.length });
      await recommend('', { ...filters, mode: 'cook' }, lang, ingredients, recentMenus);
      return;
    }

    const validation = validateInput(query);
    if (!validation.valid) {
      if (validation.reason === 'injection') showToast(t('home.errorInjection'), 'error');
      else if (validation.reason === 'too_long') showToast(t('home.errorTooLong'), 'error');
      else if (validation.reason === 'not_food') showToast(t('home.blockToast'), 'error');
      return;
    }

    const activeFilters: FilterState =
      searchMode === 'text'
        ? { mode: 'any', house: null, baby: null, vibes: [], budget: 'any' }
        : filters;

    trackEvent('recommend_submit', { lang, mode: searchMode, has_query: Boolean(query.trim()) });
    await recommend(query, activeFilters, lang, undefined, recentMenus);
  }, [searchMode, fridgeInput, query, filters, lang, recommend, showToast, t]);

  useEffect(() => {
    if (status === 'success' && data) {
      trackEvent('recommend_success', { lang, result_type: data.type, fallback: Boolean(data._fallback) });
    }
  }, [data, lang, status]);

  const handleSaveToday = () => {
    if (!data) return;
    const saved = saveRecommendation(data);
    if (saved) {
      trackEvent('calendar_save', { lang, result_type: data.type });
      showToast(t('calendar.saved'), 'success');
    }
  };

  const handleDeleteEntry = (date: string) => {
    if (removeEntry(date)) showToast(t('calendar.deleted'), 'info');
  };
  const handleUpdateEntry = (date: string, updates: { menu: string; reason: string; type: 'cook' | 'order' }) => {
    if (updateEntry(date, updates)) showToast(t('calendar.updated'), 'success');
  };

  // 모드별 UI 텍스트
  const modeConfig = {
    text:  { placeholder: t('search.placeholderText'),  submit: t('search.submitText') },
    ai:    { placeholder: t('search.placeholderAi'),    submit: t('search.submitAi') },
    fridge:{ placeholder: t('search.placeholderFridge'), submit: t('search.submitFridge') },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-extrabold text-gray-900 text-lg">오늘뭐먹지</span>
          <LanguageSelector current={lang} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-6">

        {/* ── 히어로 (컴팩트) ── */}
        <section className="flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white px-6 py-4 shadow-sm">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              {t('home.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t('home.subtitle')}</p>
          </div>
          <div className="shrink-0 w-20 h-20 md:w-28 md:h-28">
            <Image
              src="/hero-bowl.svg"
              alt="Food bowl"
              width={112}
              height={112}
              priority
              className="h-full w-full"
            />
          </div>
        </section>

        {/* ── 통합 검색 + 결과 블록 ── */}
        <section className="rounded-[2rem] border border-gray-200 bg-white shadow-md overflow-hidden">

          {/* 모드 탭 */}
          <div className="flex border-b border-gray-100">
            {(['text', 'ai', 'fridge'] as SearchMode[]).map((mode) => {
              const labels: Record<SearchMode, string> = {
                text: t('search.modeText'),
                ai: t('search.modeAi'),
                fridge: t('search.modeFridge'),
              };
              return (
                <button
                  key={mode}
                  onClick={() => { setSearchMode(mode); reset(); }}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    searchMode === mode
                      ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {labels[mode]}
                </button>
              );
            })}
          </div>

          <div className="p-5 space-y-4">
            {/* 냉장고 힌트 */}
            {searchMode === 'fridge' && (
              <p className="text-xs text-sky-600 bg-sky-50 rounded-xl px-3 py-2">
                {t('search.fridgeHint')}
              </p>
            )}

            {/* 검색 입력 */}
            <div className="relative">
              <input
                type="text"
                value={searchMode === 'fridge' ? fridgeInput : query}
                onChange={(e) =>
                  searchMode === 'fridge'
                    ? setFridgeInput(e.target.value)
                    : setQuery(e.target.value)
                }
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={modeConfig[searchMode].placeholder}
                maxLength={searchMode === 'fridge' ? 150 : 200}
                className={`w-full rounded-2xl border px-5 py-3.5 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 ${
                  searchMode === 'fridge'
                    ? 'border-sky-200 focus:ring-sky-400 focus:border-transparent'
                    : 'border-gray-200 focus:ring-orange-400 focus:border-transparent'
                }`}
              />
              {(query || fridgeInput) && (
                <button
                  onClick={handleReset}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50 ${
                  searchMode === 'fridge'
                    ? 'bg-sky-500 hover:bg-sky-600'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {status === 'loading' ? '...' : modeConfig[searchMode].submit}
              </button>
            </div>

            {/* AI 모드 필터 (접기/펼치기) */}
            {searchMode === 'ai' && (
              <div>
                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <span>{showFilters ? '▲' : '▼'}</span>
                  {showFilters ? t('search.filterHide') : t('search.filterToggle')}
                </button>
                {showFilters && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <FilterSection
                      filters={filters}
                      onModeChange={handleModeChange}
                      onHouseChange={handleHouseChange}
                      onVibeToggle={handleVibeToggle}
                      onBudgetChange={handleBudgetChange}
                      t={t}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 로딩 */}
            {status === 'loading' && (
              <div className="flex justify-center py-6">
                <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              </div>
            )}

            {/* 결과 — 검색창 바로 아래 */}
            {status === 'success' && data && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <RecommendCard
                  data={data}
                  lang={lang}
                  isFallback={data._fallback}
                  labelRecipe={t('recipe.site')}
                  labelYoutube={t('recipe.youtube')}
                  labelRecipeLoading={t('recipe.loading')}
                  labelRecipeTitle={t('recipe.title')}
                />
                <button
                  onClick={handleSaveToday}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600"
                >
                  {t('calendar.saveToday')}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── 시간대별 자동 추천 ── */}
        <TimeSuggestCard
          messages={{
            morning: t('timeSuggest.morning'),
            lunch: t('timeSuggest.lunch'),
            afternoon: t('timeSuggest.afternoon'),
            dinner: t('timeSuggest.dinner'),
            late: t('timeSuggest.late'),
            cta: t('timeSuggest.cta'),
          }}
          onSuggest={(suggestQuery) => {
            setSearchMode('ai');
            setQuery(suggestQuery);
            recommend(suggestQuery, filters, lang, undefined, getRecentMenus(7));
          }}
        />

        {/* ── 인기 탐색 주제 ── */}
        <section className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-orange-600">{t('home.popularTitle')}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('home.popularSubtitle')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/${lang}/eat/menu/${topic.slug}`}
                onClick={() => trackEvent('quick_topic_click', { lang, slug: topic.slug })}
                className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                {topic[lang].title}
              </Link>
            ))}
          </div>
        </section>

        {/* ── 흑백요리사 셰프 카드 ── */}
        <ChefCard
          lang={lang}
          onChefSelect={(chefName, menu) => {
            setSearchMode('ai');
            setQuery(`${chefName} 스타일 ${menu}`);
            trackEvent('chef_card_click', { lang, chef: chefName, menu });
            recommend(`${chefName} 스타일 ${menu}`, { ...filters, vibes: ['chef'] }, lang, undefined, getRecentMenus(7));
          }}
        />

        {/* ── 식단 캘린더 ── */}
        <div className="defer-render">
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
            insightMessages={{
              title: t('insight.title'),
              cookHeavy: t('insight.cookHeavy'),
              orderHeavy: t('insight.orderHeavy'),
              balanced: t('insight.balanced'),
              noData: t('insight.noData'),
            }}
            onDelete={handleDeleteEntry}
            onUpdate={handleUpdateEntry}
          />
        </div>
      </main>

      <SiteFooter
        lang={lang}
        copyright={t('footer.copyright')}
        description={t('footer.description')}
      />
    </div>
  );
};
