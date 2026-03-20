# Frontend Development Guide

> `/ad-placement`, `/design-system` 스킬이 컴포넌트 추가/수정 시 이 문서를 업데이트합니다.

## Component Architecture

### 추천 UI 컴포넌트 (`src/components/food/`)

| 컴포넌트 | 용도 |
|----------|------|
| `HeroBanner` | 흑백요리사 프로모 배너 (보라 그라데이션, 클릭 시 필터 활성화) |
| `SearchBar` | 검색창 (필터 키워드 자동 어펜드 + 자유 입력 하이브리드) |
| `FilterSection` | 필터 그룹 래퍼 |
| `FilterChip` | 개별 필터 칩 (선택/미선택 상태) |
| `ModeFilter` | 해먹기/시켜먹기 토글 |
| `HouseholdFilter` | 1인/2인/가족 선택 |
| `VibeFilter` | 상황 태그 (흑백요리사, 단짠, 비오는날 등) |
| `BudgetFilter` | 예산 범위 선택 |
| `RecommendCard` | AI 추천 결과 카드 (메인 + 대안 3개) |
| `SweetSetBadge` | 단짠세트 디저트 표시 |
| `CalendarView` | 월간/주간 식단 캘린더 |
| `CalendarDay` | 캘린더 날짜 셀 (메뉴 기록) |

### UI 컴포넌트 (`src/components/ui/`)

| 컴포넌트 | 용도 |
|----------|------|
| `Button` | 기본 버튼 (추천받기, 저장 등) |
| `Card` | 카드 컨테이너 |
| `Toast` | 알림 토스트 (필터 복원, 보안 차단, 저장 완료) |
| `LanguageSelector` | 언어 전환 드롭다운 (ko/en/ja/zh) |
| `LoadingSpinner` | 추천 로딩 상태 |
| `Badge` | 상태 배지 (폴백 모드, 셰프 추천 등) |

### 광고 컴포넌트 (`src/components/ads/`)

| 컴포넌트 | 용도 | 위치 |
|----------|------|------|
| `FooterAd` | 에드센스 광고 | Footer 내부 (유일한 광고) |

**광고 원칙**: footer에만 배치하여 과도한 광고 인상을 방지하고 에드센스 승인 가능성을 높입니다.

### SEO 컴포넌트 (`src/components/seo/`)

| 컴포넌트 | 용도 |
|----------|------|
| `JsonLd` | 구조화 데이터 (Article, Recipe, BreadcrumbList) |
| `Breadcrumb` | 브레드크럼 네비게이션 |

## Page Layouts

### 홈페이지 (`/[lang]`)

```
┌────────────────────────────────────────────┐
│ Header (로고 + 네비 + 🌐 언어 선택)        │
├────────────────────────────────────────────┤
│                                            │
│  🏆 흑백요리사 프로모 배너                   │
│  (보라 그라데이션, 클릭 → 필터 활성화)       │
│                                            │
│  [🔍 검색창 — 필터 키워드 자동 반영]         │
│                                            │
│  ┌─ 어떻게? ──────────────────────┐        │
│  │ [해먹기] [시켜먹기]             │        │
│  ├─ 누구와? ──────────────────────┤        │
│  │ [1인] [2인] [가족]              │        │
│  ├─ 상황 ─────────────────────────┤        │
│  │ [👨‍🍳흑백요리사] [🍰단짠] [☔비오는날] │        │
│  ├─ 예산 ─────────────────────────┤        │
│  │ [상관없음] [1만↓] [2만↓] [3만↓]  │        │
│  └────────────────────────────────┘        │
│                                            │
│  [🎲 오늘 뭐 먹지? 추천받기!]  ← 메인 CTA  │
│                                            │
│  ┌─────────────────────────────────┐       │
│  │ 🍲 RecommendCard               │       │
│  │ 메인: 김치수제비 (한식)          │       │
│  │ 이유: "비오는날 국물이 최고"     │       │
│  │ 🎬 유튜브 레시피 / 📝 블로그    │       │
│  │ 대안: 감자전, 수제비, 칼국수     │       │
│  │ [📅 오늘의 메뉴로 저장]          │       │
│  └─────────────────────────────────┘       │
│                                            │
│  📅 이번 주 식단 캘린더 (접기/펼치기)       │
│                                            │
├────────────────────────────────────────────┤
│ Footer                                     │
│  ┌──────────────────────────────────┐      │
│  │        FooterAd (AdSense)        │      │  ← 유일한 광고 위치
│  └──────────────────────────────────┘      │
│  사이트 정보 · 개인정보처리방침 · 문의      │
└────────────────────────────────────────────┘
```

