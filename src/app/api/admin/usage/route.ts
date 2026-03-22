import { NextRequest, NextResponse } from 'next/server';
import { getUsageSummary, clearUsage } from '@/lib/usageTracker';

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookie = req.cookies.get('admin_session')?.value;
  const header = req.headers.get('x-admin-secret');
  return cookie === secret || header === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(getUsageSummary());
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  clearUsage();
  return NextResponse.json({ ok: true });
}
