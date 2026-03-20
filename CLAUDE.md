# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**오늘뭐먹지** — AI 기반 음식 추천 서비스 (`utilverse.net` 서브 서비스)

사용자의 필터(가구 유형, 상황, 예산, 해먹기/시켜먹기)를 받아 Gemini Flash API로 음식을 추천하고, AdSense 광고로 수익화하는 Next.js 앱.

**수익의 3대 축**: 트래픽 볼륨 (SEO) · 페이지 속도 (Core Web Vitals) · 광고 가시성 (Viewability)

## Tech Stack

- **Framework**: Next.js 14+ (App Router) — SSR/ISR로 SEO 극대화
- **AI**: Google Gemini Flash API — 음식 추천 엔진
- **Styling**: Tailwind CSS
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Analytics**: Google Analytics 4 + AdSense Reporting
- **Hosting**: Vercel (Edge optimized)

## Commands

```bash
pnpm dev          # 개발 서버 (localhost:3000)
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 서버
pnpm lint         # ESLint
pnpm test         # Vitest (unit)
pnpm test:e2e     # Playwright (e2e)
pnpm test:run -- src/path/to/test.spec.ts  # 단일 테스트 실행
```

## 핵심 아키텍처

### AI 추천 파이프라인

사용자 입력 → **3단계 보안 검증** → Gemini Flash API → JSON 응답 렌더링

**보안 레이어** (`docs_new/prompt.md` 참조):
1. **Layer 1 (프론트엔드)**: 프롬프트 인젝션 15개 패턴 차단, 200자 제한, 50자+ 입력 시 음식 관련성 검증
2. **Layer 2 (API 서버 `/api/recommend`)**: HTML 태그 제거, 특수문자 이스케이프, 동일 패턴 재검사
3. **Layer 3 (시스템 프롬프트)**: 역할 고정, 탈옥 방어, JSON-only 출력 강제

AI가 비음식 질문 감지 시 `{"error":"food_only"}` 반환 → 프론트엔드 차단 토스트 표시.

### 프로그래매틱 SEO

`/[lang]/eat/menu/[slug]` 라우트로 30개+ 롱테일 키워드 페이지 자동 생성 (4개 언어: ko/en/ja/zh). 빌드 타임 AI 추천 결과 캐싱. 상세 키워드 DB는 `docs_new/plan.md` 참조.

### 다국어 지원 (next-intl)

next-intl 기반 i18n 라우팅 (`/ko/...`, `/en/...`, `/ja/...`, `/zh/...`). 기본 로케일: ko.
User Prompt에 `Lang:EN/JA/ZH` 태그 추가 시 AI가 해당 언어로 출력.

### 광고 전략

**footer에만 AdSense 광고 배치** — 과도한 광고 인상을 방지하고 에드센스 승인 가능성 극대화.
에드센스 승인 후 트래픽에 따라 단계적으로 광고 위치 확장 (상세: docs/ADSENSE.md).

### 필터 & 상태 관리

localStorage 키:
- `wmj_filters`: `{ mode, house, baby, vibes[], budget }` — 필터 상태 (재방문 시 자동 복원)
- `wmj_calendar`: `{ [date]: { menu, category, decision } }` — 식단 캘린더
- `wmj_lang`: 선택 언어

필터 클릭 시 검색창에 키워드 자동 어펜드 (하이브리드 방식 — 자유 입력도 가능).

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (AdSense + next-intl)
│   ├── [lang]/                 # i18n 동적 라우트
│   │   ├── page.tsx            # 홈 (추천 UI)
│   │   └── eat/menu/[slug]/    # 프로그래매틱 SEO 페이지 (ISR)
│   ├── api/recommend/          # Gemini API (보안 Layer 2)
│   └── not-found.tsx           # 404 (광고 없음)
├── components/
│   ├── ads/                    # 광고 (FooterAd만 — footer 전용)
│   ├── food/                   # 음식 추천 UI (FilterChip, RecommendCard, CalendarView)
│   ├── ui/                     # 공통 UI (Button, Card, Toast, LanguageSelector)
│   └── seo/                    # SEO (JsonLd, Breadcrumb)
├── config/
│   ├── adsense.ts              # 에드센스 설정 — 하드코딩 금지
│   └── site.ts                 # 사이트 메타
├── data/
│   ├── chefs.ts                # 흑백요리사 1·2 Top 10 셰프 & 메뉴
│   ├── seoKeywords.ts          # SEO 키워드 DB (30개+, 4개 언어)
│   ├── filterKeywords.ts       # 필터 ↔ 검색창 키워드 매핑
│   └── localMenus.ts           # 폴백 추천용 메뉴 풀
├── hooks/
│   ├── useFilters.ts           # 필터 상태 + localStorage
│   ├── useRecommend.ts         # 추천 API 호출
│   └── useCalendar.ts          # 캘린더 localStorage
├── i18n/                       # next-intl
│   ├── request.ts
│   └── messages/ (ko/en/ja/zh.json)
├── lib/
│   ├── security.ts             # BLOCKED_PATTERNS, validateInput, FOOD_SIGNALS
│   ├── promptBuilder.ts        # buildUserPrompt()
│   └── localRecommend.ts       # Gemini 폴백
└── types/
    ├── recommend.ts            # CookResponse, OrderResponse
    └── filter.ts               # FilterState

