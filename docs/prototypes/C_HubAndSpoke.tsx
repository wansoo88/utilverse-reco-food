{/*
  프로토타입 C: Hub & Spoke (허브+서브페이지)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  컨셉: 홈은 검색+결과만 (매우 간결), 나머지는 개별 Next.js 라우트
        GNB에 아이콘 네비게이션으로 서브페이지 접근

  장점:
  - 홈이 매우 가벼움 (검색 목적에 100% 집중)
  - 각 페이지가 독립 → SEO 개별 최적화 가능
  - 번들 크기 최소 (페이지별 코드 스플리팅 자연스럽게 적용)
  - 데스크톱+모바일 동시 최적화 용이
  - LCP/INP 개선 (HomeClient 721줄 → ~200줄)

  단점:
  - 페이지 전환 시 로딩 발생 (Link prefetch로 완화)
  - 캘린더/즐겨찾기 접근에 1번 더 클릭 필요
  - 라우트 추가 작업 필요 (/explore, /my)

  추천 대상: SEO+성능 최우선, 장기적 확장성 고려 시

  라우트 구조:
  /[lang]          → 홈 (검색+결과)
  /[lang]/explore  → 탐색 (셰프+K-pop+배틀+인기)
  /[lang]/my       → 마이 (캘린더+즐겨찾기+취향분석)
*/}

// ──────────────────────────────────────
// GNB 컴포넌트 (모든 페이지 공유)
// ──────────────────────────────────────
function GlobalNav({ currentPath, lang }) {
  const navItems = [
    { href: `/${lang}`,         icon: '🏠', label: '홈',   key: 'home'    },
    { href: `/${lang}/explore`, icon: '🔍', label: '탐색', key: 'explore' },
    { href: `/${lang}/my`,      icon: '👤', label: '마이', key: 'my'      },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* 좌: 로고 */}
        <Link href={`/${lang}`} className="text-lg font-bold text-orange-500">
          오늘뭐먹지
        </Link>

        {/* 중: GNB 아이콘 (데스크톱: 텍스트 포함, 모바일: 아이콘만) */}
        <nav className="flex items-center gap-1">
          {navItems.map(item => {
            const isActive = currentPath === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 우: 언어 + 즐겨찾기 */}
        <div className="flex items-center gap-2">
          <Link href={`/${lang}/my`} className="text-lg" aria-label="즐겨찾기">♥</Link>
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}

// ──────────────────────────────────────
// 홈 페이지 (/[lang])
// 검색+결과에 100% 집중 — 매우 간결
// ──────────────────────────────────────
function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalNav currentPath="home" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {/* 히어로 (미니멀) */}
        <div className="text-center py-3">
          <h1 className="text-2xl font-bold">오늘 뭐 먹지?</h1>
          <p className="text-sm text-gray-500 mt-1">{timeGreeting}</p>
        </div>

        {/* 즉시 추천 */}
        {!hasResult && <InstantRecommend />}

        {/* 검색 카드 */}
        <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <ModeTabs />
          <SearchInput />
          {searchMode === 'text' && showFilters && <FilterSection />}
        </section>

        {/* 결과 */}
        {hasResult && <ResultSection />}

        {/* 인기 추천 (가로 스크롤 칩) */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">인기 추천</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickTopics.slice(0, 6).map(t => (
              <button key={t} className="shrink-0 bg-white rounded-full px-4 py-2 text-sm shadow-sm">
                {t}
              </button>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

// ──────────────────────────────────────
// 탐색 페이지 (/[lang]/explore)
// 셰프 + K-pop + 배틀 + 전체 인기
// ──────────────────────────────────────
function ExplorePage() {
  const [section, setSection] = useState<'battle' | 'chef' | 'kpop'>('battle');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalNav currentPath="explore" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        <h1 className="text-xl font-bold">탐색</h1>

        {/* 서브 탭 */}
        <div className="flex gap-2">
          {[
            { key: 'battle', label: '🎯 메뉴 대결' },
            { key: 'chef',   label: '👨‍🍳 흑백요리사' },
            { key: 'kpop',   label: '⭐ K-pop' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSection(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                section === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-600 shadow-sm'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 섹션별 콘텐츠 */}
        {section === 'battle' && <MenuBattle />}
        {section === 'chef' && <ChefCard />}
        {section === 'kpop' && <KpopCard />}

        {/* 전체 인기 추천 */}
        <section className="space-y-2">
          <h2 className="font-semibold">인기 추천 상황</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickTopics.map(t => (
              <Link
                key={t}
                href={`/${lang}?preset=${encodeURIComponent(t)}`}
                className="bg-white rounded-xl p-3 text-sm shadow-sm hover:shadow-md transition"
              >
                {t}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

// ──────────────────────────────────────
// 마이 페이지 (/[lang]/my)
// 캘린더 + 즐겨찾기 + 취향분석
// ──────────────────────────────────────
function MyPage() {
  const [tab, setTab] = useState<'calendar' | 'favorites' | 'profile'>('calendar');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <GlobalNav currentPath="my" />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {/* 상단 탭 */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          {[
            { key: 'calendar',  label: '📅 캘린더' },
            { key: 'favorites', label: '♥ 즐겨찾기' },
            { key: 'profile',   label: '📊 취향' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-sm rounded-lg transition ${
                tab === t.key ? 'bg-white shadow font-semibold' : 'text-gray-500'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {tab === 'calendar' && <CalendarView />}
        {tab === 'favorites' && <FavoritesSection />}
        {tab === 'profile' && <TasteProfile />}
      </main>

      <SiteFooter />
    </div>
  );
}
