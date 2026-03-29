{/*
  프로토타입 E: Dashboard Grid (데스크톱+모바일 반응형 대시보드)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  컨셉: 데스크톱은 2~3열 그리드, 모바일은 카드 스택
        검색은 항상 좌측(상단) 고정, 우측(하단)에 위젯 카드 배치

  장점:
  - 데스크톱 활용도 극대화 (넓은 화면에서 한눈에 모든 기능)
  - 모바일에서는 자동으로 1열 카드 스택 (기존과 유사)
  - 위젯 카드 형태 → 섹션 접기 없이 컴팩트하게 표시
  - 대시보드 느낌 → 리텐션 향상 (매일 방문하는 "내 식단 대시보드")

  단점:
  - 반응형 CSS 복잡도 증가
  - 모바일에서 그리드 장점이 사라짐 (결국 세로 나열)
  - 데스크톱 트래픽이 낮으면 ROI 부족

  추천 대상: 데스크톱 30%+ 또는 "식단 관리 대시보드" 포지셔닝 시

  레이아웃:
  ┌───────────────────┬──────────────┐
  │  검색 + 결과      │  즐겨찾기     │  ← 데스크톱: 2열
  │  (메인 영역)       │  캘린더 미니  │
  │                   │  취향 요약    │
  ├───────────────────┴──────────────┤
  │  인기 | 배틀 | 셰프 | K-pop       │  ← 수평 카드 슬라이더
  └───────────────────────────────────┘
*/}

export default function LayoutE() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ── GNB ── */}
      <header className="sticky top-0 z-40 bg-white border-b px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold text-orange-500">오늘뭐먹지</span>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-500">
            <a href="#search" className="hover:text-orange-500">추천</a>
            <a href="#explore" className="hover:text-orange-500">탐색</a>
            <a href="#my" className="hover:text-orange-500">마이</a>
          </nav>
          <LanguageSelector />
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">

        {/* ── 2열 그리드 (데스크톱) / 1열 (모바일) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ━━ 좌측: 메인 영역 (2/3 폭) ━━ */}
          <div className="lg:col-span-2 space-y-4">

            {/* 히어로 + 검색 */}
            <div id="search" className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold">오늘 뭐 먹지?</h1>
                  <p className="text-sm text-gray-500">{timeGreeting}</p>
                </div>
                <span className="text-4xl">🍜</span>
              </div>
              <ModeTabs />
              <SearchInput />
              {searchMode === 'text' && showFilters && <FilterSection />}
            </div>

            {/* 즉시 추천 */}
            {!hasResult && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4">
                <InstantRecommend />
              </div>
            )}

            {/* 결과 */}
            {hasResult && (
              <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                <RecommendHistory />
                <ResultSection />
              </div>
            )}

            {/* 인기 추천 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h2 className="font-semibold mb-3">🔥 인기 추천 상황</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {quickTopics.slice(0, 8).map(t => (
                  <button key={t} className="bg-gray-50 hover:bg-orange-50 rounded-xl p-2.5 text-sm transition">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ━━ 우측: 사이드바 위젯 (1/3 폭) ━━ */}
          <div id="my" className="space-y-4">

            {/* 즐겨찾기 미니 위젯 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">♥ 즐겨찾기</h3>
                <span className="text-xs text-gray-400">{favorites.length}개</span>
              </div>
              {favorites.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  추천받은 메뉴에서 ♥를 눌러보세요
                </p>
              ) : (
                <div className="space-y-1.5">
                  {favorites.slice(0, 5).map(f => (
                    <div key={f.menuName} className="flex items-center gap-2 text-sm">
                      <span>{f.emoji}</span>
                      <span className="truncate">{f.menuName}</span>
                    </div>
                  ))}
                  {favorites.length > 5 && (
                    <p className="text-xs text-orange-500 text-center">+{favorites.length - 5}개 더보기</p>
                  )}
                </div>
              )}
            </div>

            {/* 캘린더 미니 위젯 (이번 주) */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-sm mb-3">📅 이번 주</h3>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['월','화','수','목','금','토','일'].map(d => (
                  <span key={d} className="text-[10px] text-gray-400">{d}</span>
                ))}
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                      day.hasMenu ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-300'
                    }`}
                  >
                    {day.hasMenu ? day.emoji : day.date}
                  </div>
                ))}
              </div>
            </div>

            {/* 취향 요약 미니 위젯 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-sm mb-3">📊 나의 취향</h3>
              {/* 간단 막대 차트 */}
              <div className="space-y-2">
                {[
                  { label: '한식', pct: 45, color: 'bg-red-400' },
                  { label: '양식', pct: 25, color: 'bg-blue-400' },
                  { label: '일식', pct: 20, color: 'bg-green-400' },
                  { label: '중식', pct: 10, color: 'bg-yellow-400' },
                ].map(c => (
                  <div key={c.label} className="flex items-center gap-2 text-xs">
                    <span className="w-8 text-gray-500">{c.label}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-gray-400">{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 메뉴 배틀 미니 */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-semibold text-sm mb-3">🎯 오늘의 대결</h3>
              <div className="flex items-center gap-2">
                <button className="flex-1 bg-orange-50 hover:bg-orange-100 rounded-xl p-3 text-center transition">
                  <span className="text-2xl block">🍕</span>
                  <span className="text-xs mt-1 block">피자</span>
                </button>
                <span className="text-xs font-bold text-gray-300">VS</span>
                <button className="flex-1 bg-orange-50 hover:bg-orange-100 rounded-xl p-3 text-center transition">
                  <span className="text-2xl block">🍔</span>
                  <span className="text-xs mt-1 block">햄버거</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ━━ 하단: 수평 카드 슬라이더 ━━ */}
        <div id="explore" className="mt-6">
          <h2 className="text-lg font-bold mb-3">탐색</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <ChefCard compact />
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <KpopCard compact />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
