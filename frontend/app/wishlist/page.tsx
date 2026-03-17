'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';

import { ProductCard } from '@/components/product-card';
import type { Product } from '@/lib/data';

type WishlistResponse = {
  id: number;
  product: {
    id: number;
    slug: string;
    name: string;
    brand: string | null;
    category: string;
    price: string;
    discounted_price: string | null;
    current_price: string;
    stock_quantity: number;
    rating_average: string;
    review_count: number;
    badge_text: string;
    short_description: string;
    description: string;
    images: { image: string; alt_text: string; is_primary: boolean }[];
    variations: { variation_type: string; value: string; title: string }[];
    attributes: { attribute: string; value: string; display_value: string }[];
  };
  added_at: string;
}[];

function mapToProduct(item: WishlistResponse[number]): Product {
  const p = item.product;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand ?? 'AlbaniaShop',
    brandSlug: p.brand?.toLowerCase().replace(/\s+/g, '-') ?? '',
    category: p.category,
    price: Number(p.current_price),
    compareAtPrice: p.discounted_price ? Number(p.price) : undefined,
    rating: Number(p.rating_average || 0),
    reviewCount: p.review_count,
    stockLabel: p.stock_quantity > 0 ? 'Stokta' : 'Tükendi',
    badge: p.badge_text || undefined,
    urgency: '',
    description: p.description || p.short_description,
    bullets: [],
    colors: [],
    sizes: [],
    images: p.images.length ? p.images.map((img) => img.image) : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'],
  };
}

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetch('/api/wishlist', { cache: 'no-store' })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          setIsLoggedIn(false);
          return [];
        }
        return res.json();
      })
      .then((data: WishlistResponse) => {
        if (Array.isArray(data)) {
          setProducts(data.map(mapToProduct));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="container-main flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="container-main py-10">
        <div className="card p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-xl font-bold text-ink">Giriş Yapın</h2>
          <p className="mt-2 text-sm text-muted">Favorilerinizi görmek için giriş yapmanız gerekiyor.</p>
          <Link href="/account" className="btn-primary mt-5 inline-flex">Giriş Yap</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main space-y-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Favorilerim</h1>
          <p className="mt-1 text-sm text-muted">{products.length} ürün kaydedildi</p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-lg font-bold text-ink">Favorileriniz boş</h2>
          <p className="mt-2 text-sm text-muted">Beğendiğiniz ürünleri favorilere ekleyerek takip edin.</p>
          <Link href="/" className="btn-primary mt-4 inline-flex">Alışverişe Başla</Link>
        </div>
      )}
    </div>
  );
}