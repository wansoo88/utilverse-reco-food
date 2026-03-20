# Design System Skill

## 용도
디자인 시스템 관리 — 새 컴포넌트 스타일 추가/수정 시 사용

## 참조 문서
- [docs/DESIGN.md](../../../docs/DESIGN.md) — 디자인 시스템 & 스타일 가이드
- [docs/FRONTEND.md](../../../docs/FRONTEND.md) — 컴포넌트 & UI 개발

## 수행 작업

### 1. 디자인 원칙 준수 확인
- 광고와 콘텐츠의 조화로운 공존 (명확한 구분)
- 도구 중심 UX: 입력 → 결과 → 다음 행동 흐름
- 시각적 복잡성 최소화, 성능 우선

### 2. 색상 시스템 관리
- `primary` 색상: 주요 액션 (500/600/700)
- `neutral` 색상: 배경, 텍스트, 테두리
- `ad` 색상: 광고 영역 전용 (bg, border, label)
- 새 색상 추가 시 `tailwind.config.ts` 업데이트

### 3. 타이포그래피 관리
- H1: `text-3xl font-bold`
- H2: `text-2xl font-semibold`
- H3: `text-xl font-semibold`
- Body: `text-base font-normal leading-relaxed`
- 광고 라벨: `text-xs font-normal`

### 4. 컴포넌트 스타일 관리
- **Button**: primary, secondary, danger, disabled 변형
- **Card**: 기본, 도구 카드 (hover 효과)
- **Input**: 기본 (focus ring 스타일)
- **Ad Container**: `bg-ad-bg border-ad-border rounded-lg p-2`

### 5. 간격 시스템
- 컴포넌트 내부 패딩: `p-4` (16px)
- 카드 간격: `gap-4` (16px)
- 섹션 간격: `space-y-8` (32px)
- 광고-콘텐츠 간격: `my-4` 이상 (16px+)

### 6. 반응형 규칙
- `sm` (< 640px): 모바일 우선
- `md` (640-1024px): 태블릿
- `lg` (> 1024px): 데스크톱 (SidebarAd 표시)

### 7. 다크모드 고려사항
- 광고 컨테이너 배경 중립적 유지
- 광고 라벨 다크모드 조정: `dark:text-neutral-400`

### 8. 문서 업데이트
- `docs/DESIGN.md`의 Design Tokens 섹션 업데이트
- `docs/FRONTEND.md`의 Registered Components 업데이트
- `docs/CHANGELOG.md`에 변경 이력 기록

## 체크리스트
- [ ] 디자인 원칙 준수
- [ ] 색상 시스템 일관성
- [ ] 타이포그래피 규칙 준수
- [ ] 컴포넌트 스타일 일관성
- [ ] 간격/레이아웃 시스템 준수
- [ ] 반응형 대응
- [ ] 관련 문서 업데이트
