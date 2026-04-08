import { NextRequest, NextResponse } from 'next/server';
import { getUsageSummary, clearUsage } from '@/lib/usageTracker';
import { isAdminAuthorized } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') ? Number(searchParams.get('from')) : undefined;
  const to = searchParams.get('to') ? Number(searchParams.get('to')) : undefined;
  return NextResponse.json(getUsageSummary(from, to));
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  clearUsage();
  return NextResponse.json({ ok: true });
}
