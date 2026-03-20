# Handoff & Deployment Checklist

> `/handoff` 스킬이 이 문서를 관리합니다. 배포 전 모든 항목을 검증합니다.

## Pre-deployment Checklist

### 1. Build & Tests
- [ ] `pnpm build` 성공 (에러 없음)
- [ ] `pnpm test` 전체 통과
- [ ] `pnpm test:e2e` E2E 테스트 통과
- [ ] TypeScript 타입 에러 없음 (`pnpm type-check`)
- [ ] Lint 경고/에러 없음 (`pnpm lint`)

### 2. Performance
- [ ] Lighthouse Performance 점수 90+
- [ ] LCP < 2.5s (주요 페이지 3개 이상 측정)
- [ ] CLS < 0.1 (광고 포함 상태에서)
- [ ] INP < 200ms (도구 실행 인터랙션)

### 3. SEO
- [ ] 모든 페이지에 고유 title + meta description
- [ ] sitemap.xml 자동 생성 정상 동작
- [ ] robots.txt 설정 확인
- [ ] JSON-LD 구조화 데이터 검증 (Google Rich Results Test)
- [ ] canonical URL 설정 확인

### 4. AdSense
- [ ] ads.txt 올바르게 설정 (퍼블리셔 ID 확인)
- [ ] 에러/404 페이지에 광고 없음
- [ ] 콘텐츠:광고 비율 70:30 이상
- [ ] 모바일에서 above-the-fold 광고 최대 1개
- [ ] 광고-버튼 간 최소 32px 간격
- [ ] 광고 라벨 올바르게 표시

### 5. Environment
- [ ] `NEXT_PUBLIC_ADSENSE_PUB_ID` 프로덕션 값 설정
- [ ] `NEXT_PUBLIC_GA_ID` 프로덕션 값 설정
- [ ] `NEXT_PUBLIC_SITE_URL` 프로덕션 도메인 설정
- [ ] `.env.production` 파일 검증 (민감 정보 노출 없음)

### 6. Security
- [ ] CSP 헤더에 AdSense 도메인 허용
- [ ] HTTPS 설정 확인
- [ ] 민감 정보 하드코딩 없음

## Monitoring Setup

| 서비스 | 설정 | 확인 |
|--------|------|------|
| Google Analytics 4 | 측정 ID 등록, 이벤트 추적 | [ ] |
| Google Search Console | 도메인 인증, 사이트맵 제출 | [ ] |
| AdSense Dashboard | 사이트 등록, 광고 단위 확인 | [ ] |
| Vercel Analytics | 프로젝트 연결, Web Vitals 모니터링 | [ ] |

## Rollback Procedure

1. Vercel 대시보드에서 이전 배포로 즉시 롤백 가능
2. 긴급 시: `git revert HEAD` → push → 자동 재배포
3. 광고 문제 시: AdSense 콘솔에서 특정 페이지 광고 일시 중지

## Deployment History

_배포가 완료되면 여기에 기록됩니다._

| 날짜 | 버전 | 주요 변경사항 | 상태 |
|------|------|-------------|------|
| — | — | — | — |
