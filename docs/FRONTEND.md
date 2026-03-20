# Frontend Development Guide

> `/ad-placement`, `/design-system` 스킬이 컴포넌트 추가/수정 시 이 문서를 업데이트합니다.

## Component Architecture

### 광고 컴포넌트 (`src/components/ads/`)

모든 광고는 재사용 가능한 컴포넌트로 래핑합니다.

| 컴포넌트 | 용도 | 기본 크기 |
|----------|------|----------|
| `AdUnit` | 범용 광고 래퍼 | 설정에 따라 |
| `HeaderAd` | 페이지 상단 리더보드 | 728x90 / 320x100 (모바일) |
| `InContentAd` | 도구 결과 하단 | 336x280 반응형 |
| `SidebarAd` | 사이드바 스티키 광고 | 300x250 (데스크톱만) |
| `MultiplexAd` | 도구 목록 페이지 그리드 | 반응형 |

### 광고 컴포넌트 설계 원칙

```typescript
// 모든 광고 컴포넌트는 이 패턴을 따릅니다
interface AdUnitProps {
  slotId: string;         // adsense.ts에서 가져온 슬롯 ID
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
  minHeight: number;      // CLS 방지용 최소 높이 (필수)
}
```

- `minHeight`는 **필수** — 광고 로딩 전 공간 확보로 CLS 방지
- `useIntersectionObserver`로 뷰포트 진입 시에만 광고 로드 (Below-fold)
- `loading` 상태에서는 배경색만 있는 placeholder 표시

### 도구 컴포넌트 (`src/components/tools/`)

| 컴포넌트 | 용도 |
|----------|------|
| `ToolLayout` | 도구 페이지 공통 레이아웃 (입력 → 결과 → 광고) |
| `ToolInput` | 도구 입력 폼 래퍼 |
| `ToolResult` | 도구 결과 출력 영역 |
| `ToolCard` | 도구 목록에서 개별 도구 카드 |
| `ToolGrid` | 도구 목록 그리드 레이아웃 |

### UI 컴포넌트 (`src/components/ui/`)

| 컴포넌트 | 용도 |
|----------|------|
| `Button` | 기본 버튼 (도구 실행, 복사 등) |
| `Card` | 카드 컨테이너 |
| `Input` | 입력 필드 |
| `Select` | 드롭다운 셀렉트 |
| `Textarea` | 텍스트 영역 |
| `Toast` | 알림 토스트 (결과 복사 등) |

## Layout System

### AdLayout 구조

```
┌────────────────────────────────────────────────┐
│                  HeaderAd                       │
├──────────────────────────┬─────────────────────┤
│                          │                     │
│     Main Content         │   SidebarAd         │
│     ┌──────────────┐     │   (sticky,          │
│     │ ToolInput    │     │    데스크톱 전용)      │
│     └──────────────┘     │                     │
│     ┌──────────────┐     │                     │
│     │ ToolResult   │     │                     │
│     └──────────────┘     │                     │
│     ┌──────────────┐     │                     │
│     │ InContentAd  │     │                     │
│     └──────────────┘     │                     │
│                          │                     │
├──────────────────────────┴─────────────────────┤
│                  FooterAd                       │
└────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | 너비 | 광고 변경사항 |
|------------|------|-------------|
| `sm` | < 640px | SidebarAd 숨김, HeaderAd → 320x100 |
| `md` | 640-1024px | SidebarAd 숨김, HeaderAd → 728x90 |
| `lg` | > 1024px | 전체 레이아웃 (SidebarAd 표시) |

## State Management

- **광고 상태**: `useAdSlot` 훅으로 관리 (로딩, 에러, 뷰포트 진입)
- **도구 상태**: 각 도구 컴포넌트 내 `useState`/`useReducer`로 로컬 관리
- **글로벌 상태**: 필요 최소한으로 유지 (테마, 언어 정도)

## Accessibility

- 광고 영역에 `role="complementary"` + `aria-label="광고"` 적용
- 도구 입력/결과에 적절한 `aria-live` 설정 (결과 변경 시 스크린리더 알림)
- 키보드 네비게이션: 광고를 건너뛰는 skip link 제공

## Registered Components

_컴포넌트가 생성되면 여기에 기록됩니다._

| 컴포넌트 | 경로 | 추가일 |
|----------|------|--------|
| — | — | — |
