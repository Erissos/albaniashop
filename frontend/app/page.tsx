import Link from 'next/link';
import { ArrowRight, Clock, Package, ShoppingBag, Star, Users } from 'lucide-react';

import { CategoryIcon } from '@/components/category-icon';
import { HeroSection } from '@/components/hero-section';
import { ProductCard } from '@/components/product-card';
import { ReviewStrip } from '@/components/review-strip';
import { SectionHeading } from '@/components/section-heading';
import { getLiveCategories, getLiveFeaturedProducts, getLiveNewArrivals } from '@/lib/api';

export default async function HomePage() {
  const [categories, featuredProducts, newArrivals] = await Promise.all([
    getLiveCategories(),
    getLiveFeaturedProducts(),
    getLiveNewArrivals(),
  ]);

  return (
    <div className="space-y-10 pb-8">
      <HeroSection />

      {/* Category Grid */}
      <section className="container-main">
        <SectionHeading title="Kategoriler" action={<Link href="/search" className="text-sm font-semibold text-primary hover:underline">Tüm Ürünler</Link>} />
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-card p-3 text-center transition hover:bg-primary-light"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-primary transition group-hover:bg-primary-light">
                <CategoryIcon slug={category.slug} className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-ink">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Deals Banner */}
      <section className="container-main">
        <div className="flex items-center justify-between rounded-card bg-ink px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Flaş İndirimler</h3>
              <p className="text-xs text-white/60">Sınırlı süre, kaçırma!</p>
            </div>
          </div>
          <Link href="/search?has_discount=true" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Tümünü Gör <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container-main">
        <SectionHeading
          title="Öne Çıkan Ürünler"
          action={<Link href="/search?is_featured=true" className="text-sm font-semibold text-primary hover:underline">Tümünü Gör</Link>}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container-main">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Package, value: `${featuredProducts.length + newArrivals.length}+`, label: 'Ürün çeşidi' },
            { icon: Users, value: `${categories.length}`, label: 'Kategori' },
            { icon: ShoppingBag, value: 'Hızlı', label: 'Kargo (1-3 gün)' },
            { icon: Star, value: '4.7/5', label: 'Ortalama puan' },
          ].map((stat) => (
            <div key={stat.label} className="card flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-ink">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-main">
        <SectionHeading
          title="Yeni Gelenler"
          action={<Link href="/search?ordering=-created_at" className="text-sm font-semibold text-primary hover:underline">Tümünü Gör</Link>}
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="container-main">
        <SectionHeading title="Müşteri Yorumları" />
        <ReviewStrip />
      </section>
    </div>
  );
}