# Handoff & Deployment Checklist

> `/handoff` 스킬이 이 문서를 관리합니다. 배포 전 모든 항목을 검증합니다.

## Pre-deployment Checklist

### 1. Build & Tests
- [ ] `pnpm build` 성공
- [ ] `pnpm test` 전체 통과
- [ ] `pnpm test:e2e` E2E 통과
- [ ] `pnpm type-check` 타입 에러 없음
- [ ] `pnpm lint` 경고/에러 없음

### 2. Performance
- [ ] Lighthouse Performance 90+
- [ ] LCP < 2.5s (홈 + SEO 페이지 3개 이상)
- [ ] CLS < 0.1 (Footer 광고 포함 상태)
- [ ] INP < 200ms (필터 클릭 + 추천받기)

### 3. SEO
- [ ] 모든 페이지에 고유 title + meta description
- [ ] sitemap.xml 자동 생성 (120개+ URL)
- [ ] robots.txt 설정 (/api/ 차단)
- [ ] JSON-LD 구조화 데이터 검증
- [ ] hreflang 4개 언어 설정
- [ ] canonical URL 확인
- [ ] 각 SEO 페이지 300자 이상 고유 콘텐츠

### 4. AdSense
- [ ] ads.txt 올바르게 설정 (퍼블리셔 ID)
- [ ] 광고는 footer에만 존재
- [ ] 에러/404 페이지에 광고 없음
- [ ] 광고 라벨 "광고" 표시
- [ ] 개인정보처리방침 페이지 존재

### 5. Security (3단계 보안)
- [ ] Layer 1: BLOCKED_PATTERNS 15개 패턴 동작
- [ ] Layer 1: FOOD_SIGNALS 음식 관련성 검증
- [ ] Layer 2: sanitizeInput HTML/특수문자 제거
- [ ] Layer 3: 시스템 프롬프트 방어 지시 포함
- [ ] 보안 테스트 10개 시나리오 통과

### 6. i18n
- [ ] ko/en/ja/zh 4개 로케일 라우팅 동작
- [ ] 기본 로케일 ko로 리다이렉트
- [ ] 번역 메시지 파일 4개 완비
- [ ] SEO 페이지 slug 언어별 매핑

### 7. Environment
- [ ] `GEMINI_API_KEY` 프로덕션 값 설정
- [ ] `NEXT_PUBLIC_ADSENSE_PUB_ID` 프로덕션 값
- [ ] `NEXT_PUBLIC_GA_ID` 프로덕션 값
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://utilverse.net`
- [ ] `.env.local`이 git에 포함되지 않음

### 8. Functionality
- [ ] 필터 선택 → 검색창 키워드 동기화
- [ ] 추천받기 → Gemini 응답 → 결과 카드
- [ ] 쿼터 초과 → localRecommend 폴백
- [ ] 캘린더 저장/복원 동작
- [ ] 필터 localStorage 저장/복원
- [ ] 흑백요리사 배너 → 필터 활성화

## Monitoring Setup

| 서비스 | 설정 | 확인 |
|--------|------|------|
| Google Analytics 4 | 측정 ID, 이벤트 추적 | [ ] |
| Google Search Console | 도메인 인증, 사이트맵 제출 | [ ] |
| AdSense Dashboard | 사이트 등록 | [ ] |
| Vercel Analytics | Web Vitals 모니터링 | [ ] |

## Rollback Procedure

1. Vercel 대시보드 → 이전 배포로 즉시 롤백
2. 긴급 시: `git revert HEAD` → push → 자동 재배포
3. Gemini API 문제 시: localRecommend 폴백이 자동 동작

## Deployment History

| 날짜 | 버전 | 주요 변경사항 | 상태 |
|------|------|-------------|------|
| — | — | — | — |
