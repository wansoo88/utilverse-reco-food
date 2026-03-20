# Handoff Skill

## 용도
배포 전 핸드오프 검증 — 프로덕션 배포 직전 사용

## 참조 문서
- [docs/HANDOFF.md](../../../docs/HANDOFF.md) — 배포 체크리스트
- [docs/PERFORMANCE.md](../../../docs/PERFORMANCE.md) — 성능 목표
- [docs/SEO.md](../../../docs/SEO.md) — SEO 규칙
- [docs/ADSENSE.md](../../../docs/ADSENSE.md) — 에드센스 정책

## 수행 작업

### 1. Build & Tests 검증
- `pnpm build` 성공 확인
- `pnpm test` 전체 통과 확인
- `pnpm test:e2e` E2E 테스트 통과 확인 (해당 시)
- TypeScript 타입 에러 없음 (`pnpm type-check` 또는 `npx tsc --noEmit`)
- Lint 경고/에러 없음 (`pnpm lint`)

### 2. Performance 검증
- Lighthouse Performance 점수 90+ 확인
- LCP < 2.5s (주요 페이지 3개 이상)
- CLS < 0.1 (광고 포함)
- INP < 200ms (도구 실행 인터랙션)

### 3. SEO 검증
- 모든 페이지에 고유 title + meta description
- sitemap.xml 자동 생성 정상 동작
- robots.txt 설정 확인
- JSON-LD 구조화 데이터 검증
- canonical URL 설정 확인

### 4. AdSense 검증
- ads.txt 올바르게 설정
- 에러/404 페이지에 광고 없음
- 콘텐츠:광고 비율 70:30 이상
- 모바일 above-the-fold 광고 최대 1개
- 광고-버튼 간 최소 32px 간격
- 광고 라벨 올바르게 표시

### 5. 환경변수 검증
- `NEXT_PUBLIC_ADSENSE_PUB_ID` 프로덕션 값 설정
- `NEXT_PUBLIC_GA_ID` 프로덕션 값 설정
- `NEXT_PUBLIC_SITE_URL` 프로덕션 도메인 설정
- `.env.production` 민감 정보 노출 없음

### 6. Security 검증
- CSP 헤더에 AdSense 도메인 허용
- HTTPS 설정 확인
- 민감 정보 하드코딩 없음

### 7. 모니터링 설정 확인
- Google Analytics 4 측정 ID 등록
- Google Search Console 도메인 인증
- AdSense 사이트 등록
- Vercel Analytics 연결

### 8. 결과 기록
- `docs/HANDOFF.md`의 체크리스트 업데이트
- `docs/HANDOFF.md`의 Deployment History에 배포 기록 추가
- `docs/CHANGELOG.md`에 배포 이력 기록

## Rollback 절차
1. Vercel 대시보드에서 이전 배포로 즉시 롤백
2. 긴급 시: `git revert HEAD` → push → 자동 재배포
3. 광고 문제 시: AdSense 콘솔에서 특정 페이지 광고 일시 중지

## 체크리스트
- [ ] 빌드 성공 & 테스트 통과
- [ ] Core Web Vitals 목표 달성
- [ ] SEO 필수 항목 충족
- [ ] 에드센스 정책 준수
- [ ] 환경변수 프로덕션 설정
- [ ] 보안 설정 확인
- [ ] 모니터링 설정 완료
- [ ] 배포 기록 문서화
