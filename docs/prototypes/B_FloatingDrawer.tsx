{/*
  프로토타입 B: Single Page + Floating Action + Bottom Sheet Drawer
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  컨셉: 홈 페이지는 검색+결과에 집중, 부가 기능은 플로팅 버튼→바텀 시트

  장점:
  - 홈 페이지 스크롤 70% 감소 (검색+결과+인기만 남음)
  - 현재 코드 구조 변경 최소 (라우팅 변경 없음)
  - 바텀 시트가 트렌디하고 모바일 친화적 (카카오맵, 네이버 스타일)
  - 광고 영역과 충돌 없음

  단점:
  - 플로팅 버튼이 콘텐츠를 가릴 수 있음
  - 바텀 시트 안의 기능은 발견율이 약간 낮음
  - 바텀 시트 구현 추가 필요 (CSS transform 기반)

  추천 대상: 최소 변경으로 UX 개선 원할 때

  구조: [홈: 검색+결과] + [FAB 버튼 → 드로어]
*/}

export default function LayoutB() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'favorites' | 'calendar' | 'profile'>('favorites');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── GNB ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-orange-500">오늘뭐먹지</span>
        <div className="flex items-center gap-3">
          {/* 즐겨찾기 바로가기 아이콘 */}
          <button
            onClick={() => { setDrawerTab('favorites'); setDrawerOpen(true); }}
            className="text-xl"
            aria-label="즐겨찾기"
          >♥</button>
          <LanguageSelector />
        </div>
      </header>

      {/* ── 메인: 검색+결과만 집중 ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-4">
        {/* 히어로 (컴팩트) */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">오늘 뭐 먹지?</h1>
            <p className="text-sm text-gray-500">{timeGreeting}</p>
          </div>
          <div className="w-14 h-14">🍜</div>
        </div>

        {/* 즉시 추천 */}
        {!hasResult && <InstantRecommend />}

        {/* 통합 검색 */}
        <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <ModeTabs />
          <SearchInput />
          {searchMode === 'text' && <FilterSection />}
        </section>

        {/* Rate Limit 콘텐츠 */}
        {blocked && <RateLimitContent />}

        {/* 결과 */}
        {hasResult && (
          <section className="space-y-3">
            <RecommendHistory />
            <ResultSection />
          </section>
        )}

        {/* 인기 추천 (컴팩트 수평 스크롤) */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">인기 추천</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickTopics.slice(0, 8).map(t => (
              <button key={t} className="shrink-0 bg-white rounded-full px-4 py-2 text-sm shadow-sm whitespace-nowrap">
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* 메뉴 배틀 (접이식) */}
        <details className="bg-white rounded-2xl shadow-sm">
          <summary className="p-4 font-semibold cursor-pointer">🎯 오늘의 메뉴 대결</summary>
          <div className="px-4 pb-4">
            <MenuBattle />
          </div>
        </details>

        {/* 셰프/K-pop (접이식) */}
        {searchMode !== 'kpop' && (
          <details className="bg-white rounded-2xl shadow-sm">
            <summary className="p-4 font-semibold cursor-pointer">👨‍🍳 흑백요리사 Top 10</summary>
            <div className="px-4 pb-4"><ChefCard /></div>
          </details>
        )}
        <details className="bg-white rounded-2xl shadow-sm">
          <summary className="p-4 font-semibold cursor-pointer">⭐ K-pop 아이돌 메뉴</summary>
          <div className="px-4 pb-4"><KpopCard /></div>
        </details>
      </main>

      {/* ── Floating Action Button ── */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg
                   flex items-center justify-center text-2xl hover:bg-orange-600 transition-transform
                   active:scale-95"
      >
        📋
      </button>

      {/* ── Bottom Sheet Drawer (오버레이) ── */}
      {drawerOpen && (
        <>
          {/* 배경 딤 */}
          <div
            className="fixed inset-0 z-50 bg-black/30 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          {/* 바텀 시트 */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl
                          max-h-[80vh] flex flex-col animate-slide-up">
            {/* 드래그 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* 드로어 내부 탭 */}
            <div className="flex border-b px-4">
              {[
                { key: 'favorites', label: '♥ 즐겨찾기' },
                { key: 'calendar',  label: '📅 캘린더' },
                { key: 'profile',   label: '📊 취향분석' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setDrawerTab(tab.key)}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition ${
                    drawerTab === tab.key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 드로어 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-4">
              {drawerTab === 'favorites' && <FavoritesSection />}
              {drawerTab === 'calendar' && <CalendarView />}
              {drawerTab === 'profile' && <TasteProfile />}
            </div>
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}
