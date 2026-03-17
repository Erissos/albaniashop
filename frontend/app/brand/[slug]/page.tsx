import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import { getLiveBrand, getLiveBrandProducts, getLiveBrands } from '@/lib/api';

export async function generateStaticParams() {
  const brands = await getLiveBrands();
  return brands.map((b) => ({ slug: b.slug }));
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [brand, products] = await Promise.all([getLiveBrand(slug), getLiveBrandProducts(slug)]);
  if (!brand) notFound();

  return (
    <div className="container-main space-y-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="transition hover:text-primary">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink">{brand.name}</span>
      </nav>

      {/* Header */}
      <div className="rounded-card bg-surface p-6">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">{brand.name}</h1>
        {brand.description && <p className="mt-2 text-sm text-muted">{brand.description}</p>}
        <p className="mt-1 text-sm text-muted">{products.length} ürün bulundu</p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <h2 className="text-lg font-bold text-ink">Henüz ürün yok</h2>
          <p className="mt-2 text-sm text-muted">Bu markaya ait ürün bulunamadı.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Ana Sayfa</Link>
        </div>
      )}
    </div>
  );
}
