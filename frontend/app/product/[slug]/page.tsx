import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronRight, Heart, ShieldCheck, Star, Truck } from 'lucide-react';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductCard } from '@/components/product-card';
import { ProductGallery } from '@/components/product-gallery';
import { SectionHeading } from '@/components/section-heading';
import { getLiveFeaturedProducts, getLiveProduct, getLiveProductReviews } from '@/lib/api';
import { formatLek, products } from '@/lib/data';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getLiveProduct(slug);
  if (!product) notFound();
  const [featuredProducts, liveReviews] = await Promise.all([
    getLiveFeaturedProducts(),
    getLiveProductReviews(slug),
  ]);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="container-main space-y-10 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted">
        <Link href="/" className="transition hover:text-primary">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/category/${product.category}`} className="transition hover:text-primary">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      {/* Product */}
      <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <ProductGallery images={product.images} alt={product.name} />

        <aside className="card p-6 lg:sticky lg:top-28">
          <div className="space-y-4">
            {/* Brand & badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/brand/${product.brandSlug || product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-primary hover:underline">{product.brand}</Link>
              {product.badge ? <span className="badge-primary">{product.badge}</span> : null}
            </div>

            {/* Title */}
            <h1 className="text-xl font-bold text-ink md:text-2xl">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-0.5">
                <Star className="h-4 w-4 fill-star text-star" />
                <span className="font-semibold text-ink">{product.rating}</span>
              </div>
              <span className="text-muted">({product.reviewCount} değerlendirme)</span>
              <span className="text-muted">|</span>
              <span className="text-success font-medium">{product.stockLabel}</span>
            </div>

            {/* Price */}
            <div className="rounded-card bg-surface p-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-primary">{formatLek(product.price)}</span>
                {product.compareAtPrice ? (
                  <>
                    <span className="text-base text-muted line-through">{formatLek(product.compareAtPrice)}</span>
                    <span className="badge-sale">%{discount}</span>
                  </>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-success font-medium">{product.urgency}</p>
            </div>

            {/* Colors */}
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Renk</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button key={color} className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted transition hover:border-primary hover:text-primary">
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="mb-2 text-sm font-semibold text-ink">Beden / Boyut</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button key={size} className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted transition hover:border-primary hover:text-primary">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid gap-3 sm:grid-cols-2">
              <AddToCartButton productId={product.id} className="btn-primary w-full" />
              <Link href="/wishlist" className="btn-secondary w-full">
                <Heart className="h-4 w-4" />
                Favorilere Ekle
              </Link>
            </div>

            {/* Trust signals */}
            <div className="space-y-2 rounded-card border border-border p-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Truck className="h-4 w-4 text-primary" />
                <span>Hızlı kargo ile 1-3 iş gününde kapınızda</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Güvenli ödeme</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted">
                <Check className="h-4 w-4 text-primary" />
                <span>14 gün koşulsuz iade garantisi</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Specs */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-ink">Ürün Özellikleri</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{product.description}</p>
          <ul className="mt-4 space-y-2">
            {product.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-bold text-ink">Değerlendirmeler</h2>
          {liveReviews.length > 0 ? (
            <div className="mt-4 space-y-4">
              {liveReviews.map((review) => (
                <div key={review.id} className="rounded-lg bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">{review.user_name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-star text-star" />
                      <span className="text-sm font-medium text-ink">{review.rating}</span>
                    </div>
                  </div>
                  {review.title && <p className="mt-1 text-sm font-medium text-ink">{review.title}</p>}
                  <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Henüz değerlendirme yapılmamış.</p>
          )}
        </div>
      </section>

      {/* Recommendations */}
      <section>
        <SectionHeading title="Benzer Ürünler" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {featuredProducts.slice(0, 4).map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}