{/*
  프로토타입 A: Bottom Tab Navigation (모바일 앱 스타일)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  컨셉: 배달의민족/요기요 같은 하단 탭 4개로 페이지 분리

  장점:
  - 모바일 UX 최적 (엄지 영역에 네비게이션)
  - 각 탭이 독립적 → 스크롤 길이 60% 감소
  - 기능 발견율 극대화 (캘린더, 즐겨찾기가 1탭 거리)
  - 탭 전환 시 상태 유지 가능 (검색 결과 보존)

  단점:
  - 페이지 라우팅 변경 필요 (App Router 서브 라우트 추가)
  - 하단 탭바가 광고 영역과 충돌 가능
  - 데스크톱에서 하단 탭이 어색할 수 있음

  추천 대상: 모바일 트래픽 80%+ 예상 시

  탭 구조:
  [🍽️ 추천] [🔍 탐색] [📅 기록] [👤 마이]
*/}

export default function LayoutA() {
  const [activeTab, setActiveTab] = useState<'recommend' | 'explore' | 'record' | 'my'>('recommend');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── GNB (간소화) ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
        <span className="text-lg font-bold text-orange-500">오늘뭐먹지</span>
        <LanguageSelector />
      </header>

      {/* ── 탭별 콘텐츠 ── */}
      <main className="flex-1 overflow-y-auto pb-20">

        {/* 탭1: 추천 (핵심 기능만) */}
        {activeTab === 'recommend' && (
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            {/* 히어로 (축소) */}
            <div className="text-center py-2">
              <h1 className="text-xl font-bold">오늘 뭐 먹지?</h1>
              <p className="text-sm text-gray-500 mt-1">{timeGreeting}</p>
            </div>

            {/* 즉시 추천 배너 */}
            {!hasResult && <InstantRecommend />}

            {/* 통합 검색 (모드탭 + 입력 + 필터) */}
            <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
              {/* 모드 탭: 메뉴추천 / AI / K-pop */}
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {modes.map(m => (
                  <button key={m.key} className={`flex-1 py-2 text-sm rounded-lg ${
                    searchMode === m.key ? 'bg-white shadow font-semibold' : ''
                  }`}>{m.label}</button>
                ))}
              </div>
              {/* 검색 입력 */}
              <SearchInput mode={searchMode} />
              {/* 필터 (text 모드만) */}
              {searchMode === 'text' && <FilterSection />}
            </section>

            {/* 결과 영역 */}
            {hasResult && <ResultSection />}

            {/* 인기 추천 (4개로 축소) */}
            <section className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-500">인기 추천</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickTopics.slice(0, 4).map(t => (
                  <button key={t} className="bg-white rounded-xl p-3 text-sm shadow-sm">{t}</button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 탭2: 탐색 (콘텐츠 모아보기) */}
        {activeTab === 'explore' && (
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            {/* 메뉴 배틀 */}
            <MenuBattle />

            {/* 흑백요리사 */}
            <ChefCard />

            {/* K-pop 아이돌 */}
            <KpopCard />

            {/* 인기 추천 전체 */}
            <section className="space-y-2">
              <h2 className="font-semibold">인기 추천 상황</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickTopics.map(t => (
                  <button key={t} className="bg-white rounded-xl p-3 text-sm shadow-sm">{t}</button>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 탭3: 기록 (캘린더 + 인사이트) */}
        {activeTab === 'record' && (
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            <CalendarView />
          </div>
        )}

        {/* 탭4: 마이 (즐겨찾기 + 취향분석) */}
        {activeTab === 'my' && (
          <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
            <FavoritesSection />
            <TasteProfile />
          </div>
        )}
      </main>

      {/* ── Bottom Tab Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t safe-area-pb">
        <div className="max-w-2xl mx-auto flex">
          {[
            { key: 'recommend', icon: '🍽️', label: '추천' },
            { key: 'explore',   icon: '🔍', label: '탐색' },
            { key: 'record',    icon: '📅', label: '기록' },
            { key: 'my',        icon: '👤', label: '마이' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${
                activeTab === tab.key ? 'text-orange-500 font-semibold' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="mt-0.5">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
