# System Architecture

> 모든 스킬이 구조적 결정 시 이 문서를 참조합니다.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ GA4      │  │ AdSense  │  │ Next.js App            │ │
│  │ Script   │  │ (footer) │  │ (React 18 + App Router)│ │
│  └──────────┘  └──────────┘  │ + next-intl (i18n)     │ │
│                               └────────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐    │
│  │ localStorage                                      │    │
│  │  wmj_filters / wmj_calendar / wmj_lang            │    │
│  └──────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Vercel Edge Network                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ CDN      │  │ Edge     │  │ ISR Cache             │  │
│  │ Cache    │  │ Functions│  │ (SEO 페이지 캐싱)      │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Next.js Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ App Router   │  │ /api/        │  │ Middleware     │ │
│  │ (SSR/ISR)    │  │ recommend    │  │ (i18n redirect │ │
│  │              │  │              │  │  + security)   │ │
│  └──────────────┘  └──────┬───────┘  └───────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │  Google Gemini Flash API │
              │  (음식 추천 엔진)         │
              └─────────────────────────┘
```

## Security Architecture (3단계)

```
[사용자 입력]
    │
    ▼
[Layer 1: 프론트엔드] → src/lib/security.ts
    ├─ BLOCKED_PATTERNS (15개 정규식): 프롬프트 인젝션 차단
    ├─ 200자 길이 제한
    ├─ FOOD_SIGNALS: 50자+ 입력 시 음식 관련성 검증
    ├─ 차단 → 빨간 토스트, API 미호출
    │
    ▼
[Layer 2: API 서버] → src/app/api/recommend/route.ts
    ├─ HTML 태그 제거, 특수문자 이스케이프
    ├─ BLOCKED_PATTERNS 재검사 (프론트 우회 대비)
    ├─ 쿼터 체크 → 초과 시 localRecommend() 폴백
    │
    ▼
[Layer 3: AI 시스템 프롬프트]
    ├─ 역할 고정: "한국 음식 추천 AI"
    ├─ 비음식 질문 → {"error":"food_only"} 반환
    └─ JSON-only 출력 강제
```

## Routing Structure

```
/                                → next-intl 기본 로케일 리다이렉트
/[lang]/                         → 홈 (추천 UI + 필터)
/[lang]/eat/menu/[slug]          → 프로그래매틱 SEO 페이지 (ISR)
/api/recommend                   → Gemini 추천 API (POST)
/sitemap.xml                     → 자동 생성 (4개 언어 x 30개+ 키워드)
/robots.txt                      → 크롤러 설정
```

### 지원 로케일

| 코드 | 언어 | 기본값 |
|------|------|--------|
| `ko` | 한국어 | ✅ (defaultLocale) |
| `en` | 영어 | |
| `ja` | 일본어 | |
| `zh` | 중국어 | |

## Rendering Strategy

| Route | Strategy | Revalidation | 이유 |
|-------|----------|-------------|------|
| `/[lang]` | SSR | 없음 | 실시간 AI 추천, 필터 상태 반영 |
| `/[lang]/eat/menu/[slug]` | ISR | 7일 | SEO 페이지, 빌드 타임 AI 결과 캐싱 |
| `/api/recommend` | Dynamic | 없음 | 실시간 Gemini API 호출 |

## Component Hierarchy

```
RootLayout
├── next-intl Provider (i18n)
├── GA4 Script
├── [lang] Layout
│   ├── Header (네비게이션, 언어 선택)
│   ├── Main Content
│   │   ├── 홈페이지
│   │   │   ├── HeroBanner (흑백요리사 프로모 배너)
│   │   │   ├── SearchBar (키워드 자동 어펜드)
│   │   │   ├── FilterSection
│   │   │   │   ├── ModeFilter (해먹기/시켜먹기)
│   │   │   │   ├── HouseholdFilter (1인/2인/가족)
│   │   │   │   ├── VibeFilter (흑백요리사/단짠/비오는날...)
│   │   │   │   └── BudgetFilter (예산)
│   │   │   ├── RecommendCard (AI 추천 결과)
│   │   │   └── CalendarView (식단 캘린더)
│   │   └── SEO 페이지 (/eat/menu/[slug])
│   │       ├── PresetRecommend (빌드 타임 캐싱 결과)
│   │       ├── YoutubeRecipes (관련 유튜브 5개)
│   │       └── RelatedKeywords (내부 링크)
│   ├── Footer
│   │   └── FooterAd (AdSense 광고 — 유일한 광고 위치)
│   └── AdSense Script (afterInteractive)
```

## Data Flow

### 실시간 추천 흐름
```
1. 사용자 필터 선택/검색어 입력
2. validateInput() → Layer 1 보안 검증
3. buildUserPrompt() → Gemini 프롬프트 생성
   예: Q:"비오는날 혼밥"|M:해먹기|인원:1p|상황:[rain]|예산:10k
4. POST /api/recommend → Layer 2 정제 → Gemini Flash API
5. JSON 응답 → RecommendCard 렌더링
6. 사용자가 "오늘의 메뉴로 저장" → localStorage wmj_calendar에 기록
```

### 필터 ↔ 검색창 동기화
```
필터 클릭 시:
  [1인 클릭] → 검색창: "혼밥"
  [비오는날 클릭] → 검색창: "혼밥 비오는날"
  [흑백요리사 클릭] → 검색창: "혼밥 비오는날 흑백요리사"
  [비오는날 해제] → 검색창: "혼밥 흑백요리사"

검색창 직접 입력도 가능 (하이브리드 방식)
```

## External Services

| 서비스 | 용도 | 연동 방식 |
|--------|------|----------|
| Google Gemini Flash | AI 음식 추천 | Server-side API (POST) |
| Google AdSense | 광고 수익화 (footer만) | Script tag + FooterAd 컴포넌트 |
| Google Analytics 4 | 트래픽 분석 | next/script |
| Google Search Console | SEO 모니터링 | sitemap 제출, 도메인 인증 |
| YouTube Data API | 레시피 영상 (SEO 페이지) | ISR 빌드 타임 fetch (선택) |

## Key Decisions

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2026-03-18 | Next.js App Router 채택 | SSR/ISR SEO 극대화, 레이아웃 기반 구조 |
| 2026-03-18 | 광고는 footer에만 배치 | 에드센스 승인 우선, 과도한 광고 인상 방지 |
| 2026-03-18 | next-intl i18n 라우팅 | 4개 언어 SEO 페이지 독립 URL 필요 |
| 2026-03-18 | Gemini Flash API | 무료 한도(1,500 RPD) 내 운영, 빠른 응답 |
| 2026-03-18 | localStorage 중심 상태 관리 | DB 비용 없이 필터/캘린더/언어 저장 |
| 2026-03-20 | 흑백요리사 1·2 Top 10 하드코딩 | 트렌드 핵심 콘텐츠, 추가 트렌드는 AI 위임 |
