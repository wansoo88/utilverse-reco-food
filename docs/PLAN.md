# Project Plan & Roadmap

> 이 문서는 `/plan-update` 스킬이 관리합니다. 태스크 완료/추가 시 자동 업데이트됩니다.

## Current Phase

✅ **Phase 1: 프로젝트 셋업 & 기반 구축** (완료 — 2026-03-20)
✅ **Phase 2: 핵심 추천 UI 개발** (완료 — 2026-03-20)
✅ **Phase 3: 캘린더 & 프로그래매틱 SEO 확장** (완료 — 2026-03-20)
✅ **Phase 4: 프로그래매틱 SEO** (완료 — 2026-03-20)
✅ **Phase 6: UX 고도화** (완료 — 2026-03-21)
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
- [x] 통합 검색 블록 (3모드 탭: 일반검색 / AI추천 / 냉장고 파먹기)
- [x] 검색 결과 검색창 바로 아래 인라인 표시
- [x] AI 추천 모드 필터 접기/펼치기 (비간섭 배치)
- [x] 냉장고 파먹기 모드 (재료 입력 → cook 모드 Gemini 추천)
- [x] /api/recipes — Gemini 트렌드 레시피 5개 API 신설
- [x] RecipeSuggestions 컴포넌트 (유튜브 3개 + 레시피 사이트 2개 링크)
- [x] RecommendCard 심플화 + 레시피 통합
- [x] 시간대별 자동 추천 카드 (아침/점심/저녁/야식)
- [x] 식단 캘린더 인사이트 (7일 패턴 분석 + 넛지)
- [x] promptBuilder v5 (ingredients, 파이프 구조)
- [x] 4개 언어 i18n 전체 확장 (search.* / recipe.* / nav.* 키 신규)
- [x] docs/PROMPT.md v5 업데이트

### Phase 7: 검증 & 수익화 준비 🔵 진행 중

#### 7-1. 테스트 (즉시)
- [ ] `test_ai.md` 기반 크롬 수동 테스트 63개 케이스 실행
  - TC-01 기본 UI 렌더링
  - TC-02 시간대별 자동 추천 카드
  - TC-03 냉장고 파먹기 모드
  - TC-04 AI 추천 결과 + 레시피 링크
  - TC-05 식단 캘린더 인사이트
  - TC-06 필터 & 기본 추천
  - TC-07 다국어 전환 (EN/JA/ZH 전체 UI 번역 확인)
  - TC-08 반응형 모바일 레이아웃
  - TC-09 성능 & 접근성

#### 7-2. 번역 완결 (단기)
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
- [ ] Rate Limiting per IP (10 req/min) — Vercel Edge Middleware 또는 API 레벨

#### 7-5. Vercel 배포 (배포 전)
- [ ] Vercel 프로젝트 연결 & 환경변수 설정
  - `GEMINI_API_KEY`
  - `NEXT_PUBLIC_ADSENSE_PUB_ID`
  - `NEXT_PUBLIC_GA_ID`
  - `NEXT_PUBLIC_SITE_URL=https://utilverse.net`
- [ ] 프로덕션 빌드 검증 (`pnpm build` 에러 없음 확인)
- [ ] 커스텀 도메인 연결 (utilverse.net 또는 서브도메인)

#### 7-6. 수익화 (배포 후)
- [ ] Google Search Console 등록 & sitemap 제출
- [ ] Google AdSense 사이트 등록 & 승인 신청
  - 승인 전: footer 광고 슬롯 플레이스홀더 유지
  - 승인 후: `NEXT_PUBLIC_ADSENSE_PUB_ID` 환경변수 입력 → 자동 활성화
- [ ] GA4 이벤트 수신 확인 (recommend_submit, fridge_submit, calendar_save 등)

#### 7-7. 중기 개선 (배포 이후)
- [ ] 캘린더 최근 7일 식단 → `exclude` 파라미터로 Gemini 중복 추천 방지
- [ ] 위치 기반 시켜먹기 (Geolocation API — 선택적 동의)
- [ ] 흑백요리사 셰프 추천 콘텐츠 카드 (chefs.ts 데이터 홈 활용)
- [ ] SEO 키워드 DB 확장 (현재 40개 → 100개 목표)

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
| ✅ | UX 고도화 (통합 검색, 레시피 API, 인사이트, 냉장고 모드) | P1 | FRONTEND.md |
| ✅ | 운영 신뢰성/승인 대응 보강 | P2 | HANDOFF.md |
| 🔵 | 크롬 수동 테스트 63케이스 실행 (test_ai.md) | P0 | docs/test_ai.md |
| 🔵 | 번역 완결 검증 (EN/JA/ZH 전체 UI) | P1 | FRONTEND.md |
| 🔵 | SiteFooter i18n 통일 (FOOTER_COPY → footer.* 키) | P1 | FRONTEND.md |
| ⬜ | 보안 강화 (유니코드 정규화, Rate Limiting) | P1 | BACKEND.md |
| ⬜ | Core Web Vitals 측정 & 최적화 | P2 | PERFORMANCE.md |
| ⬜ | Vercel 프로덕션 배포 + 환경변수 설정 | P0 | HANDOFF.md |
| ⬜ | Search Console 등록 & sitemap 제출 | P1 | SEO.md |
| ⬜ | AdSense 사이트 등록 & 승인 신청 | P1 | ADSENSE.md |
| ⬜ | 캘린더 exclude 파라미터 Gemini 연동 | P2 | BACKEND.md |
| ⬜ | 흑백요리사 셰프 콘텐츠 카드 홈 노출 | P3 | FRONTEND.md |
| ⬜ | SEO 키워드 DB 확장 (40개 → 100개) | P3 | SEO.md |

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
| 2026-03-20 | 기본 웹폰트는 `next/font`로 로컬 최적화 | 초기 렌더 안정성과 CLS 완화 목적 |
| 2026-03-21 | 추천 결과에 배달앱/레시피 딥링크 추가 | 경쟁사(배민/Yummly) 대비 행동 완결 UX 강화 |
| 2026-03-21 | 시간대별 자동 추천 카드 도입 | 식신·카카오 AI메이트의 자동 제안 패턴 벤치마킹 |
| 2026-03-21 | 캘린더 인사이트 (7일 패턴 분석) | 다이닝코드 패턴 학습 기능 경량화 도입 |
| 2026-03-21 | 냉장고 파먹기 모드 | Whisk/Yummly 재료 기반 추천 포지션 공략, 검색 수요 높음 |
| 2026-03-21 | 3모드 통합 검색 블록 도입 | 분산된 검색/필터/냉장고 UI를 단일 블록으로 통합, 결과 인라인 표시 |
| 2026-03-21 | /api/recipes Gemini 레시피 API 신설 | 정적 딥링크 → AI 생성 트렌드 레시피 5개로 대체, 콘텐츠 가치 향상 |
| 2026-03-21 | i18n 전체 확장 (search/recipe/nav 키) | 언어 전환 시 모든 UI 텍스트가 즉시 변환되도록 완결 |
| 2026-03-21 | promptBuilder v5 (파이프 구조 + ingredients) | 토큰 효율 + 재료 기반 추천 지원, docs/PROMPT.md에 v5 아키텍처 기록 |
