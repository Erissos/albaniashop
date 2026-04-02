import Link from 'next/link';
import { Star } from 'lucide-react';

import { getLiveFeaturedReviews } from '@/lib/api';

export async function ReviewStrip() {
  const liveReviews = await getLiveFeaturedReviews();

  if (liveReviews.length > 0) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {liveReviews.slice(0, 3).map((review) => (
          <article key={review.id} className="card p-5">
            <div className="flex items-center gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-star text-star" />
              ))}
            </div>
            {review.title && <p className="mt-2 text-sm font-medium text-ink">{review.title}</p>}
            <p className="mt-2 text-sm leading-6 text-muted">{review.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">{review.user_name}</p>
              <Link href={`/product/${review.product_slug}`} className="text-xs text-primary hover:underline">
                {review.product_name}
              </Link>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6 text-center">
      <p className="text-sm font-medium text-ink">Henüz gerçek müşteri yorumu yok.</p>
      <p className="mt-2 text-sm text-muted">İlk yorumu bırakan müşteriler burada görünecek.</p>
    </div>
  );
}