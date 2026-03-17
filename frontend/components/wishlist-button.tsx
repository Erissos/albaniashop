'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

type Props = {
  productId: number;
};

export function WishlistButton({ productId }: Props) {
  const [added, setAdded] = useState(false);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    try {
      const method = added ? 'DELETE' : 'POST';
      const res = await fetch('/api/wishlist', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok || res.status === 200 || res.status === 201) {
        setAdded(!added);
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-soft transition ${added ? 'text-danger' : 'text-muted hover:text-danger'}`}
      aria-label={added ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart className={`h-4 w-4 ${added ? 'fill-danger' : ''}`} />
    </button>
  );
}
