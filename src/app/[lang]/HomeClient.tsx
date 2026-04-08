'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFilters } from '@/hooks/useFilters';
import { useRecommend } from '@/hooks/useRecommend';
import { useCalendar } from '@/hooks/useCalendar';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useToast } from '@/components/ui/ToastProvider';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecommendHistory } from '@/hooks/useRecommendHistory';
import { FilterSection } from '@/components/food/FilterSection';
import { ChefCard } from '@/components/food/ChefCard';
import { KpopCard } from '@/components/food/KpopCard';
import { KpopIdolSearch } from '@/components/food/KpopIdolSearch';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { RecommendHistory } from '@/components/food/RecommendHistory';
import { FavoritesSection } from '@/components/food/FavoritesSection';
import { MenuBattle } from '@/components/food/MenuBattle';
import { RateLimitContent } from '@/components/food/RateLimitContent';
import { InstantRecommend } from '@/components/food/InstantRecommend';
import { BakeryShowCard } from '@/components/food/BakeryShowCard';
import { WeatherRecommend } from '@/components/food/WeatherRecommend';
import { validateInput } from '@/lib/security';
import { SEO_KEYWORDS } from '@/data/seoKeywords';
import { trackEvent } from '@/lib/analytics';
import { HOUSE_KEYWORDS, VIBE_KEYWORDS, BUDGET_KEYWORDS } from '@/data/filterKeywords';
import { KPOP_TREND_TOPICS, type KpopIdol, type KpopGroup } from '@/data/kpopIdols';
import { useKpopRecommend } from '@/hooks/useKpopRecommend';
import { useGeoLocation } from '@/hooks/useGeoLocation';
import { SITE_URL } from '@/config/site';
import type { Locale } from '@/config/site';
import type { FilterState } from '@/types/filter';

// 스크롤스파이 섹션 정의
const NAV_SECTIONS = [
  { id: 'sec-recommend', label: '추천' },
  { id: 'sec-explore',   label: '탐색' },
  { id: 'sec-battle',    label: '배틀' },
  { id: 'sec-chef',      label: '셰프' },
  { id: 'sec-kpop',      label: 'K-pop' },
  { id: 'sec-bakery',    label: '천하제빵' },
  { id: 'sec-calendar',  label: '캘린더' },
  { id: 'sec-favorites', label: '즐겨찾기' },
] as const;

// IntersectionObserver 기반 스크롤스파이 훅
function useScrollSpy(sectionIds: readonly string[]): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 가장 상단에 있는 visible 섹션을 active로
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-10% 0px -60% 0px', threshold: 0 },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}

