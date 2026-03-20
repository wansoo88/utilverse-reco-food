# File & Folder Structure Rules

> 프로젝트 파일과 설정 파일의 체계적인 폴더링 규칙입니다.

## Directory Structure (전체)

```
/
├── .claude/                        # Claude Code 설정 (스킬, 훅)
│   ├── settings.json
│   ├── hooks/
│   └── skills/
│
├── docs/                           # 프로젝트 문서 (Claude 참조용)
│   ├── PLAN.md
│   ├── ARCHITECTURE.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   ├── DESIGN.md
│   ├── ADSENSE.md
│   ├── SEO.md
│   ├── PERFORMANCE.md
│   ├── TESTING.md
│   ├── HANDOFF.md
│   ├── FILE-STRUCTURE.md
│   └── CHANGELOG.md
│
├── src/                            # 소스 코드 (Next.js App Router)
│   ├── app/                        # Pages & Routes
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home
│   │   ├── not-found.tsx           # 404 (광고 없음)
│   │   ├── error.tsx               # Error (광고 없음)
│   │   ├── globals.css             # 글로벌 CSS
│   │   ├── sitemap.ts              # 동적 사이트맵 생성
│   │   ├── robots.ts               # robots.txt 생성
│   │   ├── tools/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── categories/
│   │   │   └── [category]/
│   │   │       └── page.tsx
│   │   └── api/                    # Route Handlers
│   │       └── revalidate/
│   │           └── route.ts
│   │
│   ├── components/                 # React 컴포넌트
│   │   ├── ads/                    # 광고 전용 컴포넌트
│   │   │   ├── AdUnit.tsx
│   │   │   ├── HeaderAd.tsx
│   │   │   ├── InContentAd.tsx
│   │   │   ├── SidebarAd.tsx
│   │   │   ├── MultiplexAd.tsx
│   │   │   └── __tests__/
│   │   ├── tools/                  # 도구 공통 컴포넌트
│   │   │   ├── ToolLayout.tsx
│   │   │   ├── ToolInput.tsx
│   │   │   ├── ToolResult.tsx
│   │   │   ├── ToolCard.tsx
│   │   │   ├── ToolGrid.tsx
│   │   │   └── __tests__/
│   │   ├── seo/                    # SEO 컴포넌트
│   │   │   ├── JsonLd.tsx
│   │   │   ├── MetaTags.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   └── __tests__/
│   │   └── ui/                     # 공통 UI 컴포넌트
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       ├── Toast.tsx
│   │       └── __tests__/
│   │
│   ├── config/                     # 설정 파일 (런타임)
│   │   ├── adsense.ts              # 에드센스 퍼블리셔 ID, 슬롯 매핑
│   │   └── site.ts                 # 사이트 메타 정보 (이름, URL, 설명)
│   │
│   ├── data/                       # 정적 데이터
│   │   ├── tools.ts                # 도구 목록 & 메타데이터
│   │   └── categories.ts           # 카테고리 목록
│   │
│   ├── hooks/                      # Custom Hooks
│   │   ├── useAdSlot.ts
│   │   ├── useIntersectionObserver.ts
│   │   ├── useCopyToClipboard.ts
│   │   └── __tests__/
│   │
│   ├── layouts/                    # 레이아웃 컴포넌트
│   │   └── AdLayout.tsx
│   │
│   ├── lib/                        # 유틸리티 & 헬퍼 함수
│   │   ├── utils.ts                # 공통 유틸리티
│   │   ├── cn.ts                   # className 병합 (clsx + twMerge)
│   │   └── __tests__/
│   │
│   └── types/                      # TypeScript 타입 정의
│       ├── adsense.ts              # 광고 관련 타입
│       ├── tool.ts                 # 도구 관련 타입
│       └── seo.ts                  # SEO 관련 타입
│
├── content/                        # MDX 콘텐츠 (도구 설명)
│   └── tools/
│       └── [slug].mdx
│
├── public/                         # 정적 파일
│   ├── ads.txt                     # AdSense ads.txt
│   ├── icons/                      # 도구 아이콘
│   └── og/                         # OpenGraph 이미지
│
├── tests/                          # E2E & 통합 테스트
│   ├── e2e/
│   │   ├── tool-page.spec.ts
│   │   ├── tool-list.spec.ts
│   │   ├── seo.spec.ts
│   │   └── ads.spec.ts
│   └── fixtures/
│       └── tools.json
│
└── [Config Files]                  # 루트 설정 파일 (아래 참조)
```

