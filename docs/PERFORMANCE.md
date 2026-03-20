# Performance Optimization Guide

> `/performance-check` 스킬이 측정 결과를 이 문서에 업데이트합니다.

## Core Web Vitals Targets

| 지표 | 목표 | 측정 기준 |
|------|------|----------|
| **LCP** | < 2.5s | 추천 UI 또는 SEO 페이지 본문 렌더링 완료 |
| **INP** | < 200ms | 필터 칩 클릭 → UI 반영, 추천받기 클릭 → 로딩 시작 |
| **CLS** | < 0.1 | Footer 광고 로딩 시 레이아웃 이동 없음 |

## Font Optimization

```typescript
// src/app/layout.tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',     // FOIT 방지
  preload: true,
});
```

- `next/font` 사용 (자동 self-hosting, zero CLS)
- 한국어 메인 → `Noto Sans KR`, 영문 보조 → `Inter` 또는 Noto 내장
- `display: 'swap'`으로 FOIT 방지

## Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/og/rainy-day.webp"
  alt="비오는날 음식 추천"
  width={1200}
  height={630}
  loading="lazy"
  priority  // LCP 후보인 경우
/>
```

- WebP 우선 (Next.js 자동 변환)
- `width`, `height` 필수 지정 (CLS 방지)
- SEO 페이지 OG 이미지: 1200x630

## Bundle Optimization

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

// 캘린더는 접기/펼치기로 숨겨져 있으므로 dynamic import
const CalendarView = dynamic(() => import('@/components/food/CalendarView'), {
  loading: () => <div className="h-48 bg-neutral-100 rounded-xl animate-pulse" />,
});

// Footer 광고도 below-fold이므로 dynamic import
const FooterAd = dynamic(() => import('@/components/ads/FooterAd'));
```

### Performance Budget

| 항목 | 제한 |
|------|------|
| 초기 JS 번들 | < 100KB (gzipped) |
| 페이지당 총 JS | < 250KB (gzipped) |
| 총 페이지 크기 | < 800KB (광고 제외) |
| 이미지 크기 | 개별 < 100KB |
| 웹폰트 | < 80KB (한글 서브셋) |

## Ad-specific Performance

### Footer 광고 로딩

```typescript
// AdSense 스크립트: afterInteractive (메인 콘텐츠 렌더링 후)
// FooterAd: 고정 minHeight으로 CLS 방지
<div style={{ minHeight: '100px' }}>
  <ins className="adsbygoogle" ... />
</div>
```

- ✅ `strategy="afterInteractive"` — LCP 영향 없음
- ✅ Footer 위치 — above-the-fold에 광고 없으므로 LCP/CLS 무관
- ❌ `strategy="beforeInteractive"` — 절대 사용 금지

### 광고가 footer에만 있는 이점
- LCP에 광고 로딩이 영향을 주지 않음
- CLS 리스크 최소화 (페이지 최하단)
- INP에 광고 렌더링이 간섭하지 않음

## Gemini API 응답 시간

| 시나리오 | 예상 응답 | 대응 |
|----------|----------|------|
| 일반 요청 | 1-3초 | 로딩 스피너 표시 |
| 긴 프롬프트 | 3-5초 | 로딩 스피너 + "추천 중..." 메시지 |
| 쿼터 초과 | 즉시 | localRecommend() 폴백 (< 100ms) |
| API 에러 | 타임아웃 10초 | 에러 토스트 + 재시도 버튼 |

### 추천 UX 최적화
- 추천 버튼 클릭 즉시 로딩 상태 표시 (INP 최적화)
- Gemini 응답 스트리밍은 사용하지 않음 (JSON 파싱 필요)
- 결과 표시 시 `requestAnimationFrame`으로 부드러운 전환

## ISR Strategy

```typescript
// /[lang]/eat/menu/[slug]/page.tsx
export const revalidate = 604800; // 7일
```

| Route | Strategy | Revalidation | 이유 |
|-------|----------|-------------|------|
| `/[lang]` | SSR | 없음 | 실시간 AI 추천 |
| `/[lang]/eat/menu/[slug]` | ISR | 7일 | SEO 페이지, AI 결과 캐싱 |

## Measurement Results

_`/performance-check` 스킬 실행 결과가 여기에 기록됩니다._

| 날짜 | 페이지 | LCP | INP | CLS | 점수 | 비고 |
|------|--------|-----|-----|-----|------|------|
| — | — | — | — | — | — | — |
