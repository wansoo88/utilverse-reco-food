# Project Plan & Roadmap

> 이 문서는 `/plan-update` 스킬이 관리합니다. 태스크 완료/추가 시 자동 업데이트됩니다.

## Current Phase

✅ **Phase 1: 프로젝트 셋업 & 기반 구축** (완료 — 2026-03-20)
✅ **Phase 2: 핵심 추천 UI 개발** (완료 — 2026-03-20)
✅ **Phase 3: 캘린더 & 프로그래매틱 SEO 확장** (완료 — 2026-03-20)
✅ **Phase 4: 프로그래매틱 SEO** (완료 — 2026-03-20)
✅ **Phase 6: UX 고도화** (완료 — 2026-03-21)
✅ **Phase 8: K-pop 아이돌 메뉴 추천 기능** (완료 — 2026-03-23)
✅ **Phase 9: 페이지 체류 시간 & 재방문율 향상** (완료 — 2026-04-09)
🔵 **Phase 5: 성능 최적화 & 배포** (진행 중)
🔵 **Phase 7: 검증 & 수익화 준비** (진행 중)

## Milestones

### Phase 1: 프로젝트 셋업 & 기반 구축
- [x] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind v4, pnpm)
- [x] next-intl i18n 설정 (ko/en/ja/zh, defaultLocale: ko)
- [x] 환경변수 구성 (.env.example, .env.local)
- [x] 에드센스 스크립트 로더 설정 (afterInteractive — src/config/adsense.ts)
- [x] FooterAd 컴포넌트 (유일한 광고 위치)
- [x] ads.txt, robots.txt, sitemap 자동 생성 (next-sitemap)
- [x] 3단계 보안 모듈 (security.ts: BLOCKED_PATTERNS, FOOD_SIGNALS, validateInput)

### Phase 2: 핵심 추천 UI 개발
- [x] 홈페이지 레이아웃 (Hero + 검색 + 필터 + 결과)
- [x] FilterSection 구현 (해먹기/시켜먹기, 가구, 상황, 예산)
- [x] 검색창 ↔ 필터 키워드 자동 어펜드 (하이브리드)
- [x] 흑백요리사 전용 배너 + 보라색 칩 강조
- [x] RecommendCard (AI 추천 결과 표시)
- [x] /api/recommend Route Handler (Gemini Flash 연동 + Layer 2 보안)
- [x] localRecommend() 폴백 (Gemini 쿼터 초과 대비)
- [x] promptBuilder.ts (buildUserPrompt 생성 로직)
- [x] 필터 localStorage 저장/복원 (wmj_filters)
- [x] 흑백요리사 1·2 Top 10 셰프 데이터 (src/data/chefs.ts)
- [x] FooterAd 컴포넌트 (AdSense — footer 전용)
- [x] Toast / ToastProvider (보안 차단, 필터 복원, 에러 알림)
- [x] LanguageSelector (ko/en/ja/zh 전환)
- [x] useFilters hook (localStorage 기반)
- [x] useRecommend hook (API 호출 상태 관리)

### Phase 3: 캘린더 & 부가 기능
- [x] CalendarView (주간 식단 기록)
- [x] wmj_calendar localStorage 저장
- [x] Toast 알림 시스템 (필터 복원, 보안 차단, 저장 완료)
- [x] 다국어 키워드 매핑 (filterKeywords.ts)
- [x] 월간 캘린더 뷰 추가
- [x] 캘린더 삭제 UX
- [x] 캘린더 수정 UX

### Phase 4: 프로그래매틱 SEO
- [x] /[lang]/eat/menu/[slug] ISR 페이지
- [x] SEO 키워드 DB (src/data/seoKeywords.ts, 40개+)
- [x] 빌드 타임 AI 추천 결과 캐싱
- [x] JSON-LD 구조화 데이터 (Article schema)
- [x] JSON-LD Recipe schema 추가
- [x] 유튜브 레시피 링크 5개 연동 (검색 링크 기반)
- [x] 관련 키워드 내부 링크 (RelatedKeywords)
- [x] OpenGraph + Twitter Card 메타 태그
- [x] 언어별 sitemap 자동 생성 (4 x 40개+ 키워드 기준 빌드 검증)

