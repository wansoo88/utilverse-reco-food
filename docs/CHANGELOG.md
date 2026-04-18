# Changelog

> 모든 스킬이 작업 완료 시 이 문서에 변경사항을 기록합니다.

## [2026-04-18] - 어드민 퍼시스턴트 스토어 도입

### Fixed (Critical)
- **어드민 데이터가 서버 재기동 시 사라지던 문제 해결**: 사용량(`/tmp/wmj_usage.json`)·트렌드(`/tmp/wmj_trends.json`) 데이터가 Vercel 콜드 스타트·재배포마다 초기화되던 문제를 티어드 퍼시스턴트 스토어로 해결

### Added
- **`src/lib/persistStore.ts`** — 퍼시스턴트 스토리지 추상화. 환경에 따라 자동 선택:
  1. **Upstash Redis REST** (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` 설정 시) — Vercel 운영 권장, 재기동·재배포 후에도 유지
  2. **로컬 `.data/` 파일** — 로컬 개발 FS 쓰기 가능 시, `pnpm dev` 재기동 후에도 유지
  3. **`/tmp` 폴백** — 이전 위치. 기존 `/tmp/wmj_*.json` 데이터가 있으면 상위 백엔드로 1회 자동 마이그레이션
- **스토리지 백엔드별 어드민 UI 배너** — 현재 저장 위치에 따라 색상·문구 동적 변경 (Upstash=녹색/영구, local=파랑/dev-only, tmp=주황/휘발 경고)

### Changed
- `src/lib/usageTracker.ts` — `readFileSync/writeFileSync` 동기 I/O → persistStore 기반 async. `trackUsage`/`getUsageSummary`/`clearUsage` 시그니처 `Promise` 반환
- `src/app/api/admin/trends/route.ts` — persistStore 사용으로 변경
- `src/app/api/admin/usage/route.ts` — `await getUsageSummary/clearUsage` 적용
- `src/app/api/{recommend,kpop-recommend,weather-recommend}/route.ts` — 9곳의 `trackUsage(...)` 호출에 `.catch(() => {})` 추가 (fire-and-forget, 실패 silent)
- `.gitignore` — `.data/` 추가 (로컬 퍼시스턴트 파일 미커밋)
- `.env.example` — `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` 추가 (선택)

### Migration Notes
- **Vercel 운영 환경**: Upstash 콘솔(https://console.upstash.com)에서 Redis DB 생성 → REST URL/Token을 Vercel 환경변수에 입력 → 재배포. 이후 모든 어드민 데이터 영구 유지
- **로컬 개발**: 별도 설정 없이 `.data/` 디렉터리가 자동 생성되어 서버 재기동 후에도 데이터 유지
- **기존 데이터**: 첫 읽기 시 `/tmp/wmj_usage.json`·`/tmp/wmj_trends.json`이 존재하면 상위 백엔드로 자동 복사

## [2026-04-16] - AdSense/Sitemap/SEO 종합 개선

### Fixed (Critical)
- **중복 middleware 제거**: 루트 `/middleware.ts`(`localePrefix: 'always'`)와 `/src/middleware.ts`(`as-needed`)가 동시에 존재해 sitemap URL의 308 redirect 경로 모호성을 유발 → 루트 파일 삭제, src 버전만 사용. **GSC "sitemap을 가져올 수 없음" 오류의 주요 원인 중 하나로 추정**
- **i18n 누수 버그**: `src/app/[lang]/eat/menu/[slug]/page.tsx`의 `bodyParagraphs` 본문 3단락이 한국어로 하드코딩되어 영어/일본어/중국어 페이지에도 한국어 텍스트가 표시됨 → 언어별 템플릿(`bodyTemplates`)으로 분리. **외국어 페이지 콘텐츠 품질 신호 회복**
- **og-image 도메인 하드코딩 제거**: `food-ai.utilverse.info` 문자열을 `SITE_URL` 기반 `URL().host`로 대체 (루트/메뉴 OG 이미지 모두)
- **SITE_URL 불일치 정리**: `.env.example` 기본값을 `src/config/site.ts` 기본값과 동일한 `https://food-ai.utilverse.info`로 통일 + GSC 도메인 일치 요구사항 명시

### Added
- **동적 ads.txt 라우트** (`src/app/ads.txt/route.ts`): 정적 placeholder(`pub-XXXXXXXXXX`) 대신 환경변수에서 자동 생성 → AdSense 크롤러가 항상 올바른 pub ID 확인
- **Consent Mode v2 기본값** (`src/app/layout.tsx`): EU/EEA/GB/CH는 ad_* 거부, 그 외 지역은 허용 → 추가 동의 배너 없이 기본 정책 준수
- **InArticleAd 컴포넌트** (`src/components/ads/InArticleAd.tsx`): 본문 중간 광고 슬롯 (in-article 포맷) — 슬롯 ID 미설정 시 자동 비활성화
- **AdSense 슬롯 환경변수화** (`src/config/adsense.ts`): footer/inArticle/sidebar 3종 슬롯 ID를 `NEXT_PUBLIC_ADSENSE_SLOT_*` 환경변수로 주입 → 코드 변경 없이 승인 후 활성화
- **BreadcrumbList JSON-LD**: 메뉴 페이지에 빵부스러기 구조화 데이터 추가 → Google 리치 결과 노출 증가
- **Article schema 강화**: `datePublished`/`dateModified`/`author` 필드 추가 → 콘텐츠 신뢰도 신호 강화
- **FooterAd CLS 방지**: 광고 컨테이너에 `minHeight: 90px` 사전 확보 → CWV 안정화

### Notes
- **GSC sitemap 제출 절차**: ① Vercel 환경변수 `NEXT_PUBLIC_SITE_URL`을 GSC 속성 도메인과 정확히 일치시킴 → ② `curl -I https://<도메인>/sitemap.xml` 으로 200 응답 확인 → ③ GSC에서 sitemap.xml 재제출
- **AdSense 활성화 절차**: ① `NEXT_PUBLIC_ADSENSE_PUB_ID` 설정 → ② 승인 후 광고 단위 생성 → ③ `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER` 등 환경변수에 슬롯 ID 입력만으로 광고 노출

## [2026-03-20] - 문서 체계 전면 업데이트

### Changed
- docs/ 전체 문서를 "오늘뭐먹지" AI 음식 추천 서비스에 맞게 전면 교체
- 범용 도구 사이트(JSON Formatter 등) 예시 → 음식 추천 전용으로 변경
- 광고 전략: 다중 배치 → footer 전용으로 변경 (에드센스 승인 우선)
- 라우팅: `/tools/[slug]` → `/[lang]/eat/menu/[slug]` (next-intl i18n)
- ARCHITECTURE.md: Gemini API 파이프라인, 3단계 보안 아키텍처 추가
- BACKEND.md: /api/recommend API 명세, 보안 Layer 2, Gemini 프롬프트 추가
- FRONTEND.md: 추천 UI 컴포넌트 (FilterChip, RecommendCard, CalendarView 등)
- DESIGN.md: 흑백요리사 보라색 테마, 필터 칩 스타일, Toast 시스템
- ADSENSE.md: footer 전용 전략, 단계적 확장 계획
- SEO.md: 프로그래매틱 SEO (30개+ 키워드 x 4언어), hreflang, JSON-LD
- PERFORMANCE.md: Gemini API 응답 시간, Footer 광고 성능 이점
- TESTING.md: 보안 테스트 시나리오, Phase별 테스트 전략
- FILE-STRUCTURE.md: i18n 구조, data/ 디렉토리, food/ 컴포넌트
- HANDOFF.md: Gemini API 키, i18n, 3단계 보안 검증 항목 추가
- PLAN.md: 5 Phase 로드맵 (셋업→추천UI→캘린더→SEO→배포)

### Added
- 흑백요리사 1·2 Top 10 셰프 하드코딩 계획 (src/data/chefs.ts)
- next-intl i18n 라우팅 (ko/en/ja/zh)
- localStorage 기반 상태 관리 (wmj_filters, wmj_calendar, wmj_lang)

## [2026-03-18] - 프로젝트 초기 구성

### Added
- CLAUDE.md 프로젝트 총괄 지침 파일 생성
- docs/ 문서 체계 구축 (12개 MD 파일)
- .claude/skills/ 커스텀 스킬 8개 생성
- .claude/hooks/pre-commit-adsense-check.sh 정책 검사 훅 생성
- .claude/settings.json 훅 & 권한 설정
