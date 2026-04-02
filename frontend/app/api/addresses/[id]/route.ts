import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

async function forward(request: NextRequest, id: string, method: 'PATCH' | 'DELETE') {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionid')?.value;
  const headers: Record<string, string> = {};

  if (method === 'PATCH') {
    headers['Content-Type'] = 'application/json';
  }

  if (sessionId) {
    headers['Cookie'] = `sessionid=${sessionId}`;
  }

  const response = await fetch(`${API}/addresses/${id}/`, {
    method,
    headers,
    body: method === 'PATCH' ? await request.text() : undefined,
    cache: 'no-store',
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forward(request, id, 'PATCH');
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return forward(request, id, 'DELETE');
}