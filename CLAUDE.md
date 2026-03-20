# AdSense Monetized Utility Web App

## Project Overview

에드센스 수익을 극대화하는 온라인 도구/유틸리티 웹앱 프로젝트입니다.
계산기, 변환기, 생성기 등 다양한 유틸리티를 제공하며, 사용자가 도구를 사용하는 동안 자연스럽게 광고에 노출되는 구조를 목표로 합니다.

**수익의 3대 축**: 트래픽 볼륨 (SEO) · 페이지 속도 (Core Web Vitals) · 광고 가시성 (Viewability)

## Tech Stack

- **Framework**: Next.js 14+ (App Router) — SSR/ISR로 SEO 극대화
- **Styling**: Tailwind CSS — 빠른 렌더링, 레이아웃 시프트 최소화
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Analytics**: Google Analytics 4 + AdSense Reporting
- **Hosting**: Vercel (Edge optimized)

## 문서 언어 규칙

- 코드, 변수명, 컴포넌트명, 파일명: **영어**
- 설명, 가이드, 주석, 커밋 메시지: **한국어**

## 문서 체계 (docs/)

각 MD 파일은 Claude가 작업 시 참조하고, 관련 스킬이 자동으로 업데이트합니다.

| 문서 | 역할 | 관련 스킬 |
|------|------|----------|
| [docs/PLAN.md](docs/PLAN.md) | 프로젝트 로드맵 & 태스크 추적 | `/plan-update` |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 시스템 아키텍처 & 구조 | 모든 스킬 참조 |
| [docs/BACKEND.md](docs/BACKEND.md) | API, 데이터, 캐싱 가이드 | `/adsense-setup` |
| [docs/FRONTEND.md](docs/FRONTEND.md) | 컴포넌트 & UI 개발 가이드 | `/ad-placement`, `/design-system` |
| [docs/DESIGN.md](docs/DESIGN.md) | 디자인 시스템 & 스타일 가이드 | `/design-system` |
| [docs/ADSENSE.md](docs/ADSENSE.md) | 에드센스 전략 & 정책 | `/adsense-setup`, `/ad-placement`, `/monetization-report` |
| [docs/SEO.md](docs/SEO.md) | SEO 최적화 규칙 | `/seo-audit` |
| [docs/PERFORMANCE.md](docs/PERFORMANCE.md) | 성능 최적화 & 예산 | `/performance-check` |
| [docs/TESTING.md](docs/TESTING.md) | Phase별 테스트 전략 & 가이드 | 모든 개발 스킬 참조 |
| [docs/FILE-STRUCTURE.md](docs/FILE-STRUCTURE.md) | 파일/폴더 구조 & 네이밍 규칙 | 모든 개발 스킬 참조 |
| [docs/HANDOFF.md](docs/HANDOFF.md) | 배포 체크리스트 | `/handoff` |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | 변경 이력 | 모든 스킬이 기록 |

## 핵심 원칙

1. **에드센스 정책 준수**: 모든 페이지가 Google AdSense 프로그램 정책을 준수해야 한다
2. **Core Web Vitals 충족**: LCP < 2.5s, INP < 200ms, CLS < 0.1
3. **SEO 우선**: 모든 페이지에 고유 title, meta description, 구조화 데이터 적용
4. **문서 동기화**: 코드 변경 시 관련 docs/ 문서를 함께 업데이트
5. **변경 이력 기록**: 주요 변경사항을 docs/CHANGELOG.md에 기록

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (AdSense script loader)
│   ├── page.tsx            # Home (도구 목록)
│   ├── tools/              # 개별 도구 페이지
│   │   └── [slug]/
│   ├── categories/         # 카테고리별 도구 목록
│   └── not-found.tsx       # 404 (광고 없음)
├── components/
│   ├── ads/                # 광고 컴포넌트 (AdUnit, InContentAd, SidebarAd, HeaderAd)
│   ├── tools/              # 도구 공통 컴포넌트 (ToolLayout, ToolResult, ToolInput)
│   ├── ui/                 # 공통 UI (Button, Card, Input, etc.)
│   └── seo/                # SEO (JsonLd, MetaTags, Breadcrumb)
├── config/
│   ├── adsense.ts          # 에드센스 설정 (pub ID, slot IDs)
│   └── site.ts             # 사이트 메타 정보
├── hooks/
│   ├── useAdSlot.ts        # 광고 슬롯 lifecycle 관리
│   └── useIntersectionObserver.ts
├── layouts/
│   └── AdLayout.tsx        # 광고 슬롯 포지셔닝 래퍼
├── lib/                    # 유틸리티 함수
└── types/                  # TypeScript 타입 정의

public/
├── ads.txt                 # AdSense ads.txt
├── robots.txt              # 크롤러 설정
└── sitemap.xml             # 사이트맵 (자동 생성)
```

## Code Conventions

- **컴포넌트**: PascalCase, 파일당 하나의 컴포넌트
- **광고 설정**: `src/config/adsense.ts`에 집중 (컴포넌트에 하드코딩 금지)
- **환경변수**: `NEXT_PUBLIC_ADSENSE_PUB_ID` 사용
- **광고 컴포넌트**: 반드시 `src/components/ads/`에 위치
- **도구 컴포넌트**: `src/components/tools/`에 공통 레이아웃 제공
- **에러/404 페이지**: 광고 컴포넌트 import 금지

## AdSense 빠른 참조 (상세: docs/ADSENSE.md)

- `next/script`의 `afterInteractive` 전략으로 로드
- 모든 광고 슬롯에 고정 치수 예약 (CLS 방지)
- 페이지당 최대 3~5개 광고 유닛
- 도구 결과 영역 하단에 인라인 광고 배치가 가장 효과적
- 도구 목록 페이지에는 Multiplex 광고 활용
- 콘텐츠:광고 비율 최소 70:30 유지

## 스킬 가이드

| 스킬 | 용도 | 사용 시점 |
|------|------|----------|
| `/adsense-setup` | 에드센스 초기 통합 셋업 | 프로젝트 시작 또는 새 도구 추가 시 |
| `/ad-placement` | 페이지별 광고 배치 최적화 | 새 페이지 완성 후 광고 최적화 시 |
| `/seo-audit` | SEO 감사 & 개선 제안 | 페이지 발행 전 SEO 점검 시 |
| `/performance-check` | Core Web Vitals 성능 분석 | 성능 저하 의심 또는 정기 점검 시 |
| `/monetization-report` | 수익화 종합 리포트 | 전체 프로젝트 수익화 건강도 확인 시 |
| `/plan-update` | 플랜 & 로드맵 업데이트 | 태스크 완료/추가, 마일스톤 변경 시 |
| `/design-system` | 디자인 시스템 관리 | 새 컴포넌트 스타일 추가/수정 시 |
| `/handoff` | 배포 전 핸드오프 검증 | 프로덕션 배포 직전 |
