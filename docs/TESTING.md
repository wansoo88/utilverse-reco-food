# Testing Guide

> 개발 품질을 높이기 위한 Phase별 테스트 전략입니다.

## Test Stack

| 도구 | 용도 | 설정 파일 |
|------|------|----------|
| **Vitest** | 단위 테스트, 컴포넌트 테스트 | `vitest.config.ts` |
| **Testing Library** | React 컴포넌트 테스트 | `@testing-library/react` |
| **Playwright** | E2E 테스트 | `playwright.config.ts` |
| **TypeScript** | 타입 검사 | `tsconfig.json` |
| **ESLint** | 코드 품질 | `eslint.config.mjs` |

## Test Commands

```bash
pnpm test              # Vitest 단위 테스트 실행
pnpm test:watch        # Vitest watch 모드
pnpm test:coverage     # 커버리지 리포트 생성
pnpm test:e2e          # Playwright E2E 테스트
pnpm test:e2e:ui       # Playwright UI 모드
pnpm lint              # ESLint 검사
pnpm type-check        # TypeScript 타입 검사 (tsc --noEmit)
pnpm test:all          # 전체 테스트 (lint + type-check + test + e2e)
```

## Phase별 테스트 전략

### Phase 1: 프로젝트 셋업 & 에드센스 통합

| 테스트 대상 | 유형 | 검증 항목 |
|------------|------|----------|
| AdUnit 컴포넌트 | Unit | props 렌더링, minHeight 적용, slotId 전달 |
| useAdSlot 훅 | Unit | IntersectionObserver 동작, 로딩 상태 |
| AdSense 스크립트 로더 | Unit | afterInteractive 전략 확인 |
| AdLayout | Component | 반응형 광고 배치 (모바일/데스크톱) |
| ads.txt | E2E | `/ads.txt` 접근 가능 + 올바른 내용 |

```typescript
// 예시: AdUnit 단위 테스트
describe('AdUnit', () => {
  it('minHeight가 적용되어 CLS를 방지한다', () => {
    render(<AdUnit slotId="test-slot" minHeight={250} />);
    const container = screen.getByRole('complementary');
    expect(container).toHaveStyle({ minHeight: '250px' });
  });

  it('에러/404 페이지에서 import되지 않는다', () => {
    // not-found.tsx, error.tsx에서 ads/ import 없음을 확인
  });
});
```

### Phase 2: 핵심 도구 개발

| 테스트 대상 | 유형 | 검증 항목 |
|------------|------|----------|
| ToolLayout | Component | 입력 → 결과 → 광고 순서 렌더링 |
| 개별 도구 로직 | Unit | 입력값 → 올바른 결과 변환 |
| ToolInput | Component | 폼 검증, 에러 상태 표시 |
| ToolResult | Component | 결과 표시, 복사 기능 |
| 도구 페이지 | E2E | 전체 흐름 (입력 → 실행 → 결과 → 복사) |
| 도구 목록 | E2E | 카테고리 필터, 도구 카드 클릭 네비게이션 |

```typescript
// 예시: 도구 로직 단위 테스트
describe('JsonFormatter', () => {
  it('유효한 JSON을 포맷팅한다', () => {
    const result = formatJson('{"a":1}');
    expect(result).toBe('{\n  "a": 1\n}');
  });

  it('잘못된 JSON에 에러 메시지를 반환한다', () => {
    const result = formatJson('{invalid}');
    expect(result.error).toBeDefined();
  });
});
```

### Phase 3: SEO & 성능 최적화

| 테스트 대상 | 유형 | 검증 항목 |
|------------|------|----------|
| MetaTags | Unit | title, description 길이 검증 |
| JsonLd | Unit | 구조화 데이터 스키마 검증 |
| sitemap.xml | E2E | 모든 도구 페이지 포함 확인 |
| robots.txt | E2E | 올바른 규칙 적용 |
| 이미지 | Unit | next/image 사용, alt 텍스트 존재 |
| 성능 예산 | E2E | 번들 크기 제한 초과 여부 |

```typescript
// 예시: SEO 메타 테스트
describe('MetaTags', () => {
  it('title이 50-60자 이내이다', () => {
    const { title } = getToolMeta('json-formatter');
    expect(title.length).toBeGreaterThanOrEqual(20);
    expect(title.length).toBeLessThanOrEqual(60);
  });
});
```

### Phase 4: 배포 & 모니터링

| 테스트 대상 | 유형 | 검증 항목 |
|------------|------|----------|
| 프로덕션 빌드 | Integration | `pnpm build` 성공 |
| 환경변수 | Integration | 필수 환경변수 존재 확인 |
| CSP 헤더 | E2E | AdSense 도메인 허용 확인 |
| 접근성 | E2E | axe-core 검증 통과 |

## Test File Convention

```
src/
├── components/
│   ├── ads/
│   │   ├── AdUnit.tsx
│   │   └── __tests__/
│   │       └── AdUnit.test.tsx         # 단위 테스트
│   └── tools/
│       ├── JsonFormatter.tsx
│       └── __tests__/
│           └── JsonFormatter.test.tsx
├── hooks/
│   ├── useAdSlot.ts
│   └── __tests__/
│       └── useAdSlot.test.ts
└── lib/
    ├── formatJson.ts
    └── __tests__/
        └── formatJson.test.ts

tests/
├── e2e/
│   ├── tool-page.spec.ts              # 도구 페이지 E2E
│   ├── tool-list.spec.ts              # 도구 목록 E2E
│   ├── seo.spec.ts                    # SEO 요소 E2E
│   └── ads.spec.ts                    # 광고 배치 E2E
└── fixtures/
    └── tools.json                     # 테스트 데이터
```

## Coverage Targets

| 영역 | 최소 커버리지 | 비고 |
|------|-------------|------|
| 도구 비즈니스 로직 (`src/lib/`) | 90% | 핵심 변환/계산 로직 |
| 광고 컴포넌트 (`src/components/ads/`) | 80% | CLS 방지, 정책 준수 |
| 도구 컴포넌트 (`src/components/tools/`) | 80% | 입력/결과 렌더링 |
| 훅 (`src/hooks/`) | 85% | 상태 관리 로직 |
| 전체 | 75% | |

## CI Pipeline (향후)

```
pnpm lint → pnpm type-check → pnpm test → pnpm build → pnpm test:e2e
```

모든 단계가 통과해야 머지/배포 가능.