### Phase 5: 성능 최적화 & 배포
- [ ] Core Web Vitals 최적화 (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [x] 기본 폰트 최적화 (next/font)
- [x] OG 이미지 동적 생성
- [ ] 일반 이미지 최적화 (실제 이미지 자산 도입 시 WebP/`next/image`)
- [x] 번들 분석 설정 추가
- [x] 기본 코드 스플리팅 적용 (홈 일부 동적 로딩)
- [ ] Vercel 프로덕션 배포
- [x] GA4 연동 & 이벤트 추적 코드
- [ ] Search Console 등록 & 색인 요청
- [ ] AdSense 사이트 등록 & 승인 신청

### Phase 6: UX 고도화 (경쟁사 비교 기반) ✅ 완료
- [x] 통합 검색 블록 (탭: 메뉴추천 / AI검색)
- [x] 검색 결과 검색창 바로 아래 인라인 표시
- [x] AI 검색 듀얼 모드 (해먹기 좌 / 시켜먹기 우, 모바일 탭)
- [x] 네이버 맛집 API 연동 + 위치 동의 UI
- [x] 레시피 링크 (YouTube + 블로그)
- [x] 시간대별 자동 추천 카드 (아침/점심/저녁/야식)
- [x] 식단 캘린더 인사이트 (7일 패턴 분석 + 넛지)
- [x] 세션 기반 Rate Limit (10s/2, 1min/5, 5min/10, 30min 세션)
- [x] AI 쿼터 소진 시 Rate Limit 자동 해제
- [x] 가족 필터 아이유무 서브옵션 (아이있음 / 아이없음)
- [x] 필터 클릭 시 검색 input 키워드 자동 어펜드
- [x] 냉장고 파먹기 모드 제거 (불필요 기능 정리)
- [x] 흑백요리사 시즌별 Top10/출연자 탭 + 셔플 기능
- [x] chefs.ts 44명 확장 (시즌별 Top10 + 출연자 12명)
- [x] localMenus.ts 해먹기 80+ / 시켜먹기 60+ (2024-2026 트렌드)
- [x] AI 검색 placeholder (선택) → (필수) 변경
- [x] 4개 언어 i18n 전체 확장

### Phase 7: 검증 & 수익화 준비 🔵 진행 중

#### 7-1. 테스트 (즉시)
- [ ] `test_ai.md` 기반 크롬 수동 테스트 63개 케이스 실행
  - TC-01 기본 UI 렌더링
  - TC-02 시간대별 자동 추천 카드
  - TC-03 AI 추천 결과 + 레시피 링크
  - TC-04 식단 캘린더 인사이트
  - TC-05 필터 & 기본 추천
  - TC-06 다국어 전환 (EN/JA/ZH 전체 UI 번역 확인)
  - TC-07 반응형 모바일 레이아웃
  - TC-08 성능 & 접근성
  - TC-09 K-pop 아이돌 추천 흐름 전체

#### 7-2. 번역 완결 (단기)
- [x] next-intl v4 requestLocale API 수정 → 영/일/중 번역 정상화
- [ ] `SiteFooter.tsx` — FOOTER_COPY(하드코딩) → i18n `footer.*` 키로 통일
- [ ] About / Privacy / Terms / Contact 페이지 — i18n 키 연동 또는 legalContent.ts 언어별 완결 확인
- [ ] LanguageSelector 전환 시 전체 텍스트 실시간 변경 E2E 검증

#### 7-3. 성능 최적화 (단기)
- [ ] Core Web Vitals 측정 (Lighthouse or PageSpeed Insights)
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1 (광고 슬롯 고정 치수 확인)
- [ ] /api/recipes 응답 지연 시 skeleton UI 표시 확인
- [ ] 번들 크기 분석 (`pnpm build` 후 `.next/analyze` 확인)

#### 7-4. 보안 강화 (단기)
- [ ] 전각/유니코드 정규화 (NFKC) — `src/lib/security.ts` 추가
- [x] Rate Limiting per IP (10 req/min) — Edge Middleware 구현

#### 7-5. Vercel 배포 (배포 전)
- [ ] Vercel 프로젝트 연결 & 환경변수 설정
  - `GEMINI_API_KEY` / `GEMINI_API_KEY_2~4`
  - `GPT_API_KEY`
  - `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET`
  - `YOUTUBE_API_KEY`
  - `ADMIN_SECRET`
  - `NEXT_PUBLIC_ADSENSE_PUB_ID`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_SITE_URL=https://utilverse.info`
- [ ] 프로덕션 빌드 검증 (`pnpm build` 에러 없음 확인)
- [ ] 커스텀 도메인 연결 (utilverse.info)

#### 7-6. 수익화 (배포 후)
- [ ] Google Search Console 등록 & sitemap 제출
- [ ] Google AdSense 사이트 등록 & 승인 신청
  - 승인 전: footer 광고 슬롯 플레이스홀더 유지
  - 승인 후: `NEXT_PUBLIC_ADSENSE_PUB_ID` 환경변수 입력 → 자동 활성화
- [ ] GA4 이벤트 수신 확인 (recommend_submit, kpop_recommend_submit, calendar_save 등)

#### 7-7. 중기 개선 (배포 이후)
- [ ] 캘린더 최근 7일 식단 → `exclude` 파라미터로 Gemini 중복 추천 방지
- [ ] SEO 키워드 DB 확장 (현재 40개 → 100개 목표)
- [ ] K-pop 아이돌 SEO 페이지 (프로그래매틱 `/[lang]/kpop/[idol]`)

### Phase 8: K-pop 아이돌 메뉴 추천 기능 ✅ 완료 (2026-03-23)
- [x] K-pop 아이돌 DB (`src/data/kpopIdols.ts`) — 27개 그룹, 80+ 멤버, 국가별 인기 랭킹
- [x] 아이돌별 확인된 좋아하는 메뉴 데이터 (방송/인터뷰 출처)
- [x] 부족한 아이돌은 localMenus 풀에서 랜덤 보충 (전략 D)
- [x] K-pop 전용 AI 프롬프트 (`src/lib/kpopPromptBuilder.ts`)
- [x] K-pop 전용 로컬 추천 (`src/lib/kpopLocalRecommend.ts`)
- [x] K-pop API 라우트 (`/api/kpop-recommend`) — Gemini → GPT → 로컬 폴백
- [x] 검색 탭 3번째 모드 `⭐ K-pop 메뉴` 추가
- [x] KpopIdolSearch — 아이돌 이름 자동완성 검색 컴포넌트
- [x] KpopCard — 홈 섹션 카드 (인기 아이돌/그룹 탭 + 셔플 + 내부 검색창)
- [x] KpopResultCard — 아이돌 프로필 헤더 + 메뉴 + 레시피 찾기 버튼
- [x] K-pop 탭 선택 시 흑백요리사 카드 자동 숨김
- [x] K-pop 전용 트렌드 상황 10개 (BTS/BLACKPINK/IVE 등 구체적 키워드)
- [x] 인기 추천 상황 — K-pop 탭 선택 시 K-pop 트렌드로 전환
- [x] `useKpopRecommend` hook
- [x] Local DB 업데이트 admin API (`/api/admin/update-db`, ADMIN_SECRET 인증)
- [x] 서버 시작 시 최신 데이터 확인 스크립트 (`pnpm update-db`)
- [x] 4개 언어 i18n 완료 (ko/en/ja/zh `kpop.*` 키)
- [x] next-intl v4 requestLocale 버그 수정 → 다국어 번역 정상화
- [x] 레시피 검색 키워드 개선 (foodName 그대로 포함)
- [x] 위치 기반 검색 반경 5km 확대 + Google Maps 폴백
- [x] ChefCard Top10 rank 1~10 엄격 적용

### Phase 9: 페이지 체류 시간 & 재방문율 향상 ⬜ 대기

> **목표**: 평균 세션 시간 2~3배, 세션당 페이지뷰 1.5배 향상
> **핵심 문제**: 현재 "추천 1회 → 결과 확인 → 이탈"의 단선적 플로우

#### 현재 이탈 포인트 분석

| 이탈 지점 | 원인 | 심각도 |
|-----------|------|--------|
| 추천 결과 후 즉시 이탈 | 결과 1개 보고 다음 행동 유도 없음 | **높음** |
| Rate Limit 대기 중 | 카운트다운만 보임, 할 것 없음 | **높음** |
| 캘린더 빈 상태 | 신규 유저에게 빈 캘린더는 가치 없음 | 중간 |
| 레시피/맛집 로딩 대기 | API 느리면 유저가 직접 YouTube로 이동 | 중간 |
| SEO 페이지 → 홈 전환 끊김 | SEO 페이지에서 홈으로의 자연스러운 플로우 부재 | 중간 |

#### 9-1. 재추천 루프 & 추천 히스토리 ✅ 완료 (P0, git pull 2026-03-24)

**문제**: 추천 1회 후 세션 종료. 비교/탐색 행동 유도 장치 없음.
**목표**: 세션당 평균 추천 횟수 1.2회 → 3+회

**구현 상세**:
- [x] 추천 결과 하단 "🔄 다른 메뉴 추천받기" 원클릭 버튼
  - 위치: `RecommendCard.tsx` / `DualResultView.tsx` / `KpopResultCard.tsx` 하단
  - 클릭 시 현재 결과의 메뉴명을 `exclude` 배열에 추가 후 동일 쿼리로 재호출
  - Rate Limit 카운트에 포함
- [x] "이건 아니야 ✕" 버튼 (개별 메뉴 항목에)
  - 해당 메뉴를 세션 내 제외 목록(`sessionStorage`)에 추가
  - 재추천 시 자동 exclude
- [x] 세션 내 추천 히스토리 슬라이더 (최근 5개)
  - 위치: 추천 결과 영역 상단에 가로 스크롤 미니 카드
  - 각 카드: 메뉴 이모지 + 이름 (클릭 시 해당 결과로 복원)
  - `sessionStorage` 키: `wmj_session_history`
  - 데이터 구조: `{ id, query, result, timestamp }[]`
- [ ] GA4 이벤트: `re_recommend_click`, `history_card_click`
- [ ] i18n 키 추가: `recommend.retry`, `recommend.notThis`, `recommend.history` (4개 언어)

**관련 파일**:
- `src/components/food/RecommendCard.tsx` — 버튼 추가
- `src/components/food/DualResultView.tsx` — 버튼 추가
- `src/components/food/KpopResultCard.tsx` — 버튼 추가
- `src/components/food/RecommendHistory.tsx` — **신규** 히스토리 슬라이더
- `src/hooks/useRecommendHistory.ts` — **신규** sessionStorage 관리 훅
- `src/i18n/messages/*.json` — 키 추가

#### 9-2. 소셜 공유 기능 ✅ 완료 (P0, git pull 2026-03-24)

**문제**: 추천 결과를 외부 공유 불가 → 바이럴 성장 경로 없음.
**목표**: 공유 버튼 클릭률 5%+, 공유 통한 신규 유입 확보

**구현 상세**:
- [ ] `ShareButton.tsx` 컴포넌트 **신규**
  - 위치: 추천 결과 카드 우상단 (공유 아이콘)
  - 공유 대상: 카카오톡, X(Twitter), 링크 복사
  - Web Share API 우선 사용 (지원 시) → 폴백으로 개별 버튼
- [ ] 공유 텍스트 생성 로직:
  - 일반 모드: `"오늘 AI가 추천한 메뉴: {메뉴명} 🍽️ — 오늘뭐먹지"`
  - K-pop 모드: `"{아이돌}이 좋아하는 {메뉴명}! — 오늘뭐먹지"`
  - 셰프 모드: `"흑백요리사 {셰프명}의 {메뉴명} — 오늘뭐먹지"`
  - URL: `{SITE_URL}/{lang}?shared={encodedMenu}` (쿼리 파라미터로 공유 추적)
- [ ] 공유 링크 랜딩 처리:
  - `HomeClient.tsx`에서 `?shared=` 파라미터 감지
  - 감지 시 해당 메뉴로 자동 검색 실행 (신규 유저도 결과 즉시 확인)
- [ ] 카카오톡 공유:
  - Kakao JS SDK 동적 로드 (`next/script`, afterInteractive)
  - `Kakao.Share.sendDefault()` 활용
  - OG 이미지: 기존 동적 OG 이미지 생성기 재활용
- [ ] GA4 이벤트: `share_click` (platform: kakao/twitter/copy)
- [ ] i18n 키: `share.title`, `share.copied`, `share.kakao`, `share.twitter`, `share.copy` (4개 언어)

**관련 파일**:
- `src/components/ui/ShareButton.tsx` — **신규**
- `src/components/food/RecommendCard.tsx` — ShareButton import
- `src/components/food/DualResultView.tsx` — ShareButton import
- `src/components/food/KpopResultCard.tsx` — ShareButton import
- `src/app/[lang]/HomeClient.tsx` — `?shared=` 파라미터 핸들링
- `src/i18n/messages/*.json` — 키 추가

#### 9-3. Rate Limit 대기 콘텐츠 ✅ 완료 (P1, git pull 2026-03-24)

**문제**: Rate Limit 걸리면 카운트다운만 표시 → 이탈 최대 구간.
**목표**: Rate Limit 대기 구간 이탈률 50%+ 감소

**구현 상세**:
- [ ] `RateLimitContent.tsx` 컴포넌트 **신규**
  - Rate Limit 활성 시 카운트다운 아래에 표시
  - 콘텐츠 로테이션 (5초마다 자동 전환):
    1. **음식 상식 퀴즈**: "라면은 몇 년도에 발명되었을까?" → 탭하면 정답 공개
    2. **오늘의 트리비아**: 랜덤 음식 팩트 20개+ (`src/data/foodTrivia.ts` **신규**)
    3. **인기 검색어**: localMenus.ts에서 랜덤 5개 표시 (클릭 시 검색창에 자동 입력)
    4. **셰프/아이돌 미니 퀴즈**: "이 메뉴의 주인공은?" (힌트 → 정답)
- [ ] `src/data/foodTrivia.ts` **신규** — 음식 상식 데이터
  - 구조: `{ question: string, answer: string, emoji: string }[]`
  - 최소 20개 (한국어), i18n 대응은 후순위
- [ ] Rate Limit 해제 시 자동으로 콘텐츠 숨김 + "추천 가능!" 토스트
- [ ] GA4 이벤트: `rate_limit_content_view`, `trivia_answer_click`

**관련 파일**:
- `src/components/food/RateLimitContent.tsx` — **신규**
- `src/data/foodTrivia.ts` — **신규** 퀴즈/트리비아 데이터
- `src/app/[lang]/HomeClient.tsx` — Rate Limit 상태 시 RateLimitContent 렌더링
- `src/hooks/useRateLimit.ts` — 현재 상태 노출 (isLimited, remainingSeconds)

#### 9-4. 즐겨찾기 & 나만의 메뉴북 ✅ 완료 (P1, git pull 2026-03-24)

**문제**: 캘린더에 기록은 하지만 "좋아하는 메뉴"를 모아볼 수 없음. 재방문 이유 부족.
**목표**: 즐겨찾기 기능으로 재방문 동기 생성

**구현 상세**:
- [ ] 추천 결과 각 메뉴 항목에 ♥ 하트 토글 버튼
  - `localStorage` 키: `wmj_favorites`
  - 구조: `{ menuName: string, emoji: string, category: string, savedAt: string }[]`
  - 최대 50개 (초과 시 가장 오래된 것 자동 제거 + 토스트 알림)
- [ ] `FavoritesSection.tsx` 컴포넌트 **신규**
  - 위치: 캘린더 섹션 위 또는 아래 (토글 접기/펼치기)
  - 즐겨찾기 메뉴 그리드 (이모지 + 이름 + 저장일)
  - 카테고리 필터 (한식/중식/양식/일식/기타)
  - "이 메뉴로 다시 추천받기" 버튼 (클릭 → 검색창에 자동 입력)
  - 삭제 버튼 (하트 토글 해제)
- [ ] `useFavorites.ts` 훅 **신규**
  - `addFavorite(menu)`, `removeFavorite(menuName)`, `isFavorite(menuName)`, `favorites`
  - localStorage 동기화
- [ ] 빈 상태 처리: "아직 즐겨찾기가 없어요. 추천받은 메뉴에서 ♥를 눌러보세요!"
- [ ] GA4 이벤트: `favorite_add`, `favorite_remove`, `favorite_recommend_click`
- [ ] i18n 키: `favorites.title`, `favorites.empty`, `favorites.max`, `favorites.recommend` (4개 언어)

**관련 파일**:
- `src/components/food/FavoritesSection.tsx` — **신규**
- `src/hooks/useFavorites.ts` — **신규**
- `src/components/food/RecommendCard.tsx` — ♥ 버튼 추가
- `src/components/food/DualResultView.tsx` — ♥ 버튼 추가
- `src/components/food/KpopResultCard.tsx` — ♥ 버튼 추가
- `src/app/[lang]/HomeClient.tsx` — FavoritesSection 배치
- `src/i18n/messages/*.json` — 키 추가

#### 9-5. 메뉴 배틀 (이거 vs 저거) ✅ 완료 (P2, git pull 2026-03-24)

**문제**: 추천이 일방적 → 유저 참여형 인터랙션 부족.
**목표**: 게이미피케이션으로 체류 시간 30%+ 증가

**구현 상세**:
- [ ] `MenuBattle.tsx` 컴포넌트 **신규**
  - 위치: 인기 주제 바로가기 아래 (항시 노출)
  - AI 추천 결과에서 2개 메뉴 자동 추출 또는 localMenus.ts에서 랜덤 2개
  - "오늘의 메뉴 대결" 헤더 + VS 레이아웃
  - 좌/우 카드 클릭 → 선택 애니메이션 + 결과 저장
  - 선택 후: "당신과 같은 선택을 한 사람: XX%" (로컬 카운트 기반 의사 통계)
- [ ] `localStorage` 키: `wmj_battles`
  - 구조: `{ date: string, menuA: string, menuB: string, choice: 'A'|'B' }[]`
  - 최근 30일 보관
- [ ] 배틀 데이터 기반 "나의 취향 요약" (9-6과 연동)
  - 한식 vs 양식 선택 비율, 해먹기 vs 시켜먹기 선호 등
- [ ] 시간대별 자동 갱신 (아침/점심/저녁/야식 4번)
- [ ] GA4 이벤트: `battle_choice` (menuA/menuB, choice)
- [ ] i18n 키: `battle.title`, `battle.vs`, `battle.result`, `battle.sameChoice` (4개 언어)

**관련 파일**:
- `src/components/food/MenuBattle.tsx` — **신규**
- `src/app/[lang]/HomeClient.tsx` — MenuBattle 배치
- `src/data/localMenus.ts` — 배틀용 메뉴 풀 활용
- `src/i18n/messages/*.json` — 키 추가

#### 9-6. 취향 프로필 & 통계 대시보드 ✅ 완료 (P2, git pull 2026-03-24)

**문제**: 캘린더 인사이트가 7일 해먹기/시켜먹기 비율뿐 → 더 풍부한 개인화 가능.
**목표**: 데이터 축적이 곧 재방문 동기

**구현 상세**:
- [ ] `TasteProfile.tsx` 컴포넌트 **신규**
  - 위치: 캘린더 섹션 내 "나의 음식 DNA" 탭 추가
  - 데이터 소스: `wmj_calendar` + `wmj_favorites` + `wmj_battles`
  - 표시 항목:
    1. 카테고리 분포 (한식/중식/양식/일식) — 도넛 차트 (CSS only, 라이브러리 없음)
    2. 해먹기 vs 시켜먹기 비율 — 가로 막대
    3. 가장 많이 먹은 메뉴 Top 5 — 리스트
    4. 이번 달 식사 기록 횟수 — 숫자 카드
    5. 연속 기록일 수 (스트릭) — 동기 부여
  - 최소 데이터 기준: 5개 이상 기록 시 표시 (미만 시 "더 기록해보세요!" CTA)
- [ ] 월별 리포트 카드 (공유 가능 — 9-2 ShareButton 재활용)
  - "2026년 3월 나의 식단 리포트" 이미지 카드 생성
  - Canvas API 또는 CSS 캡처 (html2canvas는 번들 과다 → CSS 프린트 스타일 우선)
- [ ] GA4 이벤트: `taste_profile_view`, `taste_report_share`
- [ ] i18n 키: `profile.title`, `profile.category`, `profile.topMenus`, `profile.streak` 등 (4개 언어)

**관련 파일**:
- `src/components/food/TasteProfile.tsx` — **신규**
- `src/components/food/CalendarView.tsx` — 탭 추가 (캘린더 | 취향 분석)
- `src/hooks/useCalendar.ts` — 통계 계산 헬퍼 함수 추가
- `src/i18n/messages/*.json` — 키 추가

#### 9-7. SEO 페이지 내부 순환 강화 (P2, 난이도: 낮음, ROI: 중간)

**문제**: SEO 랜딩 → 이탈. 홈으로의 자연스러운 전환 플로우 부재.
**목표**: SEO 페이지 → 홈 전환율 30%+ 달성

**구현 상세**:
- [ ] SEO 페이지 하단 "실시간 AI 추천 받기" CTA 강화
  - 현재: 단순 링크 → 개선: 검색창 프리뷰 + 필터 프리셋 전달
  - URL: `/{lang}?preset={slug}` → 홈에서 자동 필터 적용 + 즉시 추천
- [ ] "비슷한 상황 추천" 비주얼 카드 (현재 RelatedKeywords 텍스트 → 카드 UI)
  - 이모지 + 제목 + 한줄 설명 카드 그리드 (3~4개)
  - 호버/탭 시 미리보기 툴팁
- [ ] SEO 페이지 하단 "오늘의 인기 추천" 3개 (localMenus.ts에서 시간대별 랜덤)
- [ ] `HomeClient.tsx`에서 `?preset=` 파라미터 감지 → 필터 자동 설정 + 추천 실행

**관련 파일**:
- `src/app/[lang]/eat/menu/[slug]/page.tsx` — CTA 강화, 카드 UI
- `src/components/seo/RelatedKeywords.tsx` — 카드 UI로 업그레이드
- `src/app/[lang]/HomeClient.tsx` — `?preset=` 핸들링

#### 9-8. 오늘의 즉시 추천 배너 ✅ 완료 (P3, git pull 2026-03-24)

**문제**: 재방문 시 빈 화면 → 첫 인터랙션까지 시간 소요.
**목표**: 페이지 로드 즉시 가치 전달, 첫 화면 바운스율 감소

**구현 상세**:
- [ ] `InstantRecommend.tsx` 컴포넌트 **신규**
  - 위치: Hero 섹션 바로 아래, 검색 영역 위
  - 로직: API 호출 없이 `localMenus.ts`에서 시간대 + 랜덤으로 1개 추천
  - UI: 작은 배너 카드 "지금 딱 좋은 메뉴: {이모지} {메뉴명}" + "자세히 →"
  - 클릭 → 해당 메뉴명으로 검색 자동 실행
  - 매 방문마다 다른 메뉴 (이전 표시 메뉴 sessionStorage 기록)
  - 검색 결과 표시 중에는 자동 숨김
- [ ] 재방문 유저: "지난번에 {캘린더 마지막 메뉴} 드셨죠? 오늘은 이건 어때요?"
  - `wmj_calendar`에서 최근 메뉴 읽어서 다른 카테고리 추천

**관련 파일**:
- `src/components/food/InstantRecommend.tsx` — **신규**
- `src/app/[lang]/HomeClient.tsx` — 배치
- `src/data/localMenus.ts` — 시간대별 필터 활용

#### 구현 우선순위 & 예상 일정

| 순서 | 태스크 | 우선순위 | 난이도 | 예상 신규 파일 | 예상 수정 파일 |
|------|--------|---------|--------|--------------|--------------|
| 1 | 9-1 재추천 루프 & 히스토리 | P0 | 낮음 | 2개 | 4개 |
| 2 | 9-2 소셜 공유 | P0 | 낮음 | 1개 | 4개 |
| 3 | 9-3 Rate Limit 대기 콘텐츠 | P1 | 낮음 | 2개 | 2개 |
| 4 | 9-4 즐겨찾기 메뉴북 | P1 | 낮음 | 2개 | 4개 |
| 5 | 9-5 메뉴 배틀 | P2 | 중간 | 1개 | 2개 |
| 6 | 9-6 취향 프로필 | P2 | 중간 | 1개 | 2개 |
| 7 | 9-7 SEO 순환 강화 | P2 | 낮음 | 0개 | 3개 |
| 8 | 9-8 즉시 추천 배너 | P3 | 낮음 | 1개 | 1개 |

**권장 구현 순서**: 9-1 → 9-2 → 9-3 → 9-4 순으로 P0/P1 먼저 완료 후 P2/P3 진행.
각 태스크 완료 후 `pnpm build` 검증 필수. i18n 키는 각 태스크 내에서 4개 언어 동시 추가.

### 운영 신뢰성 보강
- [x] 소개 페이지 (`/[lang]/about`)
- [x] 개인정보처리방침 (`/[lang]/privacy`)
- [x] 이용약관 (`/[lang]/terms`)
- [x] 문의 페이지 (`/[lang]/contact`)
- [x] 푸터 법적/신뢰 링크 연결
- [x] 홈 인기 주제 바로가기
- [x] SEO 페이지 본문 설명 강화

## Task Tracker

| 상태 | 태스크 | 우선순위 | 관련 문서 |
|------|--------|---------|----------|
| ✅ | CLAUDE.md & 문서 체계 구성 | P0 | 전체 |
| ✅ | Next.js 프로젝트 초기 셋업 | P0 | ARCHITECTURE.md |
| ✅ | next-intl i18n 설정 (4개 언어) | P0 | ARCHITECTURE.md |
| ✅ | 보안 모듈 구현 (security.ts) | P0 | BACKEND.md |
| ✅ | promptBuilder.ts + localRecommend.ts | P0 | BACKEND.md |
| ✅ | 데이터 파일 (chefs, seoKeywords, filterKeywords, localMenus) | P0 | BACKEND.md |
| ✅ | ads.txt + robots.txt + sitemap (next-sitemap) | P0 | ADSENSE.md |
| ✅ | FooterAd 에드센스 통합 | P0 | ADSENSE.md |
| ✅ | 추천 UI & Gemini 연동 | P1 | FRONTEND.md, BACKEND.md |
| ✅ | 프로그래매틱 SEO 페이지 확장 | P1 | SEO.md |
| ✅ | 캘린더 기능 | P2 | FRONTEND.md |
| ✅ | UX 고도화 (통합 검색, 레시피 API, 인사이트, 듀얼 모드) | P1 | FRONTEND.md |
| ✅ | 운영 신뢰성/승인 대응 보강 | P2 | HANDOFF.md |
| ✅ | K-pop 아이돌 메뉴 추천 기능 전체 구현 | P1 | FRONTEND.md, BACKEND.md |
| ✅ | next-intl v4 번역 버그 수정 (requestLocale) | P0 | ARCHITECTURE.md |
| ✅ | 위치 기반 검색 개선 (반경 확대 + Google Maps 폴백) | P1 | BACKEND.md |
| ✅ | 레시피 검색 키워드 개선 (foodName 그대로) | P1 | BACKEND.md |
| ✅ | Local DB 업데이트 admin API + 서버 시작 스크립트 | P2 | BACKEND.md |
| 🔵 | 크롬 수동 테스트 (K-pop 포함 전체 흐름) | P0 | docs/test_ai.md |
| 🔵 | SiteFooter i18n 통일 (FOOTER_COPY → footer.* 키) | P1 | FRONTEND.md |
| ⬜ | 보안 강화 (유니코드 정규화) | P1 | BACKEND.md |
| ⬜ | Core Web Vitals 측정 & 최적화 | P2 | PERFORMANCE.md |
| ⬜ | Vercel 프로덕션 배포 + 환경변수 설정 | P0 | HANDOFF.md |
| ⬜ | Search Console 등록 & sitemap 제출 | P1 | SEO.md |
| ⬜ | AdSense 사이트 등록 & 승인 신청 | P1 | ADSENSE.md |
| ⬜ | K-pop SEO 페이지 (`/[lang]/kpop/[idol]`) | P3 | SEO.md |
| ⬜ | SEO 키워드 DB 확장 (40개 → 100개) | P3 | SEO.md |
| ✅ | **[Phase 9]** 재추천 루프 & 히스토리 슬라이더 (RecommendHistory, useRecommendHistory) | P0 | FRONTEND.md |
| ✅ | **[Phase 9]** 소셜 공유 (X/링크복사, ShareButton) | P0 | FRONTEND.md |
| ✅ | **[Phase 9]** Rate Limit 대기 콘텐츠 (RateLimitContent, foodTrivia.ts) | P1 | FRONTEND.md |
| ✅ | **[Phase 9]** 즐겨찾기 & 나만의 메뉴북 (FavoritesSection, useFavorites) | P1 | FRONTEND.md |
| ✅ | **[Phase 9]** 메뉴 배틀 (MenuBattle) | P2 | FRONTEND.md |
| ✅ | **[Phase 9]** 취향 프로필 & 통계 대시보드 (TasteProfile) | P2 | FRONTEND.md |
| ✅ | **[Phase 9]** 오늘의 즉시 추천 배너 (InstantRecommend) | P3 | FRONTEND.md |
| ✅ | **[Phase 9]** SEO 페이지 내부 순환 강화 | P2 | SEO.md |

**범례**: ✅ 완료 · 🔵 진행 중 · ⬜ 대기

## Decision Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2026-03-18 | Next.js App Router 채택 | SSR/ISR로 SEO 극대화 |
| 2026-03-18 | Tailwind CSS 채택 | 빠른 렌더링, CLS 최소화 |
| 2026-03-18 | Gemini Flash API 채택 | 무료 한도 1,500 RPD, 빠른 응답 |
| 2026-03-20 | 광고는 footer에만 배치 | 에드센스 승인 우선, 과도한 광고 방지 |
| 2026-03-20 | next-intl i18n 라우팅 | 4개 언어 SEO 독립 URL |
| 2026-03-20 | localStorage 중심 (DB 없음) | Vercel 무료 배포, 비용 최소화 |
| 2026-03-20 | 흑백요리사 1·2 Top 10 하드코딩 | 트렌드 핵심, 추가 트렌드는 AI 위임 |
| 2026-03-20 | 캘린더는 localStorage 주간 뷰부터 구현 | 서버 없이 빠르게 저장/복원 가능한 UX 우선 |
| 2026-03-20 | SEO 상세 페이지는 ISR + Article JSON-LD 우선 적용 | 정적 색인성과 구현 복잡도 균형 |
| 2026-03-20 | 신뢰 페이지를 다국어 정적 페이지로 제공 | 승인 심사와 사용자 신뢰 확보 목적 |
| 2026-03-21 | 추천 결과에 배달앱/레시피 딥링크 추가 | 경쟁사(배민/Yummly) 대비 행동 완결 UX 강화 |
| 2026-03-21 | 시간대별 자동 추천 카드 도입 | 식신·카카오 AI메이트의 자동 제안 패턴 벤치마킹 |
| 2026-03-21 | 캘린더 인사이트 (7일 패턴 분석) | 다이닝코드 패턴 학습 기능 경량화 도입 |
| 2026-03-21 | 냉장고 파먹기 모드 제거 | 사용 빈도 낮고 AI 쿼터 소모 과다 |
| 2026-03-21 | 세션 기반 Rate Limit (30분 세션) | 서버 비용 절감 + 어뷰저 방지, AI 쿼터 소진 시 자동 해제 |
| 2026-03-22 | AI 검색 듀얼 모드 (해먹기/시켜먹기 동시 표시) | 단일 AI 호출로 두 결과 제공, 사용자 선택지 확대 |
| 2026-03-22 | 흑백요리사 시즌별 Top10/출연자 탭 + 셔플 | 콘텐츠 다양성 + 재방문 유도 |
| 2026-03-23 | K-pop 아이돌 메뉴 추천 기능 신설 | 한류 팬 대상 글로벌 트래픽 확보, 4개 언어 SEO 강화 |
| 2026-03-23 | K-pop 아이돌 데이터 전략: 확인된 메뉴 우선 + 로컬 폴백 | AI 토큰 없을 때도 의미있는 추천 제공 |
| 2026-03-23 | K-pop 탭 선택 시 흑백요리사 카드 숨김 | 모드별 콘텐츠 집중도 향상 |
| 2026-03-23 | Local DB 업데이트 admin API 도입 | 서버 재기동 시 최신 K-pop/트렌드 데이터 갱신 가능 |
| 2026-03-23 | next-intl v4 requestLocale 수정 | v3 → v4 API 변경으로 다국어 번역이 전부 한국어로 고정되던 버그 수정 |
| 2026-03-23 | 레시피 검색 키워드: foodName 그대로 포함 | "백종원 {menu}" 등 불필요 접두어 제거, 검색 의도 정확히 반영 |
| 2026-03-22 | Phase 9 페이지 체류 시간 향상 계획 수립 | "추천 1회→이탈" 단선적 플로우 해소, 재추천 루프·공유·게이미피케이션으로 세션 깊이 확보 |
| 2026-03-22 | localStorage 중심 개인화 유지 (DB 불필요) | 즐겨찾기/배틀/취향 프로필 모두 localStorage로 구현, Vercel 무료 배포 제약 준수 |
| 2026-03-22 | 외부 라이브러리 최소화 원칙 | 차트는 CSS only, 공유는 Web Share API 우선, html2canvas 대신 CSS 프린트 스타일 |
| 2026-03-24 | git pull origin main — Phase 9 기능 원격 병합 | 원격에서 Phase 9 전체(FavoritesSection, MenuBattle, InstantRecommend, RateLimitContent, RecommendHistory, TasteProfile, ShareButton, useFavorites, useRecommendHistory, usageTracker, admin 페이지 등) 구현 완료 상태로 pull |
| 2026-03-24 | admin 대시보드 페이지 (/admin) 추가 | AI 사용량 모니터링, K-pop/트렌드 DB 업데이트, 시스템 상태 확인 통합 UI |
