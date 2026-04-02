import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

async function forward(req: NextRequest, method: 'GET' | 'PATCH') {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['Cookie'] = `sessionid=${sessionId}`;

  const res = await fetch(`${API}/auth/profile/`, {
    method,
    headers,
    body: method === 'PATCH' ? await req.text() : undefined,
    cache: 'no-store',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    return NextResponse.json(errorData, { status: res.status });
  }
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) {
  return forward(req, 'GET');
}

export async function PATCH(req: NextRequest) {
  return forward(req, 'PATCH');
}
