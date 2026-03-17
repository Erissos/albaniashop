import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['Cookie'] = `sessionid=${sessionId}`;

  const res = await fetch(`${API}/auth/profile/`, { headers, cache: 'no-store' });
  if (!res.ok) return NextResponse.json(null, { status: res.status });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
