import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';

import { AddToCartButton } from '@/components/add-to-cart-button';
import { WishlistButton } from '@/components/wishlist-button';
import { Product, formatLek } from '@/lib/data';

type ProductCardProps = {
  product: Product;
  onWishlistChange?: (added: boolean, productId: number) => void;
};

export function ProductCard({ product, onWishlistChange }: ProductCardProps) {
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  const brandSlug = product.brandSlug || product.brand.toLowerCase().replace(/\s+/g, '-');

  return (
    <article className="group card flex flex-col overflow-hidden transition hover:shadow-elevated">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount ? (
            <span className="badge-sale">%{discount}</span>
          ) : null}
          {product.badge ? (
            <span className="badge-primary">{product.badge}</span>
          ) : null}
        </div>

        {/* Wishlist button */}
        <WishlistButton
          productId={product.id}
          initialAdded={Boolean(product.isWishlisted)}
          {...(onWishlistChange
            ? { onChange: (added: boolean) => onWishlistChange(added, product.id) }
            : {})}
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/brand/${brandSlug}`} className="text-xs font-medium text-muted hover:text-primary transition">{product.brand}</Link>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium text-ink transition hover:text-primary"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-star text-star" />
          <span className="font-medium text-ink">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{formatLek(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-sm text-muted line-through">{formatLek(product.compareAtPrice)}</span>
          ) : null}
        </div>

        {/* Urgency */}
        {product.urgency ? (
          <p className="text-xs text-success font-medium">{product.urgency}</p>
        ) : null}

        {/* CTA */}
        <AddToCartButton
          productId={product.id}
          className="mt-1 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-primary bg-white text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
        />
      </div>
    </article>
  );
}