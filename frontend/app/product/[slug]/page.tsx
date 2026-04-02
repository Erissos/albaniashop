import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronRight, CreditCard, Headset, ShieldCheck, Star, Truck } from 'lucide-react';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductCard } from '@/components/product-card';
import { ProductGallery } from '@/components/product-gallery';
import { ProductQuestionForm } from '@/components/product-question-form';
import { SectionHeading } from '@/components/section-heading';
import { WishlistButton } from '@/components/wishlist-button';
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
  const keyFacts = (product.attributeRows ?? []).slice(0, 4);
  const detailGroups = product.detailGroups ?? [];
  const variationGroups = product.variationGroups ?? [];
  const descriptionParagraphs = product.description.split(/\n+/).filter(Boolean);

  return (
    <div className="container-main space-y-8 py-6">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link href="/" className="transition hover:text-primary">Ana Sayfa</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/category/${product.categorySlug || product.category}`} className="transition hover:text-primary">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,540px)_280px] xl:items-start">
        <ProductGallery images={product.images} alt={product.name} />

        <section className="space-y-5">
          <div className="rounded-card border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/brand/${product.brandSlug || product.brand.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold text-primary hover:underline">
                {product.brand}
              </Link>
              {product.badge ? <span className="badge-primary">{product.badge}</span> : null}
              {discount ? <span className="badge-sale">%{discount} indirim</span> : null}
            </div>

            <h1 className="mt-3 text-2xl font-black leading-tight text-ink md:text-[2rem]">{product.name}</h1>
            {product.shortDescription ? <p className="mt-3 text-sm leading-6 text-muted">{product.shortDescription}</p> : null}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 font-semibold text-warning-dark">
                <Star className="h-4 w-4 fill-star text-star" />
                {product.rating.toFixed(1)}
              </div>
              <span className="text-muted">{product.reviewCount} değerlendirme</span>
              <span className="text-muted">|</span>
              <span className="font-medium text-success">{product.stockLabel}</span>
            </div>

            <div className="mt-5 rounded-3xl bg-surface p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black text-ink">{formatLek(product.price)}</span>
                {product.compareAtPrice ? <span className="text-base text-muted line-through">{formatLek(product.compareAtPrice)}</span> : null}
              </div>
              <p className="mt-2 text-sm font-medium text-success">{product.urgency}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted">Tahmini teslimat</p>
                  <p className="mt-1 font-semibold text-ink">1-3 iş günü</p>
                </div>
                <div className="rounded-2xl border border-white bg-white px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-wide text-muted">Ödeme seçeneği</p>
                  <p className="mt-1 font-semibold text-ink">Kart ve kapıda ödeme</p>
                </div>
              </div>
            </div>

            {variationGroups.length ? (
              <div className="mt-5 space-y-4">
                {variationGroups.map((group) => (
                  <div key={group.name}>
                    <p className="mb-2 text-sm font-semibold text-ink">{group.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.values.map((value) => (
                        <span key={`${group.name}-${value}`} className="rounded-xl border border-border px-3 py-2 text-sm text-muted">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {keyFacts.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {keyFacts.map((item) => (
                  <div key={`${item.label}-${item.value}`} className="rounded-2xl border border-border p-4">
                    <p className="text-xs uppercase tracking-wide text-muted">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <AddToCartButton productId={product.id} className="btn-primary w-full justify-center text-base" />
              <WishlistButton
                productId={product.id}
                initialAdded={Boolean(product.isWishlisted)}
                className="btn-secondary justify-center px-5"
                activeClassName="btn-secondary justify-center border-danger/30 bg-danger/5 px-5 text-danger"
                iconClassName="h-4 w-4"
                pendingClassName="opacity-70"
                label="Kaydet"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-card border border-border bg-white p-4 text-sm shadow-soft">
              <Truck className="h-4 w-4 text-primary" />
              <p className="mt-3 font-semibold text-ink">Hızlı Teslimat</p>
              <p className="mt-1 leading-6 text-muted">Seçili şehirlerde aynı gün veya ertesi gün teslimat.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-4 text-sm shadow-soft">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="mt-3 font-semibold text-ink">Güvenli Alışveriş</p>
              <p className="mt-1 leading-6 text-muted">Onaylı ödeme akışı ve 14 gün iade güvencesi.</p>
            </div>
            <div className="rounded-card border border-border bg-white p-4 text-sm shadow-soft">
              <CreditCard className="h-4 w-4 text-primary" />
              <p className="mt-3 font-semibold text-ink">Taksit Seçenekleri</p>
              <p className="mt-1 leading-6 text-muted">Kart kampanyalarına göre esnek ödeme planları.</p>
            </div>
          </div>
        </section>

        <aside className="space-y-4 xl:sticky xl:top-28">
          <div className="rounded-card border border-border bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Premium</p>
            <p className="mt-2 text-lg font-bold text-ink">Alışveriş avantajlarını artırın</p>
            <p className="mt-2 text-sm leading-6 text-muted">Öncelikli destek, kampanya erişimi ve özel teslimat seçenekleriyle deneyimi güçlendirin.</p>
          </div>

          <div className="rounded-card border border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-ink">Satın alma güvencesi</p>
            <div className="mt-4 space-y-3 text-sm text-muted">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Orijinal ürün ve doğrulanmış tedarik akışı</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>İade ve değişim süreçleri hesap panelinizden yönetilir</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>Kargo ve sipariş bildirimleri adım adım izlenir</span>
              </div>
            </div>
          </div>

          <div className="rounded-card border border-border bg-white p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <Headset className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-ink">Sorunuz mu var?</p>
                <p className="mt-1 text-sm leading-6 text-muted">Aşağıdaki formdan ürünle ilgili soruyu hemen iletebilir, yanıtları hesabınızdan takip edebilirsiniz.</p>
                <Link href="#product-question-form" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
                  Soru formuna git
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-card border border-border bg-white p-6 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Ürün Açıklaması</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {product.bullets.length ? (
            <div className="mt-6 rounded-3xl bg-surface p-5">
              <p className="text-sm font-semibold text-ink">Öne Çıkan Noktalar</p>
              <ul className="mt-4 space-y-3">
                {product.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-card border border-border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold text-ink">Değerlendirmeler</h2>
            {liveReviews.length > 0 ? (
              <div className="mt-4 space-y-4">
                {liveReviews.map((review) => (
                  <div key={review.id} className="rounded-2xl bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">{review.user_name}</p>
                        <p className="text-xs text-muted">{new Date(review.created_at).toLocaleDateString('tr-TR')}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-ink">
                        <Star className="h-3.5 w-3.5 fill-star text-star" />
                        {review.rating}
                      </div>
                    </div>
                    {review.title ? <p className="mt-3 text-sm font-semibold text-ink">{review.title}</p> : null}
                    <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted">Henüz değerlendirme yapılmamış.</p>
            )}
          </div>

          <div id="product-question-form">
            <ProductQuestionForm productId={product.id} productName={product.name} />
          </div>
        </div>
      </section>

      {detailGroups.length ? (
        <section className="space-y-4">
          <SectionHeading title="Ürün Detayları" />
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {detailGroups.map((group) => (
              <div key={group.title} className="rounded-card border border-border bg-white p-5 shadow-soft">
                <h3 className="text-base font-bold text-ink">{group.title}</h3>
                <div className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <div key={`${group.title}-${item.label}-${item.value}`} className="grid grid-cols-[120px_1fr] gap-3 rounded-2xl bg-surface px-4 py-3 text-sm">
                      <span className="text-muted">{item.label}</span>
                      <span className="font-medium text-ink">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

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