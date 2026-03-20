# Performance Check Skill

## 용도
Core Web Vitals 성능 분석 — 성능 저하 의심 또는 정기 점검 시 사용

## 참조 문서
- [docs/PERFORMANCE.md](../../../docs/PERFORMANCE.md) — 성능 최적화 & 예산
- [docs/ADSENSE.md](../../../docs/ADSENSE.md) — 광고 스크립트 로딩 전략

## 수행 작업

### 1. Core Web Vitals 측정
- **LCP** (Largest Contentful Paint): 목표 < 2.5s
- **INP** (Interaction to Next Paint): 목표 < 200ms
- **CLS** (Cumulative Layout Shift): 목표 < 0.1
- `npx lighthouse` 실행 또는 코드 분석으로 예측

### 2. 번들 크기 분석
- 초기 JS 번들: < 100KB (gzipped) 확인
- 페이지당 총 JS: < 300KB (gzipped) 확인
- 총 페이지 크기: < 1MB (광고 제외) 확인
- 불필요한 dependency 식별

### 3. 이미지 최적화 검사
- `next/image` 사용 여부
- `width`/`height` 명시 여부 (CLS 방지)
- above-fold 이미지에 `priority`, below-fold에 `loading="lazy"`
- WebP/AVIF 포맷 사용 여부

### 4. 폰트 최적화 검사
- `next/font` 사용 여부
- `display: 'swap'` 설정 (FOIT 방지)
- 폰트 크기: < 50KB 확인

### 5. 광고 성능 영향 분석
- AdSense 스크립트 `afterInteractive` 로드 확인
- below-fold 광고 lazy loading (IntersectionObserver) 사용 확인
- 광고 슬롯 고정 치수로 CLS 방지 확인

### 6. 코드 스플리팅 검사
- 도구 컴포넌트 `dynamic import` 사용 여부
- below-fold 광고 컴포넌트 `dynamic import` 사용 여부

### 7. ISR/캐싱 전략 검사
- 도구 페이지: `revalidate = 86400` (24시간)
- 목록 페이지: `revalidate = 3600` (1시간)
- API 응답: `s-maxage=600`

### 8. 결과 기록
- `docs/PERFORMANCE.md`의 Measurement Results 테이블 업데이트
- 발견된 병목 지점 및 개선 제안 제공
- `docs/CHANGELOG.md`에 변경 이력 기록

## Performance Budget 요약

| 항목 | 제한 |
|------|------|
| 초기 JS 번들 | < 100KB (gzipped) |
| 페이지당 총 JS | < 300KB (gzipped) |
| 총 페이지 크기 | < 1MB (광고 제외) |
| 이미지 크기 | 개별 < 100KB |
| 웹폰트 | < 50KB |

## 체크리스트
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] 번들 크기 예산 이내
- [ ] 이미지 최적화 완료
- [ ] 폰트 최적화 완료
- [ ] 광고 로딩이 성능에 미치는 영향 최소화
- [ ] 측정 결과 docs/PERFORMANCE.md에 기록