public/
├── ads.txt                     # AdSense 인증
└── og/                         # OpenGraph 이미지
```

## Code Conventions

- **문서 언어**: 코드/변수/파일명 → 영어, 주석/커밋 → 한국어
- **광고 설정**: `src/config/adsense.ts`에 집중, 컴포넌트에 슬롯 ID 하드코딩 금지
- **보안 로직**: `src/lib/security.ts`에 집중 (프론트 검증 로직)
- **에러/404 페이지**: 광고 컴포넌트 import 금지 (AdSense 정책)
- **Gemini 폴백**: 쿼터 초과(`_fallback: true`) 시 `localRecommend()` 자동 실행

## 환경변수

```
NEXT_PUBLIC_ADSENSE_PUB_ID=   # AdSense 퍼블리셔 ID
NEXT_PUBLIC_GA_ID=             # GA4 측정 ID
GEMINI_API_KEY=                # Gemini Flash API 키 (서버 전용)
NEXT_PUBLIC_SITE_URL=          # https://utilverse.net
```

## 핵심 원칙

1. **에드센스 정책 준수**: 모든 페이지 Google AdSense 정책 준수, 에러/404에 광고 없음
2. **Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1 (광고 슬롯 고정 치수 필수)
3. **보안 3단계 유지**: `src/lib/security.ts` 패턴 수정 시 Layer 1·2·3 모두 동기화
4. **문서 동기화**: 코드 변경 시 관련 `docs/` 문서 함께 업데이트
5. **변경 이력**: 주요 변경사항 `docs/CHANGELOG.md`에 기록

## 문서 체계 (docs/)

| 문서 | 역할 | 관련 스킬 |
|------|------|----------|
| [docs/PLAN.md](docs/PLAN.md) | 로드맵 & 태스크 추적 | `/plan-update` |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 시스템 아키텍처 | 모든 스킬 참조 |
| [docs/ADSENSE.md](docs/ADSENSE.md) | 에드센스 전략 & 정책 | `/adsense-setup`, `/ad-placement`, `/monetization-report` |
| [docs/SEO.md](docs/SEO.md) | SEO 최적화 규칙 | `/seo-audit` |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | 성능 최적화 & 예산 | `/performance-check` |
| [docs/FRONTEND.md](docs/FRONTEND.md) | 컴포넌트 & UI 가이드 | `/ad-placement`, `/design-system` |
| [docs/BACKEND.md](docs/BACKEND.md) | API, 데이터, 캐싱 | `/adsense-setup` |
| [docs/DESIGN.md](docs/DESIGN.md) | 디자인 시스템 | `/design-system` |
| [docs/TESTING.md](docs/TESTING.md) | Phase별 테스트 전략 | 모든 개발 스킬 |
| [docs/HANDOFF.md](docs/HANDOFF.md) | 배포 체크리스트 | `/handoff` |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 변경 이력 | 모든 스킬이 기록 |
| [docs_new/plan.md](docs_new/plan.md) | PRD v4 (기능 상세) | 개발 작업 시 참조 |
| [docs_new/prompt.md](docs_new/prompt.md) | AI 프롬프트 설계서 v4 | `/api/recommend` 작업 시 참조 |

## 스킬 가이드

| 스킬 | 사용 시점 |
|------|----------|
| `/adsense-setup` | 에드센스 초기 통합 또는 새 페이지 광고 추가 시 |
| `/ad-placement` | 새 페이지 완성 후 광고 배치 최적화 시 |
| `/seo-audit` | 페이지 발행 전 SEO 점검 시 |
| `/performance-check` | Core Web Vitals 저하 의심 또는 정기 점검 시 |
| `/monetization-report` | 수익화 건강도 전체 점검 시 |
| `/plan-update` | 태스크 완료/추가, 마일스톤 변경 시 |
| `/design-system` | 새 컴포넌트 스타일 추가/수정 시 |
| `/handoff` | 프로덕션 배포 직전 |
