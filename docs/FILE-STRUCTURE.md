# File & Folder Structure Rules

> 프로젝트 파일과 설정 파일의 체계적인 폴더링 규칙입니다.

## Directory Structure

```
/
├── .claude/                        # Claude Code 설정
│   ├── settings.json
│   ├── hooks/
│   └── skills/
│
├── docs/                           # 프로젝트 문서 (Claude 참조용)
│   └── *.md
│
├── docs_new/                       # PRD & 프롬프트 설계서 (원본 기획)
│   ├── plan.md                     # PRD v4.0
│   └── prompt.md                   # AI 프롬프트 설계서 v4.0
│
├── src/                            # 소스 코드 (Next.js App Router)
│   ├── app/
│   │   ├── layout.tsx              # Root layout (AdSense script + next-intl)
│   │   ├── [lang]/                 # i18n 동적 라우트
│   │   │   ├── layout.tsx          # 언어별 레이아웃
│   │   │   ├── page.tsx            # 홈 (추천 UI)
│   │   │   └── eat/
│   │   │       └── menu/
│   │   │           └── [slug]/
│   │   │               └── page.tsx  # 프로그래매틱 SEO 페이지 (ISR)
│   │   ├── api/
│   │   │   └── recommend/
│   │   │       └── route.ts        # Gemini 추천 API (POST)
│   │   ├── not-found.tsx           # 404 (광고 없음)
│   │   ├── error.tsx               # Error (광고 없음)
│   │   ├── globals.css
│   │   ├── sitemap.ts              # 동적 사이트맵 (4lang x 30+ keywords)
│   │   └── robots.ts
│   │
│   ├── components/
│   │   ├── food/                   # 음식 추천 UI
│   │   │   ├── HeroBanner.tsx      # 흑백요리사 프로모 배너
│   │   │   ├── SearchBar.tsx       # 검색창 (필터 키워드 자동 어펜드)
│   │   │   ├── FilterSection.tsx   # 필터 그룹 래퍼
│   │   │   ├── FilterChip.tsx      # 개별 필터 칩
│   │   │   ├── ModeFilter.tsx      # 해먹기/시켜먹기
│   │   │   ├── HouseholdFilter.tsx # 1인/2인/가족
│   │   │   ├── VibeFilter.tsx      # 상황 태그
│   │   │   ├── BudgetFilter.tsx    # 예산
│   │   │   ├── RecommendCard.tsx   # AI 추천 결과 카드
│   │   │   ├── CalendarView.tsx    # 식단 캘린더
│   │   │   └── __tests__/
│   │   ├── ads/                    # 광고 (footer만)
│   │   │   ├── FooterAd.tsx
│   │   │   └── __tests__/
│   │   ├── seo/                    # SEO 컴포넌트
│   │   │   ├── JsonLd.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── __tests__/
│   │   └── ui/                     # 공통 UI
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Toast.tsx
│   │       ├── LanguageSelector.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── Badge.tsx
│   │       └── __tests__/
│   │
│   ├── config/
│   │   ├── adsense.ts              # 에드센스 설정 (슬롯 ID)
│   │   └── site.ts                 # 사이트 메타 (이름, URL, 설명)
│   │
│   ├── data/                       # 정적 데이터
│   │   ├── chefs.ts                # 흑백요리사 1·2 Top 10 셰프 & 대표 메뉴
│   │   ├── seoKeywords.ts          # 프로그래매틱 SEO 키워드 DB (30+)
│   │   ├── filterKeywords.ts       # 필터 ↔ 검색창 키워드 매핑 (4개 언어)
│   │   └── localMenus.ts           # 폴백 추천용 메뉴 풀
│   │
│   ├── hooks/
│   │   ├── useFilters.ts           # 필터 상태 + localStorage 동기화
│   │   ├── useRecommend.ts         # 추천 API 호출 + 상태 관리
│   │   ├── useCalendar.ts          # 캘린더 localStorage 관리
│   │   └── __tests__/
│   │
│   ├── i18n/                       # next-intl 설정
│   │   ├── request.ts              # 서버 i18n 설정
│   │   └── messages/               # 번역 메시지
│   │       ├── ko.json
│   │       ├── en.json
│   │       ├── ja.json
│   │       └── zh.json
│   │
│   ├── lib/
│   │   ├── security.ts             # BLOCKED_PATTERNS, validateInput, FOOD_SIGNALS
│   │   ├── promptBuilder.ts        # buildUserPrompt() — Gemini 프롬프트 생성
│   │   ├── localRecommend.ts       # Gemini 쿼터 초과 시 폴백
│   │   ├── cn.ts                   # className 병합 (clsx + twMerge)
│   │   └── __tests__/
│   │
│   └── types/
│       ├── recommend.ts            # RecommendRequest, CookResponse, OrderResponse
│       ├── filter.ts               # FilterState, VibeType, BudgetType
│       └── seo.ts                  # SeoKeyword, PageMeta
│
├── public/
│   ├── ads.txt                     # AdSense 인증
│   └── og/                         # OpenGraph 이미지
│
├── tests/
│   ├── e2e/
│   │   ├── recommend-flow.spec.ts  # 추천 전체 흐름
│   │   ├── seo-pages.spec.ts       # SEO 페이지 검증
│   │   ├── security.spec.ts        # 보안 E2E
│   │   └── ads.spec.ts             # 광고 배치 검증
│   └── fixtures/
│       ├── geminiResponse.json
│       └── seoKeywords.json
│
└── [Config Files]
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── vitest.config.ts
    ├── playwright.config.ts
    ├── eslint.config.mjs
    ├── next-sitemap.config.js
    ├── .env.example
    ├── .env.local                  # git 무시
    ├── .gitignore
    └── CLAUDE.md
```

## Naming Conventions

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `FilterChip.tsx`, `RecommendCard.tsx` |
| 훅 | camelCase, `use` 접두사 | `useFilters.ts`, `useRecommend.ts` |
| 유틸리티/라이브러리 | camelCase | `security.ts`, `promptBuilder.ts` |
| 데이터 | camelCase | `chefs.ts`, `seoKeywords.ts` |
| 타입 정의 | camelCase | `recommend.ts`, `filter.ts` |
| 테스트 파일 | `[원본].test.tsx` | `FilterChip.test.tsx` |
| E2E 테스트 | kebab-case, `.spec.ts` | `recommend-flow.spec.ts` |
| 디렉토리 | kebab-case | `src/components/food/` |
| i18n 메시지 | 로케일 코드 | `ko.json`, `en.json` |

## Import Alias

```json
// tsconfig.json paths
{
  "@/*": ["./src/*"]
}
```

- `@/` 절대 경로 사용
- 예: `@/components/food/FilterChip`, `@/lib/security`, `@/data/chefs`

## 새 파일 추가 시 규칙

1. **추천 UI 컴포넌트**: `src/components/food/`에 배치
2. **데이터**: `src/data/`에 배치 (정적 데이터만)
3. **훅**: `src/hooks/`에 배치
4. **보안/유틸**: `src/lib/`에 배치
5. **타입**: `src/types/`에 도메인별 파일로 분리
6. **번역**: `src/i18n/messages/`에 4개 언어 파일 동시 업데이트
7. **새 SEO 키워드**: `src/data/seoKeywords.ts`에 추가
8. **테스트**: 같은 위치의 `__tests__/` 디렉토리에 배치

## .gitignore 필수 항목

```gitignore
node_modules/
.next/
out/
.env.local
.env.production.local
coverage/
test-results/
playwright-report/
.vscode/
.idea/
.DS_Store
Thumbs.db
```
