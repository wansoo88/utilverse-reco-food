'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useFilters } from '@/hooks/useFilters';
import { useRecommend, isDualResponse, isSingleResponse } from '@/hooks/useRecommend';
import { useCalendar } from '@/hooks/useCalendar';
import { useToast } from '@/components/ui/ToastProvider';
import { FilterSection } from '@/components/food/FilterSection';
import { ChefCard } from '@/components/food/ChefCard';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { validateInput } from '@/lib/security';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { trackEvent } from '@/lib/analytics';
import { HOUSE_KEYWORDS, VIBE_KEYWORDS, BUDGET_KEYWORDS } from '@/data/filterKeywords';
import type { Locale } from '@/config/site';
import type { FilterState } from '@/types/filter';

type SearchMode = 'text' | 'ai';

interface HomeClientProps {
  lang: Locale;
}

const RecommendCard = dynamic(
  () => import('@/components/food/RecommendCard').then((m) => m.RecommendCard),
  { loading: () => <div className="min-h-[200px] animate-pulse rounded-2xl bg-gray-100" /> },
);

const DualResultView = dynamic(
  () => import('@/components/food/DualResultView').then((m) => m.DualResultView),
  { loading: () => <div className="min-h-[300px] animate-pulse rounded-2xl bg-gray-100" /> },
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
  const [showFilters, setShowFilters] = useState(false);
  const [restoredShown, setRestoredShown] = useState(false);

  const quickTopics = SEO_KEYWORDS.slice(0, 8);

  // 시간대별 인사 메시지
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return t('timeSuggest.morning');
    if (hour >= 10 && hour < 15) return t('timeSuggest.lunch');
    if (hour >= 15 && hour < 18) return t('timeSuggest.afternoon');
    if (hour >= 18 && hour < 22) return t('timeSuggest.dinner');
    return t('timeSuggest.late');
  }, [t]);

  useEffect(() => {
    if (restored && !restoredShown) {
      showToast(t('home.filterRestored'), 'success');
      setRestoredShown(true);
    }
  }, [restored, restoredShown, showToast, t]);

  useEffect(() => {
    if (error === 'food_only') showToast(t('home.blockToast'), 'error');
  }, [error, showToast, t]);

  const handleReset = useCallback(() => {
    resetFilters();
    setQuery('');
    reset();
  }, [resetFilters, reset]);

  // 필터 키워드를 검색창에 토글 (추가/제거)
  const toggleKeyword = useCallback((keyword: string | undefined, removing: boolean) => {
    if (!keyword) return;
    setQuery((prev) => {
      const words = prev.split(/\s+/).filter(Boolean);
      if (removing) {
        return words.filter((w) => w !== keyword).join(' ');
      }
      if (words.includes(keyword)) return prev;
      return [...words, keyword].join(' ');
    });
  }, []);

  const handleModeChange = (mode: FilterState['mode']) => {
    updateFilters({ mode });
  };

  const handleHouseChange = (house: FilterState['house']) => {
    const kw = HOUSE_KEYWORDS[lang] ?? HOUSE_KEYWORDS.ko;
    const isDeselect = filters.house === house;
    if (isDeselect && house) {
      toggleKeyword(kw[house], true);
      updateFilters({ house: null, baby: null });
    } else if (house) {
      if (filters.house) toggleKeyword(kw[filters.house], true);
      toggleKeyword(kw[house], false);
      updateFilters({ house, baby: null });
    }
  };

  const BABY_KEYWORDS: Record<string, Record<string, string>> = {
    ko: { withKids: '아이있음', noKids: '아이없음' },
    en: { withKids: 'with kids', noKids: 'no kids' },
    ja: { withKids: '子供あり', noKids: '子供なし' },
    zh: { withKids: '有孩子', noKids: '无孩子' },
  };

  const handleBabyChange = (baby: FilterState['baby']) => {
    const kw = BABY_KEYWORDS[lang] ?? BABY_KEYWORDS.ko;
    // 기존 baby 키워드 제거
    if (filters.baby) toggleKeyword(kw[filters.baby], true);
    // 새 baby 키워드 추가 (null이면 제거만)
    if (baby) toggleKeyword(kw[baby], false);
    updateFilters({ baby });
  };

  const handleVibeToggle = (vibe: FilterState['vibes'][number]) => {
    const kw = VIBE_KEYWORDS[lang] ?? VIBE_KEYWORDS.ko;
    const isActive = filters.vibes.includes(vibe);
    toggleKeyword(kw[vibe], isActive);
    toggleVibe(vibe);
  };

  const handleBudgetChange = (budget: FilterState['budget']) => {
    const kw = BUDGET_KEYWORDS[lang] ?? BUDGET_KEYWORDS.ko;
    if (filters.budget !== 'any') {
      toggleKeyword(kw[filters.budget], true);
    }
    if (budget !== 'any') {
      toggleKeyword(kw[budget], false);
    }
    updateFilters({ budget });
  };

  // 공통 제출 로직
  const handleSubmit = useCallback(async () => {
    const recentMenus = getRecentMenus(7);

    // AI 모드: 입력값 필수
    if (searchMode === 'ai' && !query.trim()) {
      showToast('🤖 추천받을 내용을 입력해주세요', 'error');
      return;
    }

    const validation = validateInput(query);
    if (!validation.valid) {
      if (validation.reason === 'injection') showToast(t('home.errorInjection'), 'error');
      else if (validation.reason === 'too_long') showToast(t('home.errorTooLong'), 'error');
      else if (validation.reason === 'not_food') showToast(t('home.blockToast'), 'error');
      return;
    }

    // AI 모드: 듀얼(cook+order 동시), text 모드: 단일
    const isDual = searchMode === 'ai';
    trackEvent('recommend_submit', { lang, mode: searchMode, has_query: Boolean(query.trim()), dual: isDual });
    await recommend(query, filters, lang, undefined, recentMenus, isDual);
  }, [searchMode, query, filters, lang, recommend, showToast, t, getRecentMenus]);

  useEffect(() => {
    if (status === 'success' && data) {
      if (isDualResponse(data)) {
        trackEvent('recommend_success', { lang, result_type: 'dual', fallback: Boolean(data._fallback) });
      } else if (isSingleResponse(data)) {
        trackEvent('recommend_success', { lang, result_type: data.type, fallback: Boolean(data._fallback) });
      }
    }
  }, [data, lang, status]);

  const handleSaveToday = () => {
    if (!data) return;
    if (isDualResponse(data)) {
      const cookData = { type: 'cook' as const, items: data.cook.items, tip: data.cook.tip };
      const saved = saveRecommendation(cookData);
      if (saved) {
        trackEvent('calendar_save', { lang, result_type: 'cook' });
        showToast(t('calendar.saved'), 'success');
      }
      return;
    }
    if (isSingleResponse(data)) {
      const saved = saveRecommendation(data);
      if (saved) {
        trackEvent('calendar_save', { lang, result_type: data.type });
        showToast(t('calendar.saved'), 'success');
      }
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── 헤더 ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-extrabold text-gray-900 text-lg">오늘뭐먹지</span>
          <LanguageSelector current={lang} />
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">

        {/* ── 히어로 (컴팩트) ── */}
        <section className="flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white px-6 py-4 shadow-sm">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              {t('home.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t('home.subtitle')}</p>
            <p className="mt-2 text-sm font-medium text-gray-700">{timeGreeting}</p>
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
            {(['text', 'ai'] as SearchMode[]).map((mode) => {
              const labels: Record<SearchMode, string> = {
                text: t('search.modeText'),
                ai: t('search.modeAi'),
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
            {/* AI 모드 힌트 */}
            {searchMode === 'ai' && (
              <p className="text-xs text-purple-600 bg-purple-50 rounded-xl px-3 py-2">
                🤖 AI가 해먹기와 시켜먹기를 동시에 추천해드려요
              </p>
            )}

            {/* 검색 입력 */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={modeConfig[searchMode].placeholder}
                maxLength={200}
                className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 pr-32 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
              {query && (
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
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : modeConfig[searchMode].submit}
              </button>
            </div>

            {/* 메뉴 추천 전용 필터 (접기/펼치기) */}
            {searchMode === 'text' && (
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
                      onBabyChange={handleBabyChange}
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

            {/* 결과 */}
            {status === 'success' && data && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {isDualResponse(data) && (
                  <DualResultView data={data} lang={lang} />
                )}

                {isSingleResponse(data) && (
                  <RecommendCard
                    data={data}
                    lang={lang}
                    isFallback={data._fallback}
                  />
                )}

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

        {/* ── 인기 추천 상황 ── */}
        <section className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-orange-600">{t('home.popularTitle')}</p>
          <p className="mt-0.5 text-xs text-gray-500">{t('home.popularSubtitle')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <button
                key={topic.slug}
                onClick={() => {
                  // 현재 탭 유지
                  setQuery(topic[lang].title);
                  trackEvent('quick_topic_click', { lang, slug: topic.slug });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                {topic[lang].title}
              </button>
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
            recommend(`${chefName} 스타일 ${menu}`, { ...filters, vibes: ['chef'] }, lang, undefined, getRecentMenus(7), true);
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
