import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductCard } from '@/components/product-card';
import { getLiveCategories, getLiveCategory, getLiveCategoryProducts } from '@/lib/api';

export async function generateStaticParams() {
  const categories = await getLiveCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getLiveCategory(slug), getLiveCategoryProducts(slug)]);
  if (!category) notFound();

  return (
    <div className="container-main space-y-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="transition hover:text-primary">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink">{category.name}</span>
      </nav>

      {/* Header */}
      <div className="rounded-card bg-surface p-6">
        <h1 className="text-2xl font-bold text-ink md:text-3xl">{category.name}</h1>
        <p className="mt-2 text-sm text-muted">{category.description}</p>
        <p className="mt-1 text-sm text-muted">{products.length} ürün bulundu</p>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar />
        <div>
          {/* Sort chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {['En Çok Satan', 'En Yeniler', 'Fiyat (Artan)', 'Fiyat (Azalan)', 'En Çok Değerlendirilen'].map((chip) => (
              <button key={chip} className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted transition hover:border-primary hover:text-primary">
                {chip}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}