import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { LOCALES, DEFAULT_LOCALE } from '@/config/site';

// ─── Rate Limiting ──────────────────────────────────────────────────────────
// AI API를 소모하는 엔드포인트에 IP당 10 req/min
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;
// 컨테이너 장기 실행 시 만료된 IP 엔트리 누적 방지 — 호출 시 lazy GC
const GC_THRESHOLD = 500;

const RATE_LIMITED_PATHS = new Set([
  '/api/recommend',
  '/api/kpop-recommend',
  '/api/nearby',
  '/api/recipes',
]);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // Map 크기가 임계값 초과 시 만료된 엔트리 일괄 삭제 (Vercel cold-start 사이 누수 방어)
  if (rateLimitStore.size > GC_THRESHOLD) {
    for (const [key, value] of rateLimitStore) {
      if (now > value.resetAt) rateLimitStore.delete(key);
    }
  }

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

// ─── Locale Detection ───────────────────────────────────────────────────────
// Accept-Language 헤더에서 지원 로케일 추출
// 지원되지 않는 언어는 영어(en)로 폴백
const LOCALE_SET = new Set<string>(LOCALES);

function detectLocale(req: NextRequest): string {
  const acceptLang = req.headers.get('accept-language') ?? '';
  const langs = acceptLang.split(',').map((l) => l.split(';')[0].trim().toLowerCase());

  for (const lang of langs) {
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('zh')) return 'zh';
    if (lang.startsWith('en')) return 'en';
  }
  // 지원되지 않는 국가/언어 → 영어권으로 처리
  return 'en';
}

// ─── Intl Middleware ────────────────────────────────────────────────────────
const intlMiddleware = createIntlMiddleware(routing);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. API rate limiting — intl 미들웨어 우선 처리
  if (RATE_LIMITED_PATHS.has(pathname)) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }
    return NextResponse.next();
  }

  // 2. 모든 API 경로 + admin 페이지 — intl 미들웨어 우회
  if (pathname.startsWith('/api/') || pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.next();
  }

  // 3. 언어 자동감지 — 처음 방문자가 루트(/) 또는 로케일 없는 경로에 접근할 때
  //    NEXT_LOCALE 쿠키가 없으면 Accept-Language 기반 자동 리다이렉트
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  const localeCookie = req.cookies.get('NEXT_LOCALE')?.value;
  const hasValidCookie = localeCookie && LOCALE_SET.has(localeCookie);

  if (!hasLocalePrefix && !hasValidCookie) {
    const detected = detectLocale(req);
    // 기본 로케일(ko)이면 그대로 진행, 아니면 해당 언어 경로로 리다이렉트
    if (detected !== DEFAULT_LOCALE) {
      const newUrl = req.nextUrl.clone();
      newUrl.pathname = `/${detected}${pathname === '/' ? '' : pathname}`;
      const response = NextResponse.redirect(newUrl);
      // 1년 유효 쿠키로 재방문 시 재감지 방지
      response.cookies.set('NEXT_LOCALE', detected, {
        path: '/',
        maxAge: 31_536_000,
        sameSite: 'lax',
      });
      return response;
    }
  }

  // 4. next-intl 미들웨어: 로케일 라우팅 처리
  return intlMiddleware(req);
}

export const config = {
  // API 경로 + 정적 파일/이미지 제외한 모든 페이지 경로
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)',
  ],
};
