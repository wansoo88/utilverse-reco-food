# System Architecture

> 모든 스킬이 구조적 결정 시 이 문서를 참조합니다.

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │ GA4      │  │ AdSense  │  │ Next.js App            │ │
│  │ Script   │  │ Script   │  │ (React 18 + App Router)│ │
│  └──────────┘  └──────────┘  └────────────────────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Vercel Edge Network                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ CDN      │  │ Edge     │  │ ISR Cache             │  │
│  │ Cache    │  │ Functions│  │ (Revalidation)        │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Next.js Server                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ App Router   │  │ Route        │  │ Middleware     │ │
│  │ (SSR/ISR)    │  │ Handlers     │  │ (Redirects)   │ │
│  └──────────────┘  └──────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Routing Structure

```
/                           → 홈 (인기 도구 + 카테고리 목록)
/tools/[slug]               → 개별 도구 페이지 (ISR)
/categories/[category]      → 카테고리별 도구 목록 (ISR)
/about                      → 소개 페이지 (SSG)
/sitemap.xml                → 자동 생성 사이트맵
/robots.txt                 → 크롤러 설정
```

## Rendering Strategy

| Route | Strategy | Revalidation | 이유 |
|-------|----------|-------------|------|
| `/` | ISR | 1시간 | 인기 도구 목록 캐싱, 적당한 갱신 |
| `/tools/[slug]` | ISR | 24시간 | 도구 자체는 변경 빈도 낮음 |
| `/categories/[category]` | ISR | 1시간 | 새 도구 추가 반영 |
| `/about` | SSG | 빌드 시 | 거의 변경 없음 |

## Component Hierarchy

```
RootLayout (AdSense script loader + GA4)
├── AdLayout (광고 슬롯 포지셔닝)
│   ├── HeaderAd (리더보드 728x90 / 모바일 320x100)
│   ├── Main Content
│   │   ├── ToolLayout (도구 전용 레이아웃)
│   │   │   ├── ToolInput (입력 폼)
│   │   │   ├── ToolResult (결과 출력)
│   │   │   └── InContentAd (결과 하단 광고)
│   │   └── Page Content
│   ├── SidebarAd (300x250 sticky, 데스크톱 전용)
│   └── FooterAd (하단 광고)
└── Footer
```

## Ad Loading Flow

```
1. 페이지 로드 → RootLayout에서 AdSense 스크립트 로드 (afterInteractive)
2. AdLayout 렌더링 → 각 광고 슬롯에 고정 치수의 placeholder 표시
3. useAdSlot hook → IntersectionObserver로 광고 슬롯이 뷰포트 진입 감지
4. 뷰포트 진입 시 → googletag.cmd.push()로 광고 요청
5. 광고 로드 완료 → placeholder를 광고로 교체 (치수 고정으로 CLS 없음)
```

## External Services

| 서비스 | 용도 | 연동 방식 |
|--------|------|----------|
| Google AdSense | 광고 수익화 | Script tag + AdUnit 컴포넌트 |
| Google Analytics 4 | 트래픽 분석 | next/script |
| Google Search Console | SEO 모니터링 | sitemap 제출, 도메인 인증 |

## Key Directories

자세한 디렉토리 구조는 [CLAUDE.md](../CLAUDE.md)의 Project Structure 섹션 참조.
