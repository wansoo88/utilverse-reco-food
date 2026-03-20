# SEO Audit Skill

## 용도
SEO 감사 & 개선 제안 — 페이지 발행 전 SEO 점검 시 사용

## 참조 문서
- [docs/SEO.md](../../../docs/SEO.md) — SEO 최적화 규칙
- [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) — 라우팅 & 렌더링 전략

## 수행 작업

### 1. Meta Tags 검사
- 모든 대상 페이지에 고유한 `title` (50-60자) 존재 여부
- 모든 대상 페이지에 고유한 `meta description` (150-160자) 존재 여부
- `canonical` URL 설정 여부
- OpenGraph + Twitter Card 메타 태그 설정 여부

### 2. Heading 구조 검사
- 페이지당 H1 태그 정확히 1개
- 헤딩 레벨 건너뛰기 없음 (H1 → H3 금지)
- 도구 페이지 권장 H2 구조: 도구 사용법, 기능 설명, FAQ, 관련 도구

### 3. 구조화 데이터 검사
- 도구 페이지: `WebApplication` JSON-LD 스키마 존재
- 모든 페이지: `BreadcrumbList` JSON-LD 존재
- 스키마 문법 오류 없음

### 4. 콘텐츠 SEO 검사
- 도구 설명 텍스트 300자 이상
- 관련 도구 내부 링크 2-3개 존재
- URL 형식: `/tools/[descriptive-slug]` (하이픈, 소문자)

### 5. Technical SEO 검사
- `sitemap.xml` 자동 생성 정상 동작
- `robots.txt` 올바르게 설정 (`/api/` 차단)
- 이미지 alt 텍스트 존재

### 6. 감사 결과 기록
- `docs/SEO.md`의 Audit Results 테이블에 결과 기록
- 발견된 이슈 목록과 개선 제안 제공
- `docs/CHANGELOG.md`에 변경 이력 기록

## 점수 기준

| 점수 | 기준 |
|------|------|
| A (90+) | 모든 필수 항목 충족, 구조화 데이터 완벽 |
| B (70-89) | 필수 항목 충족, 일부 권장 항목 누락 |
| C (50-69) | 일부 필수 항목 누락 |
| D (< 50) | 다수 필수 항목 누락 |

## 체크리스트
- [ ] 고유한 title (50-60자)
- [ ] 고유한 meta description (150-160자)
- [ ] H1 태그 1개
- [ ] 헤딩 계층 올바름
- [ ] canonical URL 설정
- [ ] JSON-LD 구조화 데이터 포함
- [ ] OpenGraph + Twitter Card 메타
- [ ] 관련 도구 내부 링크 2-3개
- [ ] 도구 설명 300자 이상
- [ ] sitemap 포함 확인
- [ ] 감사 결과 docs/SEO.md에 기록
