# Backend Development Guide

> `/adsense-setup` 스킬이 API 라우트 추가 시 이 문서를 업데이트합니다.

## API Routes (Route Handlers)

Next.js App Router의 Route Handler 패턴을 사용합니다.

```
src/app/api/
├── tools/
│   └── [slug]/route.ts     # 도구 데이터 API (GET)
├── sitemap/route.ts         # 동적 사이트맵 생성
└── revalidate/route.ts      # ISR 수동 재검증 (POST)
```

### Route Handler 작성 규칙

- `GET` 핸들러에는 적절한 `Cache-Control` 헤더 설정
- 에러 응답은 표준 형식 사용: `{ error: string, code: number }`
- 인증이 필요한 라우트에서는 광고를 제공하지 않음

## Data Sources

### 도구 메타데이터
- `src/data/tools.ts`에 도구 목록 정의 (정적 데이터)
- 각 도구: `{ slug, title, description, category, icon, component }`

### 콘텐츠 관리
- MDX 기반 도구 설명 & 가이드 콘텐츠
- `content/tools/[slug].mdx` 경로에 저장
- `@next/mdx` 또는 `contentlayer`로 처리

## Caching Strategy

| 대상 | Cache-Control | ISR Revalidation | 비고 |
|------|--------------|-------------------|------|
| 도구 페이지 | `s-maxage=86400` | 24시간 | 도구 로직은 변경 빈도 낮음 |
| 도구 목록 | `s-maxage=3600` | 1시간 | 새 도구 추가 반영 |
| 정적 자산 | `max-age=31536000` | N/A | immutable |
| API 응답 | `s-maxage=600` | N/A | 10분 |

## Environment Variables

| 변수 | 필수 | 설명 |
|------|------|------|
| `NEXT_PUBLIC_ADSENSE_PUB_ID` | ✅ | AdSense 퍼블리셔 ID (ca-pub-XXX) |
| `NEXT_PUBLIC_GA_ID` | ✅ | Google Analytics 4 측정 ID |
| `NEXT_PUBLIC_SITE_URL` | ✅ | 프로덕션 사이트 URL |
| `REVALIDATION_SECRET` | ⬜ | ISR 수동 재검증 시크릿 |

## Error Handling

- **에러 페이지에 광고 컴포넌트 import 금지** (정책 위반)
- `src/app/not-found.tsx`: 광고 없이 도구 추천 링크만 제공
- `src/app/error.tsx`: 광고 없이 재시도 버튼 제공
- API 에러는 적절한 HTTP 상태 코드 반환

## Security: CSP Headers

AdSense가 동작하려면 CSP에 다음 도메인을 허용해야 합니다:

```typescript
// next.config.ts
const cspDirectives = {
  'script-src': ["'self'", 'https://pagead2.googlesyndication.com', 'https://www.googletagservices.com'],
  'frame-src': ["'self'", 'https://googleads.g.doubleclick.net', 'https://tpc.googlesyndication.com'],
  'img-src': ["'self'", 'https://pagead2.googlesyndication.com', 'data:'],
};
```

## Registered API Routes

_도구 API가 추가되면 여기에 기록됩니다._

| Route | Method | 설명 | 추가일 |
|-------|--------|------|--------|
| — | — | — | — |
