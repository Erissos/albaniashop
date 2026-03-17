import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

async function forward(req: NextRequest, method: string) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['Cookie'] = `sessionid=${sessionId}`;

  const init: RequestInit = { method, headers, cache: 'no-store' };
  if (method !== 'GET') init.body = await req.text();

  const path = req.nextUrl.pathname.replace('/api/auth/', '');
  const res = await fetch(`${API}/auth/${path}/`, init);
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) { return forward(req, 'POST'); }