### SEO 페이지 (`/[lang]/eat/menu/[slug]`)

```
┌────────────────────────────────────────────┐
│ Header + Breadcrumb                        │
├────────────────────────────────────────────┤
│                                            │
│  H1: "비오는날 혼밥 뭐 먹지? AI 추천"      │
│  메타 설명 + 날짜                           │
│                                            │
│  ┌─ AI 추천 결과 (ISR 캐싱) ───────┐       │
│  │ 메인 추천 + 대안 3개             │       │
│  └──────────────────────────────────┘       │
│                                            │
│  🎬 관련 유튜브 레시피 5개                  │
│                                            │
│  🔗 관련 키워드 내부 링크                    │
│  "야근후 간단한 저녁" "다이어트 점심"        │
│                                            │
│  [🎲 직접 추천받으러 가기] → 홈으로 CTA     │
│                                            │
├────────────────────────────────────────────┤
│ Footer + FooterAd (AdSense)                │
└────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | 너비 | 변경사항 |
|------------|------|---------|
| `sm` | < 640px | 필터 칩 2열, 캘린더 주간 뷰 |
| `md` | 640-1024px | 필터 칩 3열, 캘린더 월간 뷰 |
| `lg` | > 1024px | 필터 칩 4열, 캘린더 월간 풀 뷰 |

## State Management

### 필터 상태 (useFilters 훅)

```typescript
interface FilterState {
  mode: 'cook' | 'order' | 'any';
  house: '1p' | '2p' | 'fam' | null;
  baby: 'no' | 'infant' | 'toddler';
  vibes: string[];    // ['chef', 'rain', 'sweet', ...]
  budget: string;     // 'any' | '5k' | '10k' | ...
}

// useFilters 훅:
// - 상태 변경 시 localStorage wmj_filters에 즉시 저장
// - 페이지 로드 시 저장된 필터 복원 + "✅ 이전 필터 불러옴" 토스트
// - 검색창 ✕ 클릭 시 필터 + 검색어 모두 초기화
```

### 검색창 ↔ 필터 동기화 (syncQuery)

```typescript
// 필터 변경 → 검색창 키워드 자동 업데이트
const syncQuery = (filters: FilterState, lang: string) => {
  const parts: string[] = [];
  if (filters.house) parts.push(HOUSE_KEYWORDS[lang][filters.house]);
  filters.vibes.forEach(v => parts.push(VIBE_KEYWORDS[lang][v]));
  if (filters.budget !== 'any') parts.push(BUDGET_KEYWORDS[lang][filters.budget]);
  setQuery(parts.join(' '));
};
```

### 캘린더 상태

```typescript
// localStorage wmj_calendar
interface CalendarEntry {
  menu: string;
  category: string;
  decision: 'cook' | 'order';
  date: string;  // ISO date
}
```

## 흑백요리사 칩 스타일

| 상태 | 배경 | 테두리 | 효과 |
|------|------|--------|------|
| 미선택 | 연보라 `#F5F3FF` | 보라 점선 `#C4B5FD` | 다른 칩과 시각적 차별화 |
| 선택됨 | 보라 `#7C3AED` | 보라 실선 | 글로우 그림자 추가 |

일반 칩은 neutral 계열, 흑백요리사 칩만 보라색 강조.

## Toast 시스템

| 유형 | 색상 | 메시지 예시 | 지속시간 |
|------|------|------------|---------|
| 성공 | 초록 | "✅ 이전 필터 불러옴" | 3초 |
| 성공 | 초록 | "📅 오늘의 메뉴로 저장했어요" | 3초 |
| 차단 | 빨강 | "🚫 음식과 관련 없는 질문은 답변할 수 없어요" | 3초 |
| 차단 | 빨강 | "🚫 200자 이내로 입력해주세요" | 3초 |
| 정보 | 파랑 | "💡 로컬 추천 모드로 전환" | 5초 |

## Accessibility

- 필터 칩: `role="checkbox"` + `aria-checked`
- 추천 결과: `aria-live="polite"` (결과 변경 시 스크린리더 알림)
- 키보드 네비게이션: 필터 간 Tab 이동, Enter로 선택
- 색상 대비: WCAG AA 기준 충족
- 언어 선택: `<select>` with `aria-label="언어 선택"`
