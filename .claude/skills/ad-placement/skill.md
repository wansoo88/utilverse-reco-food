# Ad Placement Skill

## 용도
페이지별 광고 배치 최적화 — 새 페이지 완성 후 광고 위치/크기 최적화 시 사용

## 참조 문서
- [docs/ADSENSE.md](../../../docs/ADSENSE.md) — 배치 전략 & 정책
- [docs/FRONTEND.md](../../../docs/FRONTEND.md) — 컴포넌트 & 레이아웃
- [docs/DESIGN.md](../../../docs/DESIGN.md) — 디자인 시스템 & 광고 스타일

## 수행 작업

### 1. 페이지 유형 분석
- 대상 페이지가 도구 페이지(`/tools/[slug]`)인지, 목록 페이지(`/`, `/categories/`)인지 파악
- 각 유형에 맞는 배치 전략 적용

### 2. 도구 페이지 배치 (기본 구조)
```
HeaderAd (728x90) → 도구 입력 폼 상단
SidebarAd (300x250) → 데스크톱 전용, sticky
InContentAd (336x280) → 결과 출력 하단
FooterAd (728x90) → 페이지 하단
```
- 페이지당 최대 3~5개 광고 유닛
- 콘텐츠:광고 비율 최소 70:30 유지

### 3. 목록 페이지 배치
```
HeaderAd (728x90) → 상단
MultiplexAd → 도구 그리드 하단 (6개 도구마다)
```

### 4. 모바일 최적화
- SidebarAd → 숨김 (`lg:` 이상에서만 표시)
- HeaderAd → 320x100 (모바일 리더보드)
- Above-the-fold에 광고 최대 1개
- InContentAd → 전체 너비 반응형

### 5. CLS 방지 검증
- 모든 광고 슬롯에 `minHeight` 설정 확인
- 광고 로딩 전 placeholder가 올바른 치수로 표시되는지 확인

### 6. 정책 준수 검증
- 도구 실행 버튼과 광고 간 최소 32px 간격
- 결과 복사 버튼 근처 광고 없음
- 광고 라벨이 "광고" 또는 "Advertisement"로 표시
- 오클릭 유도 요소 없음

### 7. 문서 업데이트
- `docs/FRONTEND.md`의 Registered Components 업데이트
- `docs/ADSENSE.md`의 Ad Slot Registry 업데이트
- `docs/CHANGELOG.md`에 변경 이력 기록

## 체크리스트
- [ ] 페이지 유형에 맞는 배치 전략 적용
- [ ] 페이지당 광고 수 3~5개 이하
- [ ] 콘텐츠:광고 비율 70:30 이상
- [ ] 모바일 배치 최적화
- [ ] CLS 방지용 고정 치수 설정
- [ ] 광고-인터랙션 요소 간 충분한 간격
- [ ] 관련 문서 업데이트 완료
