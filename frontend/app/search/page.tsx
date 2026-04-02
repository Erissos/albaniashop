import Link from 'next/link';
import { Search } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { getLiveProducts, getSearchResults } from '@/lib/api';

type SearchPageParams = {
  q?: string;
  is_featured?: string;
  ordering?: string;
  has_discount?: string;
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchPageParams> }) {
  const params = await searchParams;
  const query = params.q ?? '';
  const filters = new URLSearchParams();

  if (params.is_featured === 'true') {
    filters.set('is_featured', 'true');
  }

  if (params.ordering) {
    filters.set('ordering', params.ordering);
  }

  const baseResults = query.trim()
    ? await getSearchResults(query)
    : await getLiveProducts(filters.toString());

  const results = params.has_discount === 'true'
    ? baseResults.filter((product) => Boolean(product.compareAtPrice))
    : baseResults;

  const heading = query.trim()
    ? `“${query}” için sonuçlar`
    : params.is_featured === 'true'
      ? 'Öne çıkan ürünler'
      : params.ordering === '-created_at'
        ? 'Yeni gelen ürünler'
        : params.has_discount === 'true'
          ? 'İndirimli ürünler'
          : 'Tüm ürünler';

  return (
    <div className="container-main space-y-6 py-6">
      <div>
        <h1 className="text-xl font-bold text-ink">{heading}</h1>
        <p className="mt-1 text-sm text-muted">{results.length} ürün bulundu</p>
      </div>
      <div className="rounded-card border border-border bg-surface px-4 py-3 text-sm text-muted">
        Sonuçlar mağazadaki canlı ürün verilerinden listelenir. Arama terimini değiştirerek veya kategoriler üzerinden gezinerek farklı ürünlere ulaşabilirsiniz.
      </div>

      {results.length ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <Search className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-lg font-bold text-ink">Sonuç bulunamadı</h2>
          <p className="mt-2 text-sm text-muted">Farklı bir arama terimi deneyin veya kategorilere göz atın.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Ana Sayfa</Link>
        </div>
      )}
    </div>
  );
}