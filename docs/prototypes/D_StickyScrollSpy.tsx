{/*
  프로토타입 D: Sticky Section Nav + Scroll Spy (싱글 페이지 개선)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  컨셉: 현재 싱글 페이지 유지하되, 검색 영역 아래에 고정 섹션 네비게이션 추가
        IntersectionObserver로 현재 보이는 섹션 자동 하이라이트

  장점:
  - 코드 변경 최소 (라우팅 변경 없음, 현재 구조 대부분 유지)
  - 사용자가 원하는 섹션으로 즉시 점프 가능
  - 현재 위치를 항상 인지 → "기능이 어디 있는지" 문제 해결
  - SEO 변경 없음 (URL 구조 동일)

  단점:
  - 여전히 긴 스크롤 (줄이지는 않음)
  - Sticky 영역이 2단 (Header + SectionNav) → 상단 공간 소모
  - 모바일에서 세션 네비가 좁음

  추천 대상: 현재 구조를 최대한 유지하면서 탐색성만 개선할 때

  구조: [Header] → [Search] → [Sticky SectionNav] → [섹션들]
*/}

export default function LayoutD() {
  const [activeSection, setActiveSection] = useState('popular');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // IntersectionObserver로 현재 보이는 섹션 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sections = [
    { id: 'popular',   label: '🔥 인기' },
    { id: 'battle',    label: '🎯 대결' },
    { id: 'favorites', label: '♥ 즐겨찾기' },
    { id: 'chef',      label: '👨‍🍳 셰프' },
    { id: 'kpop',      label: '⭐ K-pop' },
    { id: 'calendar',  label: '📅 캘린더' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── GNB ── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-orange-500">오늘뭐먹지</span>
        <LanguageSelector />
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {/* 히어로 */}
        <div className="text-center py-2">
          <h1 className="text-xl font-bold">오늘 뭐 먹지?</h1>
          <p className="text-sm text-gray-500">{timeGreeting}</p>
        </div>

        {/* 즉시 추천 */}
        {!hasResult && <InstantRecommend />}

        {/* 검색 영역 (항상 상단) */}
        <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <ModeTabs />
          <SearchInput />
          {searchMode === 'text' && showFilters && <FilterSection />}
        </section>

        {/* 결과 */}
        {hasResult && <ResultSection />}
      </main>

      {/* ── Sticky Section Navigation ── */}
      <div className="sticky top-[52px] z-30 bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto overflow-x-auto scrollbar-hide">
          <div className="flex px-4 gap-1 py-2">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                  activeSection === s.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 스크롤 섹션들 ── */}
      <div className="max-w-2xl mx-auto w-full px-4 space-y-6 pb-8">

        {/* 인기 추천 */}
        <section
          id="popular"
          ref={el => { sectionRefs.current['popular'] = el; }}
          className="scroll-mt-28"
        >
          <h2 className="text-lg font-bold mb-3">🔥 인기 추천 상황</h2>
          <div className="grid grid-cols-2 gap-2">
            {quickTopics.map(t => (
              <button key={t} className="bg-white rounded-xl p-3 text-sm shadow-sm">{t}</button>
            ))}
          </div>
        </section>

        {/* 메뉴 대결 */}
        <section
          id="battle"
          ref={el => { sectionRefs.current['battle'] = el; }}
          className="scroll-mt-28"
        >
          <MenuBattle />
        </section>

        {/* 즐겨찾기 */}
        <section
          id="favorites"
          ref={el => { sectionRefs.current['favorites'] = el; }}
          className="scroll-mt-28"
        >
          <FavoritesSection />
        </section>

        {/* 셰프 */}
        <section
          id="chef"
          ref={el => { sectionRefs.current['chef'] = el; }}
          className="scroll-mt-28"
        >
          <ChefCard />
        </section>

        {/* K-pop */}
        <section
          id="kpop"
          ref={el => { sectionRefs.current['kpop'] = el; }}
          className="scroll-mt-28"
        >
          <KpopCard />
        </section>

        {/* 캘린더 */}
        <section
          id="calendar"
          ref={el => { sectionRefs.current['calendar'] = el; }}
          className="scroll-mt-28"
        >
          <CalendarView />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
