# AdSense Monetization Strategy

> `/adsense-setup`, `/ad-placement`, `/monetization-report` 스킬이 이 문서를 참조하고 업데이트합니다.

## 핵심 전략: Footer 전용 광고

**에드센스 승인과 사용자 경험을 최우선**으로 합니다.
광고는 footer에만 배치하여 "광고 사이트" 인상을 철저히 방지합니다.

### 왜 footer만?
1. **에드센스 승인 통과**: 충분한 콘텐츠 대비 최소 광고로 승인 가능성 극대화
2. **사용자 신뢰**: 콘텐츠 중심 사이트라는 인상 → 재방문율 증가
3. **SEO 효과**: 콘텐츠 품질 평가에서 광고 과다 페널티 회피
4. **점진적 확장**: 승인 후 트래픽이 증가하면 광고 위치를 점진적으로 추가

## Publisher Setup

### ads.txt
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
- `public/ads.txt`에 위치
- 퍼블리셔 ID는 `NEXT_PUBLIC_ADSENSE_PUB_ID` 환경변수

### Script Loading
```typescript
// src/app/layout.tsx (또는 [lang]/layout.tsx)
import Script from 'next/script';

<Script
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
  strategy="afterInteractive"
  crossOrigin="anonymous"
/>
```

## Ad Placement: Footer Only

### FooterAd 컴포넌트

```
┌────────────────────────────────────────────┐
│ ... 메인 콘텐츠 ...                         │
│                                            │
├────────────────────────────────────────────┤
│ Footer                                     │
│  ┌──────────────────────────────────┐      │
│  │  "광고" 라벨 (text-xs, 중앙)     │      │
│  │  ┌──────────────────────────┐    │      │
│  │  │   AdSense Display Ad     │    │      │
│  │  │   (반응형)                │    │      │
│  │  └──────────────────────────┘    │      │
│  └──────────────────────────────────┘      │
│                                            │
│  © 오늘뭐먹지 · 개인정보처리방침 · 문의     │
└────────────────────────────────────────────┘
```

### 반응형 광고 크기

| Breakpoint | 광고 크기 | 비고 |
|------------|----------|------|
| 모바일 (< 640px) | 320x100 | 작은 리더보드 |
| 태블릿 (640-1024px) | 728x90 | 표준 리더보드 |
| 데스크톱 (> 1024px) | 728x90 또는 반응형 | |

### CLS 방지

```typescript
// FooterAd 컴포넌트 — 고정 치수로 CLS 방지
<div
  className="bg-ad-bg border-t border-ad-border"
  style={{ minHeight: '100px' }}  // 광고 로딩 전 공간 확보
>
  <p className="text-ad-label text-xs text-center py-1">광고</p>
  <ins className="adsbygoogle" ... />
</div>
```

## Policy Compliance Checklist

### 에드센스 승인 필수 요건
- [ ] 사이트에 충분한 고유 콘텐츠 (SEO 페이지 30개+ 확보)
- [ ] 개인정보처리방침 페이지 존재
- [ ] 사이트 네비게이션이 명확
- [ ] ads.txt 올바르게 설정
- [ ] 사이트가 6개월 이상 운영 (일부 국가)

### 광고 정책 준수
- [x] 광고는 footer에만 배치 (콘텐츠:광고 비율 95:5 이상)
- [ ] 에러/404 페이지에 광고 없음
- [ ] 광고 라벨 "광고" 또는 "Advertisement"로만 표시
- [ ] 자동 광고 새로고침 없음
- [ ] 인터스티셜/팝업 광고 없음
- [ ] 광고 근처에 오클릭 유도 요소 없음

### 콘텐츠 품질 (승인 핵심)
- [ ] 각 SEO 페이지에 300자 이상의 고유 설명 텍스트
- [ ] AI 추천 결과가 실제 유용한 정보 제공
- [ ] 유튜브 레시피 링크로 부가가치 제공
- [ ] 내부 링크로 사이트 구조 명확

## 향후 광고 확장 계획

에드센스 승인 후, 트래픽이 충분해지면 단계적으로 광고를 추가합니다:

| 단계 | 조건 | 추가 광고 위치 |
|------|------|---------------|
| 1단계 (현재) | 승인 전 | Footer만 |
| 2단계 | 승인 후 + 월 1만 PV | SEO 페이지 하단 InContentAd 추가 |
| 3단계 | 월 5만 PV | 데스크톱 SidebarAd 추가 |
| 4단계 | 월 10만 PV | Multiplex Ad (SEO 페이지 관련 키워드 영역) |

**원칙**: 페이지당 최대 3개, 콘텐츠:광고 비율 70:30 이상 유지

## Ad Slot Registry

_광고 슬롯이 등록되면 여기에 기록됩니다._

| Slot ID | 위치 | 크기 | 페이지 | 추가일 |
|---------|------|------|--------|--------|
| — | Footer | 반응형 | 전체 | Phase 1 |
