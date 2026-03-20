# Plan Update Skill

## 용도
플랜 & 로드맵 업데이트 — 태스크 완료/추가, 마일스톤 변경 시 사용

## 참조 문서
- [docs/PLAN.md](../../../docs/PLAN.md) — 프로젝트 로드맵 & 태스크 추적

## 수행 작업

### 1. 현재 상태 파악
- `docs/PLAN.md`의 Current Phase 확인
- Task Tracker의 태스크 상태 확인
- 완료된 태스크와 진행 중인 태스크 파악

### 2. 태스크 상태 업데이트
- 완료된 태스크: `⬜` → `✅` 변경
- 새로 시작된 태스크: `⬜` → `🔵` 변경
- 새 태스크 추가 시 적절한 우선순위 부여 (P0/P1/P2)

### 3. 마일스톤 업데이트
- Phase별 체크리스트 업데이트 (`- [ ]` → `- [x]`)
- Phase 전체 완료 시 Current Phase를 다음 Phase로 변경

### 4. Decision Log 기록
- 중요한 기술적 결정이 있을 경우 Decision Log 테이블에 추가
- 형식: `| 날짜 | 결정 | 이유 |`

### 5. 문서 동기화
- `docs/CHANGELOG.md`에 변경 이력 기록

## Phase 전환 기준

| Phase | 완료 조건 |
|-------|----------|
| Phase 1 → 2 | 프로젝트 셋업, 에드센스 통합, AdLayout 완료 |
| Phase 2 → 3 | 최소 3개 도구 개발 완료, 도구 목록/카테고리 페이지 완성 |
| Phase 3 → 4 | SEO 감사 통과, Core Web Vitals 목표 달성 |

## 체크리스트
- [ ] 태스크 상태 최신화
- [ ] 마일스톤 체크리스트 업데이트
- [ ] Current Phase 정확성 확인
- [ ] Decision Log 업데이트 (해당 시)
- [ ] CHANGELOG.md 기록
