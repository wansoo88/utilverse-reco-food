# Project Plan & Roadmap

> 이 문서는 `/plan-update` 스킬이 관리합니다. 태스크 완료/추가 시 자동 업데이트됩니다.

## Current Phase

🔵 **Phase 1: 프로젝트 셋업 & 에드센스 통합** (진행 중)

## Milestones

### Phase 1: 프로젝트 셋업 & 에드센스 통합
- [ ] Next.js 프로젝트 초기화 (App Router, TypeScript, Tailwind)
- [ ] 에드센스 스크립트 로더 & 광고 컴포넌트 생성
- [ ] AdLayout 레이아웃 시스템 구축
- [ ] ads.txt, robots.txt, sitemap.xml 설정
- [ ] 환경변수 & 설정 파일 구성

### Phase 2: 핵심 도구 개발
- [ ] 도구 공통 레이아웃 (ToolLayout) 구현
- [ ] 첫 번째 유틸리티 도구 개발
- [ ] 도구 목록 & 카테고리 페이지 구현
- [ ] 도구 결과 영역 광고 배치 구현

### Phase 3: SEO & 성능 최적화
- [ ] 모든 페이지 메타 태그 & 구조화 데이터 적용
- [ ] sitemap 자동 생성 구현
- [ ] Core Web Vitals 최적화 (LCP, INP, CLS)
- [ ] 이미지 & 폰트 최적화

### Phase 4: 배포 & 모니터링
- [ ] 프로덕션 빌드 & 배포
- [ ] GA4 & AdSense 리포팅 연동
- [ ] Search Console 등록 & 색인 요청
- [ ] 성능 모니터링 설정

## Task Tracker

| 상태 | 태스크 | 우선순위 | 관련 문서 |
|------|--------|---------|----------|
| ✅ | CLAUDE.md & 문서 체계 구성 | P0 | 전체 |
| 🔵 | 프로젝트 초기 셋업 | P0 | ARCHITECTURE.md |
| ⬜ | 에드센스 통합 | P0 | ADSENSE.md |
| ⬜ | 첫 번째 도구 개발 | P1 | FRONTEND.md |

**범례**: ✅ 완료 · 🔵 진행 중 · ⬜ 대기

## Decision Log

| 날짜 | 결정 | 이유 |
|------|------|------|
| 2026-03-18 | Next.js App Router 채택 | SSR/ISR로 SEO 극대화, 레이아웃 기반 광고 슬롯 관리에 적합 |
| 2026-03-18 | 도구/유틸리티 타입 선택 | 높은 체류시간, 반복 방문, 도구 결과 영역 광고 효과 우수 |
| 2026-03-18 | Tailwind CSS 채택 | 빠른 렌더링, CLS 최소화, 유틸리티 우선 접근 |
