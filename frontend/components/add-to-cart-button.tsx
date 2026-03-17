'use client';

import { LoaderCircle, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type AddToCartButtonProps = {
  productId: number;
  variationId?: number;
  quantity?: number;
  className?: string;
};

export function AddToCartButton({ productId, variationId, quantity = 1, className }: AddToCartButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleAdd() {
    setIsPending(true);
    try {
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, variation_id: variationId, quantity }),
      });
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={isPending}
      className={className ?? 'btn-primary w-full disabled:opacity-70'}
    >
      {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
      {isPending ? 'Ekleniyor...' : 'Sepete Ekle'}
    </button>
  );
}