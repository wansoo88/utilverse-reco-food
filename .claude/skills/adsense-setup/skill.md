# AdSense Setup Skill

## 용도
에드센스 초기 통합 셋업 — 프로젝트 시작 또는 새 도구 추가 시 사용

## 참조 문서
- [docs/ADSENSE.md](../../../docs/ADSENSE.md) — 에드센스 전략 & 정책
- [docs/BACKEND.md](../../../docs/BACKEND.md) — API, 환경변수, CSP 설정
- [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) — 시스템 구조

## 수행 작업

### 1. 환경변수 확인
- `NEXT_PUBLIC_ADSENSE_PUB_ID` 설정 여부 확인
- `NEXT_PUBLIC_GA_ID` 설정 여부 확인
- `.env.local` 또는 `.env.production` 파일 검증

### 2. AdSense 스크립트 로더 설정
- `src/app/layout.tsx`에 `next/script` 기반 로더 추가
- `strategy="afterInteractive"` 사용 확인
- `crossOrigin="anonymous"` 설정 확인

### 3. ads.txt 설정
- `public/ads.txt` 파일 생성 또는 확인
- 퍼블리셔 ID 형식 검증: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`

### 4. 광고 설정 파일
- `src/config/adsense.ts`에 슬롯 ID 및 설정 집중
- 하드코딩된 `ca-pub-` ID가 컴포넌트에 없는지 검사

### 5. CSP 헤더 설정
- `next.config.ts`에 AdSense 관련 도메인 허용:
  - `script-src`: `pagead2.googlesyndication.com`, `googletagservices.com`
  - `frame-src`: `googleads.g.doubleclick.net`, `tpc.googlesyndication.com`
  - `img-src`: `pagead2.googlesyndication.com`

### 6. 광고 컴포넌트 기본 세트 생성
- `src/components/ads/AdUnit.tsx` — 범용 광고 래퍼
- `src/components/ads/HeaderAd.tsx` — 리더보드 (728x90 / 320x100)
- `src/components/ads/InContentAd.tsx` — 인콘텐츠 (336x280)
- `src/components/ads/SidebarAd.tsx` — 사이드바 스티키 (300x250)
- `src/components/ads/MultiplexAd.tsx` — 멀티플렉스 그리드

### 7. 문서 업데이트
- `docs/ADSENSE.md`의 Ad Slot Registry 업데이트
- `docs/BACKEND.md`의 Registered API Routes 업데이트 (해당 시)
- `docs/CHANGELOG.md`에 변경 이력 기록

## 체크리스트
- [ ] 환경변수 설정 완료
- [ ] AdSense 스크립트 로더 정상 동작
- [ ] ads.txt 올바르게 배치
- [ ] 광고 설정 `src/config/adsense.ts`에 집중
- [ ] CSP 헤더에 AdSense 도메인 허용
- [ ] 광고 컴포넌트 기본 세트 생성
- [ ] 에러/404 페이지에 광고 컴포넌트 import 없음
- [ ] 관련 문서 업데이트 완료
