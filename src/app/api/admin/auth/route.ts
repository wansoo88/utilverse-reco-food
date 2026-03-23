import { NextRequest, NextResponse } from 'next/server';

const ADMIN_ID = process.env.ADMIN_ID ?? 'kimcomplete';
const ADMIN_PW = process.env.ADMIN_PW ?? '!rla121314';
const SESSION_TOKEN = `${ADMIN_ID}:verified`;

export async function POST(req: NextRequest) {
  const { id, pw } = await req.json() as { id?: string; pw?: string };

  if (id !== ADMIN_ID || pw !== ADMIN_PW) {
    return NextResponse.json({ error: '아이디 또는 비밀번호가 틀렸습니다.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_session', SESSION_TOKEN, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 8, // 8시간
    path: '/',
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('admin_session');
  return res;
}
