# Performance Optimization Guide

> `/performance-check` 스킬이 측정 결과를 이 문서에 업데이트합니다.

## Core Web Vitals Targets

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 도구 UI가 렌더링 완료되는 시점 |
| **INP** (Interaction to Next Paint) | < 200ms | 도구 실행 버튼 클릭 → 결과 표시 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 광고 로딩 시 레이아웃 이동 없음 |

## Image Optimization

```typescript
// 항상 next/image 사용
import Image from 'next/image';

<Image
  src="/icons/tool-icon.webp"
  alt="도구 아이콘 설명"
  width={64}
  height={64}
  loading="lazy"          // below-fold 이미지
  priority               // above-fold 이미지 (LCP 후보)
/>
```

- **포맷**: WebP 우선, AVIF 지원 시 자동 변환 (Next.js 기본)
- **크기**: `width`, `height` 필수 지정 (CLS 방지)
- **로딩**: above-fold → `priority`, below-fold → `loading="lazy"`
- **도구 아이콘**: 64x64 또는 48x48, SVG 권장

## Font Optimization

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',        // FOIT 방지
  preload: true,
});
```

- `next/font` 사용 (자동 self-hosting, zero layout shift)
- `display: 'swap'`으로 FOIT 방지
- 한글 폰트 필요 시 `Noto Sans KR` 서브셋 로드

## Bundle Optimization

### Code Splitting

```typescript
// 도구 컴포넌트는 dynamic import로 분리
import dynamic from 'next/dynamic';

const JsonFormatter = dynamic(() => import('@/components/tools/JsonFormatter'), {
  loading: () => <ToolSkeleton />,
});
```

- 각 도구 컴포넌트를 `dynamic import`로 분리
- below-fold 광고 컴포넌트도 `dynamic import`
- 도구별 독립 번들로 초기 로딩 최소화

### Performance Budget

| 항목 | 제한 |
|------|------|
| 초기 JS 번들 | < 100KB (gzipped) |
| 페이지당 총 JS | < 300KB (gzipped) |
| 총 페이지 크기 | < 1MB (광고 제외) |
| 이미지 크기 | 개별 < 100KB |
| 웹폰트 | < 50KB |

## Ad-specific Performance

### 광고 스크립트 로딩
- ✅ `strategy="afterInteractive"` — 페이지 콘텐츠 렌더링 후 로드
- ❌ `strategy="beforeInteractive"` — 절대 사용 금지 (LCP 악화)
- ❌ 동기 로드 — 절대 사용 금지

### CLS Prevention for Ads

```typescript
// 모든 광고 슬롯에 최소 높이 예약
<div
  className="bg-ad-bg border border-ad-border rounded-lg"
  style={{ minHeight: '250px', minWidth: '300px' }}  // 광고 크기에 맞는 고정 치수
>
  <AdUnit slotId={slotId} />
</div>
```

### Below-fold Ad Lazy Loading

```typescript
// useAdSlot.ts — IntersectionObserver로 뷰포트 진입 시에만 광고 로드
const { ref, isInView } = useIntersectionObserver({ threshold: 0.1 });

return (
  <div ref={ref} style={{ minHeight: 250 }}>
    {isInView && <AdUnit slotId={slotId} />}
  </div>
);
```

## ISR Strategy

```typescript
// src/app/tools/[slug]/page.tsx
export const revalidate = 86400; // 24시간
```

- 도구 페이지: 24시간 (도구 로직은 변경 빈도 낮음)
- 목록/카테고리: 1시간 (새 도구 추가 반영)
- 정적 페이지: 빌드 시 (About 등)

## Measurement Results

_`/performance-check` 스킬 실행 결과가 여기에 기록됩니다._

| 날짜 | 페이지 | LCP | INP | CLS | 점수 | 비고 |
|------|--------|-----|-----|-----|------|------|
| — | — | — | — | — | — | — |
