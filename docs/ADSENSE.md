# AdSense Monetization Strategy (도구/유틸리티 특화)

> `/adsense-setup`, `/ad-placement`, `/monetization-report` 스킬이 이 문서를 참조하고 업데이트합니다.

## Publisher Setup

### ads.txt 설정
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
- `public/ads.txt`에 위치
- 퍼블리셔 ID는 환경변수 `NEXT_PUBLIC_ADSENSE_PUB_ID`에서 관리

### Script Loading
```typescript
// src/app/layout.tsx
import Script from 'next/script';

<Script
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
  strategy="afterInteractive"
  crossOrigin="anonymous"
/>
```

## Ad Unit Types (도구 사이트에 효과적인 유형)

### 1. Display Ad (디스플레이)
- **용도**: 헤더, 사이드바, 푸터 영역
- **장점**: 가장 높은 CPM, 시각적 주목도 높음
- **도구 사이트 활용**: 도구 입력 폼 상단, 사이드바

### 2. Multiplex Ad (멀티플렉스)
- **용도**: 도구 목록 페이지, 카테고리 페이지
- **장점**: 그리드 형태로 도구 카드와 자연스럽게 어울림
- **도구 사이트 활용**: 도구 목록 하단, 관련 도구 추천 영역

### 3. In-article Ad (인아티클)
- **용도**: 도구 설명 콘텐츠 사이, 결과 하단
- **장점**: 콘텐츠와 자연스럽게 어우러짐
- **도구 사이트 활용**: 도구 사용법 설명 중간, 결과 출력 하단

## Placement Strategy (도구 사이트 특화)

### 도구 페이지 (`/tools/[slug]`)
```
┌──────────────────────────────────────┐
│           HeaderAd (728x90)          │  ← 도구 입력 폼 상단
├──────────────────────────┬───────────┤
│  Tool Title & Description│           │
│  ┌─────────────────────┐ │ SidebarAd │  ← 데스크톱만, sticky
│  │   Tool Input Form   │ │ (300x250) │
│  └─────────────────────┘ │           │
│  ┌─────────────────────┐ │           │
│  │   Tool Result       │ │           │
│  └─────────────────────┘ │           │
│  ┌─────────────────────┐ │           │
│  │   InContentAd       │ │           │  ← 결과 확인 후 자연스러운 위치
│  │   (336x280)         │ │           │
│  └─────────────────────┘ │           │
│  Tool Guide / How to Use │           │
├──────────────────────────┴───────────┤
│          FooterAd (728x90)           │
└──────────────────────────────────────┘
```

### 도구 목록 페이지 (`/`, `/categories/[category]`)
```
┌──────────────────────────────────────┐
│           HeaderAd (728x90)          │
├──────────────────────────────────────┤
│  Category Title                      │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Tool 1 │ │ Tool 2 │ │ Tool 3 │   │  ← 도구 카드 그리드
│  └────────┘ └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Tool 4 │ │ Tool 5 │ │ Tool 6 │   │
│  └────────┘ └────────┘ └────────┘   │
│  ┌──────────────────────────────┐    │
│  │    MultiplexAd               │    │  ← 도구 그리드와 어울리는 형태
│  └──────────────────────────────┘    │
│  More tools...                       │
└──────────────────────────────────────┘
```

### 모바일 배치
- SidebarAd → 숨김
- HeaderAd → 320x100 (작은 리더보드)
- InContentAd → 전체 너비 반응형
- Above-the-fold에 광고 최대 1개

## Revenue Optimization Tips

### 도구 사이트 특화 전략
1. **인기 도구에 광고 집중**: GA4에서 페이지뷰 높은 도구 식별 → 해당 페이지 광고 최적화
2. **결과 영역 광고**: 도구 결과 출력 직후가 가장 높은 viewability
3. **관련 도구 추천**: 도구 사용 후 관련 도구 추천으로 세션당 페이지뷰 증가
4. **도구 카테고리 페이지**: Multiplex 광고로 자연스러운 그리드 혼합
5. **체류시간 활용**: 도구 사용 중 사이드바 sticky 광고가 오래 노출

### A/B 테스트 가이드
- AdSense 실험 기능 활용
- 테스트 대상: 광고 위치, 크기, 개수
- 최소 2주 이상 데이터 수집 후 판단
- 한 번에 하나의 변수만 테스트

## Policy Compliance Checklist

### 필수 준수 사항
- [x] ads.txt 파일 올바르게 설정
- [ ] 콘텐츠:광고 비율 70:30 이상 유지
- [ ] 에러/404 페이지에 광고 없음
- [ ] 광고 근처에 오클릭 유도 요소 없음
- [ ] 모바일에서 above-the-fold 광고 최대 1개
- [ ] 광고 라벨이 "광고" 또는 "Advertisement"로만 표시
- [ ] 인터스티셜/팝업 광고 사용하지 않음
- [ ] 자동 광고 새로고침 구현하지 않음
- [ ] 광고가 폼 버튼/입력 필드와 충분한 거리 유지

### 도구 사이트 특별 주의사항
- 도구 실행 버튼과 광고 사이 충분한 간격 (최소 32px)
- 도구 결과 복사 버튼 근처에 광고 배치 금지
- 로딩 중 인터스티셜 형태의 광고 금지

## Ad Slot Registry

_광고 슬롯이 등록되면 여기에 기록됩니다._

| Slot ID | 위치 | 크기 | 페이지 | 추가일 |
|---------|------|------|--------|--------|
| — | — | — | — | — |
