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

  const res = await fetch(`${API}/wishlist/`, init);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function GET(req: NextRequest) { return forward(req, 'GET'); }
export async function POST(req: NextRequest) { return forward(req, 'POST'); }
export async function DELETE(req: NextRequest) { return forward(req, 'DELETE'); }
