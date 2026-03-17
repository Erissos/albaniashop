import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  const response = await fetch(`${API_BASE_URL}/catalog/products/?search=${encodeURIComponent(query)}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json([], { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(Array.isArray(data) ? data : data.results ?? []);
}