# Design System

> `/design-system` 스킬이 이 문서를 관리합니다.

## Design Principles

1. **음식 추천에 집중**: 필터 → 추천 → 저장의 흐름이 직관적
2. **깔끔한 인상**: 광고를 footer에만 배치하여 콘텐츠 중심 UX 유지
3. **트렌드 강조**: 흑백요리사 등 트렌드 콘텐츠를 시각적으로 차별화 (보라색)
4. **모바일 퍼스트**: 음식 추천은 모바일 사용이 많으므로 모바일 UX 우선

## Color Palette

### Tailwind Config

```typescript
// tailwind.config.ts colors
colors: {
  primary: {
    50:  '#eff6ff',  // 배경, 호버
    100: '#dbeafe',
    500: '#3b82f6',  // 주요 액션 (추천받기 버튼)
    600: '#2563eb',  // 호버
    700: '#1d4ed8',  // 활성
  },
  neutral: {
    50:  '#fafafa',  // 페이지 배경
    100: '#f5f5f5',  // 카드 배경
    200: '#e5e5e5',  // 테두리, 일반 필터 칩 미선택
    500: '#737373',  // 보조 텍스트
    800: '#262626',  // 본문
    900: '#171717',  // 제목
  },
  // 흑백요리사 전용 보라색
  chef: {
    50:  '#f5f3ff',  // 흑백요리사 칩 미선택 배경
    100: '#ede9fe',
    300: '#c4b5fd',  // 흑백요리사 칩 미선택 테두리 (점선)
    500: '#8b5cf6',
    600: '#7c3aed',  // 흑백요리사 칩 선택 배경
    700: '#6d28d9',
  },
  // 상태 색상
  success: '#22c55e',    // 저장 완료, 필터 복원
  danger:  '#ef4444',    // 보안 차단 토스트
  info:    '#3b82f6',    // 정보 토스트
  // 광고 영역 (footer만)
  ad: {
    bg:     '#f9fafb',
    border: '#e5e7eb',
    label:  '#9ca3af',
  }
}
```

### 필터 칩 색상 체계

| 필터 그룹 | 미선택 배경 | 선택 배경 | 비고 |
|-----------|-----------|----------|------|
| 일반 (해먹기, 1인 등) | `neutral-100` | `primary-500` (흰 글자) | 기본 스타일 |
| 흑백요리사 | `chef-50` + 보라 점선 | `chef-600` (흰 글자) + 글로우 | 시각적 차별화 |
| 단짠단짠 | `neutral-100` | `amber-500` (흰 글자) | 따뜻한 느낌 |

## Typography

```typescript
// next/font — 한국어 + 영어 혼합
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
// 또는 Noto Sans KR 서브셋
```

| 요소 | 크기 | 굵기 | 용도 |
|------|------|------|------|
| H1 | `text-3xl` (30px) | `font-bold` | 페이지 제목 "오늘 뭐 먹지?" |
| H2 | `text-2xl` (24px) | `font-semibold` | 섹션 (필터, 추천 결과) |
| H3 | `text-xl` (20px) | `font-semibold` | 소제목 |
| Body | `text-base` (16px) | `font-normal` | 본문, 추천 이유 |
| Small | `text-sm` (14px) | `font-medium` | 필터 칩 텍스트, 라벨 |
| 광고 라벨 | `text-xs` (12px) | `font-normal` | "광고" |

## Spacing

| 용도 | 크기 | Tailwind |
|------|------|----------|
| 필터 칩 내부 패딩 | 8px 16px | `px-4 py-2` |
| 필터 칩 간격 | 8px | `gap-2` |
| 필터 그룹 간격 | 16px | `space-y-4` |
| 카드 내부 패딩 | 20px | `p-5` |
| 섹션 간격 | 32px | `space-y-8` |
| Footer 광고 상단 마진 | 48px | `mt-12` |

## Component Styles

### 필터 칩 (FilterChip)

```
일반 미선택:  bg-neutral-100 text-neutral-800 px-4 py-2 rounded-full border border-neutral-200
일반 선택:    bg-primary-500 text-white px-4 py-2 rounded-full shadow-sm
흑백요리사:   bg-chef-50 text-chef-700 px-4 py-2 rounded-full border-2 border-dashed border-chef-300
흑백 선택:    bg-chef-600 text-white px-4 py-2 rounded-full shadow-[0_0_12px_rgba(124,58,237,0.4)]
```

### 추천 카드 (RecommendCard)

```
컨테이너:    bg-white rounded-2xl p-6 shadow-lg border border-neutral-100
메뉴명:      text-2xl font-bold text-neutral-900
카테고리:    text-sm text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded
추천이유:    text-base text-neutral-700 italic
대안 카드:   bg-neutral-50 rounded-xl p-4 border border-neutral-200
```

### 흑백요리사 배너 (HeroBanner)

```
배경:        bg-gradient-to-r from-chef-600 to-chef-500
텍스트:      text-white
아이콘:      🏆 이모지
CTA:         bg-white text-chef-700 rounded-full px-6 py-2 shadow-md hover:shadow-lg
```

### 메인 CTA 버튼

```
기본:        bg-primary-500 text-white text-lg font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-primary-600 hover:shadow-lg transition-all
비활성:      bg-neutral-200 text-neutral-400 cursor-not-allowed
```

### Footer 광고 영역

```
컨테이너:    bg-ad-bg border-t border-ad-border py-4
라벨:        text-ad-label text-xs text-center mb-2
```

### Toast

```
성공:  bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 shadow-md
차단:  bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 shadow-md
정보:  bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 shadow-md
위치:  fixed bottom-4 right-4 z-50 (모바일: bottom-4 inset-x-4)
```

## 모바일 디자인 특이사항

- 필터 칩: 가로 스크롤 가능 (`overflow-x-auto`)
- 추천 카드: 전체 너비, 대안은 가로 스크롤 카드
- 캘린더: 기본 주간 뷰, 탭으로 월간 전환
- 흑백요리사 배너: 높이 축소, 핵심 텍스트만
- CTA 버튼: 하단 고정 (sticky) 고려
