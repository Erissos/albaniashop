'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

type SearchResult = {
  id: number;
  slug: string;
  name: string;
  brand: string | null;
};

export function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { cache: 'no-store' });
      if (!response.ok) {
        setResults([]);
        return;
      }
      const data = (await response.json()) as Array<{ id: number; slug: string; name: string; brand: string | null }>;
      setResults(data.slice(0, 5));
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex h-11 items-center gap-3 rounded-lg border border-border bg-surface px-4">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
          placeholder="Ürün, kategori veya marka ara"
        />
        <button className="shrink-0 rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-dark">
          Ara
        </button>
      </div>
      {results.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 rounded-card border border-border bg-white p-2 shadow-elevated">
          {results.map((result) => (
            <Link
              key={result.slug}
              href={`/product/${result.slug}`}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-surface"
            >
              <div>
                <p className="text-sm font-medium text-ink">{result.name}</p>
                <p className="text-xs text-muted">{result.brand ?? 'AlbaniaShop'}</p>
              </div>
              <span className="text-xs font-semibold text-primary">Görüntüle</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}