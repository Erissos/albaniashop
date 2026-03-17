import Link from 'next/link';
import { Search } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { getSearchResults } from '@/lib/api';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? '';
  const results = await getSearchResults(query);

  return (
    <div className="container-main space-y-6 py-6">
      <div>
        <h1 className="text-xl font-bold text-ink">
          &ldquo;{query || 'tüm ürünler'}&rdquo; için sonuçlar
        </h1>
        <p className="mt-1 text-sm text-muted">{results.length} ürün bulundu</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Önerilen', 'Hızlı Teslimat', 'Kampanyalı', 'Yüksek Puan', '100 TL Altı'].map((chip) => (
          <button key={chip} className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-muted transition hover:border-primary hover:text-primary">
            {chip}
          </button>
        ))}
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