// 캘린더 섹션 접힘/펼침 래퍼
function CalendarCollapsible({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-orange-100 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 min-h-[56px]"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-orange-700">📅 {title}</span>
          {count > 0 && (
            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
              {count}
            </span>
          )}
        </div>
        <span
          className={`text-gray-400 text-sm transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
}

type SearchMode = 'text' | 'ai' | 'kpop';

interface HomeClientProps {
  lang: Locale;
  preset?: string;  // SEO 페이지에서 ?preset=slug 로 필터 자동 적용
  shared?: string;  // 공유 링크에서 ?shared=menuName 으로 자동 검색
}

const RecommendCard = dynamic(
  () => import('@/components/food/RecommendCard').then((m) => m.RecommendCard),
  { loading: () => <div className="min-h-[220px] animate-pulse rounded-2xl bg-gray-100" /> },
);

const DualResultView = dynamic(
  () => import('@/components/food/DualResultView').then((m) => m.DualResultView),
  { loading: () => <div className="min-h-[220px] animate-pulse rounded-2xl bg-gray-100" /> },
);

const KpopResultCard = dynamic(
  () => import('@/components/food/KpopResultCard').then((m) => m.KpopResultCard),
  { loading: () => <div className="min-h-[220px] animate-pulse rounded-2xl bg-gray-100" /> },
);

const CalendarView = dynamic(
  () => import('@/components/food/CalendarView').then((m) => m.CalendarView),
  { loading: () => <div className="min-h-[220px] animate-pulse rounded-2xl bg-gray-100" /> },
);

export const HomeClient = ({ lang, preset, shared }: HomeClientProps) => {
  const t = useTranslations();
  const { showToast } = useToast();
  const { filters, updateFilters, toggleVibe, resetFilters, restored } = useFilters();
  const { status, data, error, isFallback, recommend, reset } = useRecommend();
  const { status: kpopStatus, data: kpopData, isFallback: kpopFallback, recommend: kpopRecommend, reset: kpopReset } = useKpopRecommend();
  const { entries, saveRecommendation, removeEntry, updateEntry, getRecentMenus } = useCalendar();
  const { blocked, remainingSeconds, checkAndRecord, setQuotaExhausted } = useRateLimit();
  const { favorites, toggleFavorite, removeFavorite, isFavorite } = useFavorites();
  const { history, addHistory, excludedMenus, excludeMenu } = useRecommendHistory();

  const [searchMode, setSearchMode] = useState<SearchMode>('text');
  const [query, setQuery] = useState('');
  const [kpopQuery, setKpopQuery] = useState('');
  const [selectedIdol, setSelectedIdol] = useState<KpopIdol | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [restoredShown, setRestoredShown] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const navSectionIds = NAV_SECTIONS.map((s) => s.id) as readonly string[];
  const activeSection = useScrollSpy(navSectionIds);
  const geo = useGeoLocation(lang);
  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 최초 접속 시 검색창 자동 포커스
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const quickTopics = SEO_KEYWORDS.slice(0, 8);

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return t('timeSuggest.morning');
    if (hour >= 10 && hour < 15) return t('timeSuggest.lunch');
    if (hour >= 15 && hour < 18) return t('timeSuggest.afternoon');
    if (hour >= 18 && hour < 22) return t('timeSuggest.dinner');
    return t('timeSuggest.late');
  }, [t]);

  // 최근 캘린더 마지막 메뉴
  const lastCalendarMenu = useMemo(() => {
    if (entries.length === 0) return undefined;
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0]?.menu;
  }, [entries]);

  // ?preset= 파라미터 처리 — SEO 페이지 CTA에서 필터 자동 적용 + 추천 실행
  useEffect(() => {
    if (!preset) return;
    const keyword = SEO_KEYWORDS.find((k) => k.slug === preset);
    if (!keyword) return;
    setSearchMode('ai');
    const title = keyword[lang]?.title ?? keyword.ko.title;
    setQuery(title);
    recommend(title, filters, lang, []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ?shared= 파라미터 처리 — 공유 링크에서 메뉴 자동 검색
  useEffect(() => {
    if (!shared) return;
    setSearchMode('ai');
    setQuery(shared);
    recommend(shared, filters, lang, []);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (restored && !restoredShown) {
      showToast(t('home.filterRestored'), 'success');
      setRestoredShown(true);
    }
  }, [restored, restoredShown, showToast, t]);

  useEffect(() => {
    if (error === 'food_only') showToast(t('home.blockToast'), 'error');
  }, [error, showToast, t]);

  // fallback 감지 시 rate limit 해제
  useEffect(() => {
    if (isFallback || kpopFallback) setQuotaExhausted(true);
  }, [isFallback, kpopFallback, setQuotaExhausted]);

  // 추천 성공 시 히스토리 추가
  useEffect(() => {
    if (status === 'success' && data) {
      trackEvent('recommend_success', { lang, fallback: isFallback });
      addHistory({ query, result: data, mode: searchMode });
      setHasResult(true);
    }
  }, [data, status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (kpopStatus === 'success' && kpopData) {
      setHasResult(true);
    }
  }, [kpopStatus, kpopData]);

  const handleReset = useCallback(() => {
    resetFilters();
    setQuery('');
    setKpopQuery('');
    setSelectedIdol(null);
    reset();
    kpopReset();
    setHasResult(false);
  }, [resetFilters, reset, kpopReset]);

  // 필터 키워드를 검색창에 토글
  const toggleKeyword = useCallback((keyword: string | undefined, removing: boolean) => {
    if (!keyword) return;
    setQuery((prev) => {
      const words = prev.split(/\s+/).filter(Boolean);
      if (removing) return words.filter((w) => w !== keyword).join(' ');
      if (words.includes(keyword)) return prev;
      return [...words, keyword].join(' ');
    });
  }, []);

  const handleModeChange = (mode: FilterState['mode']) => updateFilters({ mode });

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
    if (filters.baby) toggleKeyword(kw[filters.baby], true);
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
    if (filters.budget !== 'any') toggleKeyword(kw[filters.budget], true);
    if (budget !== 'any') toggleKeyword(kw[budget], false);
    updateFilters({ budget });
  };

  const handleSubmit = useCallback(async (overrideQuery?: string, overrideExcludes?: string[]) => {
    // Rate limit 체크
    const { allowed, waitSeconds } = checkAndRecord();
    if (!allowed) {
      showToast(t('home.rateLimitWait').replace('{seconds}', String(waitSeconds)), 'error');
      return;
    }

    // K-pop 모드
    if (searchMode === 'kpop') {
      const searchTerm = kpopQuery.trim() || selectedIdol?.name || '';
      if (!searchTerm) {
        showToast(t('home.kpopRequired'), 'error');
        return;
      }
      trackEvent('kpop_recommend_submit', { lang, idol: searchTerm });
      await kpopRecommend(searchTerm, lang, selectedIdol?.name, selectedIdol?.group);
      return;
    }

    const q = overrideQuery ?? query;
    if (!q.trim()) {
      showToast(t('home.queryRequired'), 'error');
      return;
    }

    const validation = validateInput(q);
    if (!validation.valid) {
      if (validation.reason === 'injection') showToast(t('home.errorInjection'), 'error');
      else if (validation.reason === 'too_long') showToast(t('home.errorTooLong'), 'error');
      else if (validation.reason === 'not_food') showToast(t('home.blockToast'), 'error');
      return;
    }

    const recentMenus = getRecentMenus(7);
    const excludes = overrideExcludes ?? excludedMenus;
    const allExcludes = [...recentMenus, ...excludes];
    trackEvent('recommend_submit', { lang, mode: searchMode, has_query: true });
    await recommend(q, filters, lang, allExcludes);
  }, [query, kpopQuery, selectedIdol, filters, lang, searchMode, recommend, kpopRecommend, showToast, t, getRecentMenus, checkAndRecord, excludedMenus]);

  // 재추천: 현재 결과의 모든 메뉴를 exclude에 추가
  const handleRetry = useCallback(() => {
    const currentExcludes = data ? data.items.map((i) => i.name) : [];
    const allExcludes = [...excludedMenus, ...currentExcludes];
    handleSubmit(query, allExcludes);
  }, [data, excludedMenus, handleSubmit, query]);

  const handleKpopRetry = useCallback(() => {
    const searchTerm = kpopQuery.trim() || selectedIdol?.name || '';
    if (!searchTerm) return;
    kpopRecommend(searchTerm, lang, selectedIdol?.name, selectedIdol?.group);
  }, [kpopQuery, selectedIdol, lang, kpopRecommend]);

  const handleExclude = useCallback((menuName: string) => {
    excludeMenu(menuName);
    handleSubmit(query, [...excludedMenus, menuName]);
  }, [excludeMenu, excludedMenus, handleSubmit, query]);

  const handleToggleFavorite = useCallback((menuName: string, emoji: string) => {
    const result = toggleFavorite({ menuName, emoji, category: '기타' });
    if (result === 'added') {
      showToast(t('favorites.added'), 'success');
      trackEvent('favorite_add', { lang, menu: menuName });
    } else if (result === 'removed') {
      showToast(t('favorites.removed'), 'info');
      trackEvent('favorite_remove', { lang, menu: menuName });
    } else if (result === 'overflow') {
      showToast(t('favorites.max'), 'info');
    }
  }, [toggleFavorite, showToast, t, lang]);

  const handleKpopIdolSelect = useCallback((idol: KpopIdol) => {
    setSearchMode('kpop');
    setSelectedIdol(idol);
    setKpopQuery(idol.name);
    trackEvent('kpop_idol_select', { lang, idol: idol.name });
    kpopRecommend(idol.name, lang, idol.name, idol.group);
  }, [lang, kpopRecommend]);

  const handleKpopGroupSelect = useCallback((group: KpopGroup) => {
    setSearchMode('kpop');
    setKpopQuery(group.name);
    setSelectedIdol(null);
    trackEvent('kpop_group_select', { lang, group: group.name });
    kpopRecommend(group.name, lang, undefined, group.name);
  }, [lang, kpopRecommend]);

  const handleRecipeSearch = useCallback((menuName: string) => {
    // 검색창 키워드를 그대로 YouTube 검색어에 포함
    const currentQuery = searchMode === 'kpop' ? kpopQuery : query;
    const youtubeQuery = currentQuery
      ? `${currentQuery} ${menuName} 레시피`
      : `${menuName} 레시피`;
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(youtubeQuery)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  }, [searchMode, kpopQuery, query]);

  const handleSaveToday = () => {
    if (!data) return;
    const saved = saveRecommendation({ type: 'cook', items: data.items, tip: data.tip });
    if (saved) {
      trackEvent('calendar_save', { lang });
      showToast(t('calendar.saved'), 'success');
    }
  };

  const handleDeleteEntry = (date: string) => {
    if (removeEntry(date)) showToast(t('calendar.deleted'), 'info');
  };
  const handleUpdateEntry = (date: string, updates: { menu: string; reason: string; type: 'cook' | 'order' }) => {
    if (updateEntry(date, updates)) showToast(t('calendar.updated'), 'success');
  };

  // 공유 URL 생성
  const shareUrl = useMemo(() => {
    const mainItem = data?.items[0] ?? kpopData?.items[0];
    if (!mainItem) return undefined;
    return `${SITE_URL}/${lang}?shared=${encodeURIComponent(mainItem.name)}`;
  }, [data, kpopData, lang]);

  const modeConfig = {
    text:  { placeholder: t('search.placeholderText'),  submit: t('search.submitText') },
    ai:    { placeholder: t('search.placeholderAi'),    submit: t('search.submitAi') },
    kpop:  { placeholder: t('kpop.placeholder'),        submit: t('kpop.submit') },
  };

  const resultLabels = {
    retry: t('recommend.retry'),
    notThis: t('recommend.notThis'),
    shareCopied: t('share.copied'),
    shareCopy: t('share.copy'),
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="font-extrabold text-gray-900 text-lg">오늘뭐먹지</span>
          <div className="flex items-center gap-2">
            {geo.status === 'granted' && geo.locationName && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                <span className="text-blue-500">📍</span>
                <span className="max-w-[120px] truncate">{geo.locationName}</span>
              </span>
            )}
            {geo.status === 'loading' && (
              <span className="text-xs text-gray-400 animate-pulse">📍</span>
            )}
            <LanguageSelector current={lang} />
          </div>
        </div>

        {/* 스티키 스크롤스파이 네비 */}
        <div ref={navRef} className="border-t border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto px-4 flex gap-1.5 py-2">
            {NAV_SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  const el = document.getElementById(id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`shrink-0 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                  activeSection === id
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-6">

        {/* 히어로 + 추천 */}
        <section id="sec-recommend" className="flex items-center gap-4 rounded-[2rem] border border-white/80 bg-white px-6 py-4 shadow-sm">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">
              {t('home.title')}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{t('home.subtitle')}</p>
            <p className="mt-2 text-sm font-medium text-gray-700">{timeGreeting}</p>
          </div>
          <div className="shrink-0 w-20 h-20 md:w-28 md:h-28">
            <Image src="/hero-bowl.svg" alt="Food bowl" width={112} height={112} priority className="h-full w-full" />
          </div>
        </section>

        {/* 즉시 추천 배너 (결과 없을 때만) */}
        {!hasResult && (
          <InstantRecommend
            lang={lang}
            onSearch={(menuName) => {
              setSearchMode('text');
              setQuery(menuName);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            lastMenu={lastCalendarMenu}
          />
        )}

        {/* 날씨 기반 추천 (결과 없을 때만) */}
        {!hasResult && (
          <WeatherRecommend
            lang={lang}
            onSearch={(menuName) => {
              setSearchMode('text');
              setQuery(menuName);
              handleSubmit(menuName);
            }}
          />
        )}

        {/* 통합 검색 + 결과 */}
        <section id="sec-search" className="rounded-[2rem] border border-gray-200 bg-white shadow-md overflow-hidden">

          {/* 모드 탭 */}
          <div className="flex border-b border-gray-100">
            {(['text', 'ai', 'kpop'] as SearchMode[]).map((mode) => {
              const labels: Record<SearchMode, string> = {
                text: t('search.modeText'),
                ai: t('search.modeAi'),
                kpop: t('kpop.modeLabel'),
              };
              return (
                <button
                  key={mode}
                  onClick={() => { setSearchMode(mode); reset(); kpopReset(); setHasResult(false); }}
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
                🤖 {t('search.aiHint')}
              </p>
            )}

            {/* K-pop 모드 힌트 */}
            {searchMode === 'kpop' && (
              <p className="text-xs text-pink-600 bg-pink-50 rounded-xl px-3 py-2">
                {t('kpop.hint')}
              </p>
            )}

            {/* 검색 입력: K-pop 모드는 아이돌 검색 UI */}
            {searchMode === 'kpop' ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <KpopIdolSearch
                    lang={lang}
                    value={kpopQuery}
                    onChange={setKpopQuery}
                    onSearch={() => handleSubmit()}
                    onSelect={(idol) => {
                      setSelectedIdol(idol);
                      setKpopQuery(idol.name);
                      // 선택 즉시 자동 검색
                      kpopRecommend(idol.name, lang, idol.name, idol.group);
                    }}
                  />
                </div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={kpopStatus === 'loading' || blocked}
                  className="shrink-0 rounded-xl bg-pink-500 hover:bg-pink-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
                >
                  {kpopStatus === 'loading' ? '...' : blocked ? `${remainingSeconds}s` : modeConfig.kpop.submit}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={modeConfig[searchMode].placeholder}
                    maxLength={200}
                    className="w-full rounded-2xl border border-gray-200 px-5 py-3.5 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                  {query && (
                    <button
                      onClick={handleReset}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleSubmit()}
                  disabled={status === 'loading' || blocked}
                  className="shrink-0 rounded-2xl bg-orange-500 hover:bg-orange-600 px-5 py-3.5 text-sm font-bold text-white transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? '...' : blocked ? `${remainingSeconds}s` : modeConfig[searchMode].submit}
                </button>
              </div>
            )}

            {/* 메뉴 추천 전용 필터 */}
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
                      lang={lang}
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

            {/* Rate Limit 대기 콘텐츠 */}
            {blocked && (
              <RateLimitContent
                onMenuClick={(menuName) => {
                  setQuery(menuName);
                }}
                lang={lang}
              />
            )}

            {/* 로딩 */}
            {(status === 'loading' || kpopStatus === 'loading') && (
              <div className="flex flex-col items-center gap-2 py-6" aria-live="polite" aria-label="추천 중">
                <div className={`w-8 h-8 border-4 rounded-full animate-spin ${
                  searchMode === 'kpop'
                    ? 'border-pink-200 border-t-pink-500'
                    : 'border-orange-200 border-t-orange-500'
                }`} />
              </div>
            )}

            {/* 에러 상태 UI */}
            {(status === 'error' || kpopStatus === 'error') && error !== 'food_only' && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-center space-y-2">
                <p className="text-sm text-red-600 font-medium">😅 {t('home.errorRetry')}</p>
                <button
                  onClick={searchMode === 'kpop' ? handleKpopRetry : handleRetry}
                  className="rounded-xl bg-red-500 text-white text-xs font-semibold px-4 py-2 hover:bg-red-600 transition-colors min-h-[36px]"
                >
                  🔄 {t('recommend.retry')}
                </button>
              </div>
            )}

            {/* 추천 히스토리 슬라이더 */}
            {history.length > 0 && (status === 'success' || kpopStatus === 'success') && (
              <RecommendHistory
                history={history}
                label={t('recommend.history')}
                onRestore={(entry) => {
                  setSearchMode(entry.mode);
                  setQuery(entry.query);
                  trackEvent('history_card_click', { lang });
                }}
              />
            )}

            {/* K-pop 결과 */}
            {searchMode === 'kpop' && kpopStatus === 'success' && kpopData && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <KpopResultCard
                  data={kpopData}
                  lang={lang}
                  onRecipeSearch={handleRecipeSearch}
                  onRetry={handleKpopRetry}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  shareUrl={shareUrl}
                  labels={resultLabels}
                />
              </div>
            )}

            {/* 일반 결과 */}
            {searchMode !== 'kpop' && status === 'success' && data && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {searchMode === 'ai' && (
                  <DualResultView
                    data={data}
                    lang={lang}
                    onRetry={handleRetry}
                    onExclude={handleExclude}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                    shareUrl={shareUrl}
                    labels={resultLabels}
                  />
                )}

                {searchMode === 'text' && (
                  <RecommendCard
                    data={data}
                    lang={lang}
                    mode={filters.mode}
                    onRetry={handleRetry}
                    onExclude={handleExclude}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={isFavorite}
                    shareUrl={shareUrl}
                    labels={resultLabels}
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

        {/* 인기 추천 상황 — K-pop 모드일 때는 K-pop 트렌드 */}
        {searchMode === 'kpop' ? (
          <section id="sec-explore" className="rounded-[2rem] border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-purple-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-pink-600">{t('kpop.popularTitle')}</p>
            <p className="mt-0.5 text-xs text-gray-500">{t('kpop.popularSubtitle')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {KPOP_TREND_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setKpopQuery(topic.keyword);
                    setSelectedIdol(null);
                    trackEvent('kpop_trend_click', { lang, topic: topic.id });
                    kpopRecommend(topic.keyword, lang);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-pink-400 hover:text-pink-600"
                >
                  {topic[lang]}
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section id="sec-explore" className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-orange-600">{t('home.popularTitle')}</p>
            <p className="mt-0.5 text-xs text-gray-500">{t('home.popularSubtitle')}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <button
                  key={topic.slug}
                  onClick={() => {
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
        )}

        {/* 메뉴 배틀 */}
        <div id="sec-battle">
        <MenuBattle
          lang={lang}
          labels={{
            title: t('battle.title'),
            vs: t('battle.vs'),
            sameChoice: t('battle.sameChoice'),
          }}
        />
        </div>

        {/* 흑백요리사 셰프 카드 — K-pop 탭일 때 숨김 */}
        <div id="sec-chef">
          {searchMode !== 'kpop' && (
            <ChefCard
              lang={lang}
              onChefSelect={(chefName, menu) => {
                setSearchMode('ai');
                setQuery(`${chefName} 스타일 ${menu}`);
                trackEvent('chef_card_click', { lang, chef: chefName, menu });
                recommend(`${chefName} 스타일 ${menu}`, { ...filters, vibes: ['chef'] }, lang, getRecentMenus(7));
              }}
            />
          )}
        </div>

        {/* K-pop 아이돌 추천 카드 */}
        <div id="sec-kpop">
          <KpopCard
            lang={lang}
            onIdolSelect={handleKpopIdolSelect}
            onGroupSelect={handleKpopGroupSelect}
          />
        </div>

        {/* 천하제빵 섹션 */}
        <div id="sec-bakery">
          <BakeryShowCard
            lang={lang}
            onMenuSearch={(searchQuery) => {
              setSearchMode('text');
              setQuery(searchQuery);
              recommend(searchQuery, filters, lang, getRecentMenus(7));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* 식단 캘린더 + 취향 분석 — 기본 접힘 */}
        <CalendarCollapsible title={t('calendar.title')} count={entries.length}>
        <div id="sec-calendar">
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
            favorites={favorites}
            profileLabel={t('profile.title')}
          />
        </div>
        </CalendarCollapsible>

        {/* 즐겨찾기 섹션 — 맨 아래 배치 */}
        <div id="sec-favorites">
          <FavoritesSection
            favorites={favorites}
            onRemove={removeFavorite}
            onRecommend={(menuName) => {
              setSearchMode('ai');
              setQuery(menuName);
              recommend(menuName, filters, lang, getRecentMenus(7));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            labels={{
              title: t('favorites.title'),
              empty: t('favorites.empty'),
              recommend: t('favorites.recommend'),
            }}
            lang={lang}
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
