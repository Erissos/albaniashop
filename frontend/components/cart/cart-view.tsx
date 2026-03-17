'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type CartResponse } from '@/lib/api';
import { formatLek, products } from '@/lib/data';

export function CartView() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshCart() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', { cache: 'no-store' });
      const data = (await response.json()) as CartResponse;
      setCart(data);
    } finally {
      setIsLoading(false);
    }
  }

  async function mutateItem(itemId: number, method: 'PATCH' | 'DELETE', action?: 'increase' | 'decrease') {
    const response = await fetch(`/api/cart/item/${itemId}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'PATCH' ? JSON.stringify({ action }) : undefined,
    });
    const data = (await response.json()) as CartResponse;
    setCart(data);
  }

  useEffect(() => {
    void refreshCart();
  }, []);

  if (isLoading) {
    return <div className="container-main py-10"><div className="card p-6 text-sm text-muted">Sepet yükleniyor...</div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-main py-10">
        <div className="card p-10 text-center">
          <h2 className="text-xl font-bold text-ink">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-muted">Alışverişe başlamak için ürünleri sepetinize ekleyin.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  const total = Number(cart.total);

  return (
    <div className="container-main grid gap-6 py-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-3">
        <h1 className="text-xl font-bold text-ink">Sepetim ({cart.item_count} ürün)</h1>
        {cart.items.map((item) => (
          <article key={item.id} className="card flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                <Image
                  src={item.product.images[0]?.image || products[0].images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized={item.product.images[0]?.image?.includes('127.0.0.1') || item.product.images[0]?.image?.includes('localhost')}
                />
              </div>
              <div>
                <p className="text-xs text-muted">{item.product.brand ?? 'AlbaniaShop'}</p>
                <h2 className="text-sm font-semibold text-ink">{item.product.name}</h2>
                {item.variation_label ? <p className="mt-1 text-xs text-muted">{item.variation_label}</p> : null}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-border">
                <button onClick={() => void mutateItem(item.id, 'PATCH', 'decrease')} className="icon-btn h-8 w-8 rounded-none">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                <button onClick={() => void mutateItem(item.id, 'PATCH', 'increase')} className="icon-btn h-8 w-8 rounded-none">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="min-w-20 text-right text-base font-bold text-primary">{formatLek(Number(item.subtotal))}</p>
              <button onClick={() => void mutateItem(item.id, 'DELETE')} className="icon-btn text-muted hover:text-danger">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className="card h-fit p-5 lg:sticky lg:top-28">
        <h2 className="text-base font-bold text-ink">Sipariş Özeti</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between text-muted"><span>Ürünler ({cart.item_count})</span><span>{formatLek(total)}</span></div>
          <div className="flex justify-between text-muted"><span>Kargo</span><span className="text-success font-medium">Ücretsiz</span></div>
          <div className="border-t border-border pt-3">
            <div className="flex justify-between text-base font-bold text-ink"><span>Toplam</span><span className="text-primary">{formatLek(total)}</span></div>
          </div>
        </div>
        <Link href="/checkout" className="btn-primary mt-5 w-full">Siparişi Tamamla</Link>
      </aside>
    </div>
  );
}