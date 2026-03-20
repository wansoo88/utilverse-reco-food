# Project Plan & Roadmap

> 이 문서는 `/plan-update` 스킬이 관리합니다. 태스크 완료/추가 시 자동 업데이트됩니다.

## Current Phase

✅ **Phase 1: 프로젝트 셋업 & 기반 구축** (완료 — 2026-03-20)
🔵 **Phase 2: 핵심 추천 UI 개발** (진행 중)

## Milestones

### Phase 1: 프로젝트 셋업 & 기반 구축
- [x] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind v4, pnpm)
- [x] next-intl i18n 설정 (ko/en/ja/zh, defaultLocale: ko)
- [x] 환경변수 구성 (.env.example, .env.local)
- [x] 에드센스 스크립트 로더 설정 (afterInteractive — src/config/adsense.ts)
- [ ] FooterAd 컴포넌트 (유일한 광고 위치) — Phase 2에서 구현
- [x] ads.txt, robots.txt, sitemap 자동 생성 (next-sitemap)
- [x] 3단계 보안 모듈 (security.ts: BLOCKED_PATTERNS, FOOD_SIGNALS, validateInput)

### Phase 2: 핵심 추천 UI 개발
- [ ] 홈페이지 레이아웃 (Hero + 검색 + 필터 + 결과)
- [ ] FilterSection 구현 (해먹기/시켜먹기, 가구, 상황, 예산)
- [ ] 검색창 ↔ 필터 키워드 자동 어펜드 (하이브리드)
- [ ] 흑백요리사 전용 배너 + 보라색 칩 강조
- [ ] RecommendCard (AI 추천 결과 표시)
- [ ] /api/recommend Route Handler (Gemini Flash 연동 + Layer 2 보안)
- [ ] localRecommend() 폴백 (Gemini 쿼터 초과 대비)
- [ ] promptBuilder.ts (buildUserPrompt 생성 로직)
- [ ] 필터 localStorage 저장/복원 (wmj_filters)
- [ ] 흑백요리사 1·2 Top 10 셰프 데이터 (src/data/chefs.ts)

### Phase 3: 캘린더 & 부가 기능
- [ ] CalendarView (월간/주간 식단 기록)
- [ ] wmj_calendar localStorage 저장
- [ ] Toast 알림 시스템 (필터 복원, 보안 차단, 저장 완료)
- [ ] 다국어 키워드 매핑 (filterKeywords.ts)

### Phase 4: 프로그래매틱 SEO
- [ ] /[lang]/eat/menu/[slug] ISR 페이지 (30개+ 키워드)
- [ ] SEO 키워드 DB (src/data/seoKeywords.ts)
- [ ] 빌드 타임 AI 추천 결과 캐싱
- [ ] JSON-LD 구조화 데이터 (Article + Recipe schema)
- [ ] 유튜브 레시피 영상 5개 연동 (선택)
- [ ] 관련 키워드 내부 링크 (RelatedKeywords)
- [ ] OpenGraph + Twitter Card 메타 태그
- [ ] 언어별 sitemap 자동 생성 (4 x 30개+)

### Phase 5: 성능 최적화 & 배포
- [ ] Core Web Vitals 최적화 (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] 이미지/폰트 최적화 (next/font, WebP)
- [ ] 번들 분석 & 코드 스플리팅
- [ ] Vercel 프로덕션 배포
- [ ] GA4 연동 & 이벤트 추적
- [ ] Search Console 등록 & 색인 요청
- [ ] AdSense 사이트 등록 & 승인 신청

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
| 🔵 | FooterAd 에드센스 통합 | P0 | ADSENSE.md |
| 🔵 | 추천 UI & Gemini 연동 | P1 | FRONTEND.md, BACKEND.md |
| ⬜ | 프로그래매틱 SEO 페이지 | P1 | SEO.md |
| ⬜ | 캘린더 기능 | P2 | FRONTEND.md |
| ⬜ | 성능 최적화 & 배포 | P2 | PERFORMANCE.md, HANDOFF.md |

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
