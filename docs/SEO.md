# SEO Optimization Guide

> `/seo-audit` 스킬이 감사 결과를 이 문서에 기록합니다.

## SEO 전략 개요

**조회와 클릭이 잘 되는 구조**가 핵심입니다.
프로그래매틱 SEO로 30개+ 롱테일 키워드 페이지를 4개 언어로 생성하여 120개+ 인덱싱 가능 페이지를 확보합니다.

## On-page SEO Rules

### Meta Tags (모든 페이지 필수)

```typescript
interface PageMeta {
  title: string;        // 50-60자, 고유
  description: string;  // 150-160자, 고유
  canonical: string;    // 절대 URL
  ogImage?: string;     // 1200x630
  alternates: {         // 다국어 hreflang
    ko: string;
    en: string;
    ja: string;
    zh: string;
  };
}
```

### Title 작성 규칙

**홈페이지:**
- KO: `오늘 뭐 먹지? AI 음식 추천 | 오늘뭐먹지`
- EN: `What Should I Eat? AI Food Recommendation | WhatToEat`

**SEO 페이지 (패턴):**
- KO: `비오는날 혼밥 뭐 먹지? AI 추천 메뉴 TOP 5 | 오늘뭐먹지`
- EN: `Rainy Day Solo Meal Ideas - AI Picks | WhatToEat`

### Meta Description 규칙
- 행동 유도 + 키워드 포함
- 예: `비 오는 날 혼자 먹기 좋은 메뉴를 AI가 추천합니다. 흑백요리사 셰프 레시피부터 간단 자취 요리까지. 무료 AI 음식 추천.`

## 프로그래매틱 SEO

### URL 구조

```
/[lang]/eat/menu/[slug]

예시:
/ko/eat/menu/비오는날-혼밥-추천
/en/eat/menu/rainy-day-solo-meal
/ja/eat/menu/雨の日-一人-おすすめ
/zh/eat/menu/下雨天-一人-推荐
```

### 키워드 DB (30개+)

키워드 상세 목록은 `src/data/seoKeywords.ts`에 정의. 주요 카테고리:

| 카테고리 | 예시 slug | 검색 의도 |
|----------|-----------|----------|
| 날씨+가구 | `비오는날-혼밥-추천` | 상황형 |
| 시간+피로 | `야근후-간단한-저녁` | 시간 부족 |
| 건강 | `다이어트-점심-추천` | 건강식 |
| 트렌드 | `흑백요리사-레시피-추천` | 트렌드 |
| 예산 | `만원이하-저녁-추천` | 가성비 |
| 가족 | `아기-이유식-저녁` | 가족식 |
| 카테고리 | `파스타-종류별-추천` | 메뉴별 |

### SEO 페이지 구조

```
/[lang]/eat/menu/[slug]
├── H1: "비오는날 혼밥 뭐 먹지? AI 추천"
├── 메타 설명 (150-160자)
├── AI 프리셋 추천 결과 (ISR 빌드 타임 캐싱)
├── H2: "추천 메뉴"
│   └── 메인 1개 + 대안 3개 카드
├── H2: "유튜브 레시피"
│   └── 관련 유튜브 5개 임베드/링크
├── H2: "관련 추천"
│   └── 내부 링크 5-8개 (다른 키워드 페이지)
├── CTA: "직접 추천받으러 가기" → 홈
├── JSON-LD (Article + Recipe schema)
└── Footer + FooterAd
```

## Heading Hierarchy

```
H1: 페이지당 정확히 1개
  H2: 주요 섹션 (추천 결과, 유튜브 레시피, 관련 추천)
    H3: 소제목 (개별 메뉴명, FAQ 항목)
```

## Structured Data (JSON-LD)

