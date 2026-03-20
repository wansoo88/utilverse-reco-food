# Changelog

> 모든 스킬이 작업 완료 시 이 문서에 변경사항을 기록합니다.

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
