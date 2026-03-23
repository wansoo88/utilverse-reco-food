import { NextRequest, NextResponse } from 'next/server';
import { getUsageSummary, clearUsage } from '@/lib/usageTracker';
import { isAdminAuthorized } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(getUsageSummary());
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  clearUsage();
  return NextResponse.json({ ok: true });
}
