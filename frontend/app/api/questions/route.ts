import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

async function forward(request: NextRequest, method: 'GET' | 'POST') {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (sessionId) headers['Cookie'] = `sessionid=${sessionId}`;

  const response = await fetch(`${API}/auth/questions/`, {
    method,
    headers,
    body: method === 'POST' ? await request.text() : undefined,
    cache: 'no-store',
  });

  const data = await response.json().catch(() => (method === 'GET' ? [] : {}));
  return NextResponse.json(data, { status: response.status });
}

export async function GET(request: NextRequest) {
  return forward(request, 'GET');
}

export async function POST(request: NextRequest) {
  return forward(request, 'POST');
}