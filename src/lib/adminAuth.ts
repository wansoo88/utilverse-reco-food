import { NextRequest } from 'next/server';

const ADMIN_ID = process.env.ADMIN_ID ?? 'kimcomplete';
export const ADMIN_SESSION_TOKEN = `${ADMIN_ID}:verified`;

export function isAdminAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')?.value;
  return cookie === ADMIN_SESSION_TOKEN;
}