## Config Files 폴더링 규칙

### 루트에 위치하는 설정 파일 (변경 불가)

프레임워크/도구가 루트에 요구하는 파일들:

```
/
├── package.json                    # 의존성 & 스크립트
├── pnpm-lock.yaml                  # Lock file (자동 생성)
├── tsconfig.json                   # TypeScript 설정
├── next.config.ts                  # Next.js 설정
├── tailwind.config.ts              # Tailwind CSS 설정
├── postcss.config.mjs              # PostCSS 설정
├── vitest.config.ts                # Vitest 설정
├── playwright.config.ts            # Playwright 설정
├── eslint.config.mjs               # ESLint 설정
├── .env.example                    # 환경변수 템플릿
├── .env.local                      # 로컬 환경변수 (git 무시)
├── .gitignore                      # Git 무시 파일
└── CLAUDE.md                       # Claude Code 지침
```

### 설정 파일 작성 규칙

1. **설정 파일 포맷**: `.ts` 우선 (타입 안전성), 불가능하면 `.mjs`
2. **환경변수**: `.env.example`에 템플릿, `.env.local`에 실제 값
3. **`.env.local`은 절대 커밋하지 않음** — `.gitignore`에 포함
4. **Lock 파일**: `pnpm-lock.yaml`은 항상 커밋 (재현 가능한 빌드)

## Naming Conventions

### Files & Directories

| 대상 | 규칙 | 예시 |
|------|------|------|
| React 컴포넌트 | PascalCase | `AdUnit.tsx`, `ToolLayout.tsx` |
| 훅 | camelCase, `use` 접두사 | `useAdSlot.ts` |
| 유틸리티/라이브러리 | camelCase | `utils.ts`, `cn.ts` |
| 타입 정의 | camelCase | `adsense.ts`, `tool.ts` |
| 설정 파일 | camelCase/kebab-case | `adsense.ts`, `site.ts` |
| 테스트 파일 | `[원본].test.tsx` | `AdUnit.test.tsx` |
| E2E 테스트 | kebab-case, `.spec.ts` | `tool-page.spec.ts` |
| 디렉토리 | kebab-case | `src/components/ads/` |
| 라우트 (Next.js) | kebab-case | `tools/[slug]/page.tsx` |

### 컴포넌트 구조 (파일 내부)

```typescript
// 1. Imports (외부 → 내부 순서)
import { useState } from 'react';          // React
import { cn } from '@/lib/cn';             // 내부 유틸
import type { ToolProps } from '@/types';   // 타입

// 2. Type definitions
interface Props { ... }

// 3. Component
export function ComponentName({ ... }: Props) { ... }

// 4. Sub-components (있으면)
function SubComponent() { ... }
```

## Import Alias

```json
// tsconfig.json paths
{
  "@/*": ["./src/*"],
  "@/components/*": ["./src/components/*"],
  "@/config/*": ["./src/config/*"],
  "@/hooks/*": ["./src/hooks/*"],
  "@/lib/*": ["./src/lib/*"],
  "@/types/*": ["./src/types/*"]
}
```

- `@/` 절대 경로 사용 (상대 경로 `../../` 지양)
- 깊은 중첩 import 금지: `@/components/ads/AdUnit` 직접 사용

## .gitignore 필수 항목

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/

# Environment
.env.local
.env.production.local

# Testing
coverage/
test-results/
playwright-report/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## 새 파일 추가 시 규칙

1. **컴포넌트**: `src/components/[카테고리]/`에 배치, 같은 위치에 `__tests__/` 생성
2. **훅**: `src/hooks/`에 배치
3. **유틸리티**: `src/lib/`에 배치 (파일이 커지면 분리)
4. **타입**: `src/types/`에 도메인별 파일로 분리
5. **도구 데이터**: `src/data/`에 배치
6. **새 도구**: `src/app/tools/[slug]/page.tsx` + `content/tools/[slug].mdx`
7. **E2E 테스트**: `tests/e2e/`에 배치
8. **설정 추가**: `src/config/`에 배치 (루트 설정 파일과 혼동 금지)