### SEO 페이지 — Article + Recipe

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "비오는날 혼밥 뭐 먹지? AI 추천 메뉴 TOP 5",
  "author": { "@type": "Organization", "name": "오늘뭐먹지 by utilverse.net" },
  "datePublished": "2026-03-18",
  "description": "비 오는 날 혼자 먹기 좋은 메뉴 추천",
  "inLanguage": "ko"
}
```

### Breadcrumb

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://utilverse.net/ko" },
    { "@type": "ListItem", "position": 2, "name": "메뉴 추천", "item": "https://utilverse.net/ko/eat" },
    { "@type": "ListItem", "position": 3, "name": "비오는날 혼밥 추천" }
  ]
}
```

### WebApplication (홈페이지)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "오늘뭐먹지",
  "description": "AI가 추천하는 오늘의 메뉴",
  "url": "https://utilverse.net",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" }
}
```

## Technical SEO

### sitemap.xml 자동 생성

```typescript
// src/app/sitemap.ts
// 4개 언어 x 30개+ 키워드 = 120개+ URL 생성
export default async function sitemap() {
  const langs = ['ko', 'en', 'ja', 'zh'];
  const keywords = getSeoKeywords();
  const urls = [];

  // 홈페이지 (4개 언어)
  langs.forEach(lang => urls.push({ url: `/${lang}`, changeFrequency: 'daily', priority: 1.0 }));

  // SEO 페이지 (4 x 30+)
  keywords.forEach(kw => {
    langs.forEach(lang => {
      urls.push({
        url: `/${lang}/eat/menu/${kw.slugs[lang]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  return urls;
}
```

### robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://utilverse.net/sitemap.xml
```

### hreflang (다국어 SEO 핵심)

모든 페이지에 4개 언어 alternate 링크 설정:

```html
<link rel="alternate" hreflang="ko" href="https://utilverse.net/ko/eat/menu/비오는날-혼밥-추천" />
<link rel="alternate" hreflang="en" href="https://utilverse.net/en/eat/menu/rainy-day-solo-meal" />
<link rel="alternate" hreflang="ja" href="https://utilverse.net/ja/eat/menu/雨の日-一人-おすすめ" />
<link rel="alternate" hreflang="zh" href="https://utilverse.net/zh/eat/menu/下雨天-一人-推荐" />
<link rel="alternate" hreflang="x-default" href="https://utilverse.net/ko/eat/menu/비오는날-혼밥-추천" />
```

## Internal Linking 전략

- 모든 SEO 페이지에서 **관련 키워드 페이지 5-8개** 링크
- 홈페이지에서 인기 키워드 10개 링크
- SEO 페이지 하단 CTA → 홈페이지 (추천 UI)
- 키워드 간 관계: 날씨 → 날씨, 가구 → 가구, 크로스 링크

## Social Sharing

### OpenGraph
```html
<meta property="og:title" content="비오는날 혼밥 뭐 먹지? AI 추천" />
<meta property="og:description" content="비 오는 날 혼자 먹기 좋은 메뉴 AI 추천" />
<meta property="og:type" content="article" />
<meta property="og:image" content="/og/비오는날-혼밥.png" />
<meta property="og:locale" content="ko_KR" />
<meta property="og:locale:alternate" content="en_US" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
```

## SEO Checklist (페이지 발행 전)

- [ ] 고유한 title (50-60자)
- [ ] 고유한 meta description (150-160자)
- [ ] H1 태그 1개 (키워드 포함)
- [ ] hreflang 4개 언어 설정
- [ ] canonical URL 설정
- [ ] JSON-LD 구조화 데이터
- [ ] OpenGraph + Twitter Card
- [ ] 관련 페이지 내부 링크 5-8개
- [ ] 고유 콘텐츠 300자 이상
- [ ] sitemap에 포함 확인
- [ ] 이미지 alt 텍스트

## Audit Results

_`/seo-audit` 스킬 실행 결과가 여기에 기록됩니다._

| 날짜 | 대상 | 점수 | 주요 이슈 |
|------|------|------|----------|
| — | — | — | — |
