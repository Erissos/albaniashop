import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const sessionId = request.cookies.get('sessionid')?.value;

  const response = await fetch(`${API_BASE_URL}/cart/add/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionId ? { Cookie: `sessionid=${sessionId}` } : {}),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();
  const nextResponse = NextResponse.json(data, { status: response.status });
  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.set('set-cookie', setCookie);
  }

  return nextResponse;
}