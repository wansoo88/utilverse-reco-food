import { NextRequest, NextResponse } from 'next/server';

// Rate Limiting: AI API를 소모하는 엔드포인트에 IP당 10 req/min
// 단일 Edge 인스턴스 내 메모리 기반 (Vercel 환경에서 인스턴스별 동작)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = 10;        // 최대 요청 수
const WINDOW_MS = 60_000;     // 1분 윈도우

// Rate limit이 적용될 경로
const RATE_LIMITED_PATHS = new Set([
  '/api/recommend',
  '/api/kpop-recommend',
  '/api/nearby',
  '/api/recipes',
]);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

export function middleware(req: NextRequest) {
  if (RATE_LIMITED_PATHS.has(req.nextUrl.pathname)) {
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': '60' } },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
