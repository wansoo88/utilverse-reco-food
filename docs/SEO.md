# SEO Optimization Guide

> `/seo-audit` 스킬이 감사 결과를 이 문서에 기록합니다.

## On-page SEO Rules

### Meta Tags (모든 페이지 필수)

```typescript
// src/components/seo/MetaTags.tsx
export interface PageMeta {
  title: string;        // 50-60자, 고유해야 함
  description: string;  // 150-160자, 고유해야 함
  canonical: string;    // 절대 URL
  ogImage?: string;     // 1200x630 권장
}
```

### Title 작성 규칙 (도구 사이트)
- 패턴: `[도구 이름] - [핵심 기능] | [사이트명]`
- 예시: `JSON Formatter - 온라인 JSON 정리 도구 | ToolBox`
- 50-60자 이내, 핵심 키워드를 앞에 배치

### Meta Description 규칙
- 패턴: `[도구 설명]. [주요 기능 나열]. 무료 온라인 [도구 유형].`
- 예시: `JSON 데이터를 보기 쉽게 정리하세요. 들여쓰기, 검증, 압축 기능 지원. 무료 온라인 JSON 포맷터.`
- 150-160자, 행동 유도 포함

## Heading Hierarchy

모든 페이지는 아래 규칙을 따릅니다:

```
H1: 페이지당 정확히 1개 (도구 이름 또는 페이지 제목)
  H2: 주요 섹션 (도구 사용법, 기능 설명, 관련 도구 등)
    H3: 소제목 (세부 기능, FAQ 항목 등)
```

- 헤딩 레벨을 건너뛰지 않음 (H1 → H3 금지)
- 도구 페이지 권장 H2 구조: 도구 사용법, 기능 설명, 자주 묻는 질문, 관련 도구

## Structured Data (JSON-LD)

### 도구 페이지

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "JSON Formatter",
  "description": "온라인 JSON 정리 도구",
  "url": "https://example.com/tools/json-formatter",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "KRW"
  }
}
```

### Breadcrumb

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "홈", "item": "https://example.com" },
    { "@type": "ListItem", "position": 2, "name": "개발 도구", "item": "https://example.com/categories/developer" },
    { "@type": "ListItem", "position": 3, "name": "JSON Formatter" }
  ]
}
```

## Technical SEO

### sitemap.xml
- `src/app/sitemap.ts`로 자동 생성
- 모든 도구 페이지, 카테고리 페이지 포함
- `lastmod`에 마지막 수정일 반영
- `changefreq`: 도구 페이지 `monthly`, 목록 `weekly`

### robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://example.com/sitemap.xml
```

### Canonical URLs
- 모든 페이지에 canonical URL 설정
- 쿼리 파라미터가 있는 URL도 canonical은 기본 경로로

## Content SEO (도구 사이트 특화)

### 도구 설명 콘텐츠
- 각 도구 페이지에 **300자 이상의 설명 텍스트** 포함 (에드센스 정책: 충분한 콘텐츠)
- 도구 사용법, 활용 사례, FAQ 섹션 구성
- 관련 키워드를 자연스럽게 포함

### Internal Linking
- 모든 도구 페이지에서 **관련 도구 2-3개** 링크
- 카테고리 페이지에서 모든 소속 도구로 링크
- 홈에서 인기 도구 + 전체 카테고리로 링크

### URL Structure
- 패턴: `/tools/[descriptive-slug]`
- 예시: `/tools/json-formatter`, `/tools/base64-encoder`
- 하이픈 구분, 소문자, 쿼리 파라미터 없음

## Social Sharing

### OpenGraph
```html
<meta property="og:title" content="JSON Formatter - 온라인 JSON 정리 도구" />
<meta property="og:description" content="JSON 데이터를 보기 쉽게 정리하세요." />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og/json-formatter.png" />
```

### Twitter Card
```html
<meta name="twitter:card" content="summary_large_image" />
```

## SEO Checklist (페이지 발행 전 확인)

- [ ] 고유한 title (50-60자)
- [ ] 고유한 meta description (150-160자)
- [ ] H1 태그 1개
- [ ] 헤딩 계층 올바름
- [ ] 모든 이미지에 alt 텍스트
- [ ] canonical URL 설정
- [ ] JSON-LD 구조화 데이터 포함
- [ ] OpenGraph + Twitter Card 메타 설정
- [ ] 관련 도구 내부 링크 2-3개
- [ ] 도구 설명 콘텐츠 300자 이상
- [ ] sitemap에 포함 확인

## Audit Results

_`/seo-audit` 스킬 실행 결과가 여기에 기록됩니다._

| 날짜 | 대상 | 점수 | 주요 이슈 |
|------|------|------|----------|
| — | — | — | — |
