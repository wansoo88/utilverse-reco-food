# Design System

> `/design-system` 스킬이 이 문서를 관리합니다.

## Design Principles

1. **광고와의 조화**: 콘텐츠와 광고가 자연스럽게 공존하되 명확히 구분
2. **도구 중심 UX**: 입력 → 결과 → 다음 행동의 흐름이 직관적
3. **빠른 로딩**: 시각적 복잡성 최소화, 성능 우선

## Color Palette

### Tailwind Config

```typescript
// tailwind.config.ts colors
colors: {
  primary: {
    50:  '#eff6ff',  // 배경, 호버
    100: '#dbeafe',
    500: '#3b82f6',  // 주요 액션
    600: '#2563eb',  // 호버 액션
    700: '#1d4ed8',  // 활성 액션
  },
  neutral: {
    50:  '#fafafa',  // 페이지 배경
    100: '#f5f5f5',  // 카드 배경
    200: '#e5e5e5',  // 테두리
    500: '#737373',  // 보조 텍스트
    800: '#262626',  // 본문 텍스트
    900: '#171717',  // 제목 텍스트
  },
  ad: {
    bg:     '#f9fafb',  // 광고 영역 배경 (콘텐츠와 구분)
    border: '#e5e7eb',  // 광고 영역 테두리
    label:  '#9ca3af',  // "광고" 라벨 색상
  }
}
```

### 광고 색상 규칙
- 광고 영역 배경은 `ad.bg`로 콘텐츠와 시각적 구분
- 광고 라벨("광고" 또는 "Advertisement")은 `ad.label` 색상, 10px 이상
- 콘텐츠와 광고 사이 최소 `16px` 간격

## Typography

```typescript
// next/font 사용
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

| 요소 | 크기 | 굵기 | 행간 |
|------|------|------|------|
| H1 (페이지 제목) | `text-3xl` (30px) | `font-bold` | `leading-tight` |
| H2 (섹션 제목) | `text-2xl` (24px) | `font-semibold` | `leading-snug` |
| H3 (소제목) | `text-xl` (20px) | `font-semibold` | `leading-snug` |
| Body | `text-base` (16px) | `font-normal` | `leading-relaxed` |
| Small / 라벨 | `text-sm` (14px) | `font-medium` | `leading-normal` |
| 광고 라벨 | `text-xs` (12px) | `font-normal` | `leading-normal` |

## Spacing

| 용도 | 크기 | Tailwind |
|------|------|----------|
| 컴포넌트 내부 패딩 | 16px | `p-4` |
| 카드 간격 | 16px | `gap-4` |
| 섹션 간격 | 32px | `space-y-8` |
| 광고-콘텐츠 간격 | 16px 이상 | `my-4` 이상 |
| 광고 영역 내부 패딩 | 8px | `p-2` |

## Component Styles

### Button

```
기본:     bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600
보조:     bg-neutral-100 text-neutral-800 px-4 py-2 rounded-lg hover:bg-neutral-200
위험:     bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600
비활성:   bg-neutral-200 text-neutral-400 px-4 py-2 rounded-lg cursor-not-allowed
```

### Card

```
기본:     bg-white border border-neutral-200 rounded-xl p-4 shadow-sm
도구카드: bg-white border border-neutral-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow
```

### Input

```
기본:     border border-neutral-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent
```

### Ad Container

```
기본:     bg-ad-bg border border-ad-border rounded-lg p-2
라벨:     text-ad-label text-xs mb-1 text-center
```

## Dark Mode

다크모드 지원 시 광고 영역 처리:

```
라이트: bg-ad-bg (밝은 회색)
다크:   bg-neutral-800 (어두운 회색) — 광고 배경과 조화
```

- 광고 자체의 색상은 제어할 수 없으므로, 광고 컨테이너 배경을 중립적으로 유지
- 라벨 색상도 다크모드에 맞게 조정 (`dark:text-neutral-400`)

## Design Tokens (추가 예정)

_새로운 디자인 토큰이 추가되면 여기에 기록됩니다._
