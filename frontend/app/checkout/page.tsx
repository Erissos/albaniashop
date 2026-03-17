'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type CartResponse } from '@/lib/api';
import { formatLek } from '@/lib/data';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  useEffect(() => {
    fetch('/api/cart', { cache: 'no-store' })
      .then((res) => res.json() as Promise<CartResponse>)
      .then(setCart)
      .finally(() => setIsLoading(false));
  }, []);

  async function handlePlaceOrder() {
    setIsSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: '' }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setOrderError(data.detail || 'Sipariş oluşturulamadı. Lütfen giriş yapın.');
        return;
      }
      const order = await res.json();
      setOrderSuccess(`Siparişiniz oluşturuldu! Sipariş No: ${order.order_number}`);
      setTimeout(() => router.push('/account'), 2000);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="container-main py-10"><div className="card p-6 text-sm text-muted">Yükleniyor...</div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-main py-10">
        <div className="card p-10 text-center">
          <h2 className="text-xl font-bold text-ink">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-muted">Sipariş vermek için önce sepetinize ürün ekleyin.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">Alışverişe Başla</Link>
        </div>
      </div>
    );
  }

  const total = Number(cart.total);

  return (
    <div className="container-main grid gap-6 py-6 lg:grid-cols-[1fr_380px]">
      <section className="space-y-5">
        <h1 className="text-xl font-bold text-ink">Siparişi Tamamla</h1>

        {/* Shipping */}
        <div className="card space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <MapPin className="h-4 w-4 text-primary" />
            Teslimat Bilgileri
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="input-field" placeholder="Ad" />
            <input className="input-field" placeholder="Soyad" />
            <input className="input-field md:col-span-2" placeholder="Adres" />
            <input className="input-field" placeholder="Şehir" />
            <input className="input-field" placeholder="Telefon" />
          </div>
        </div>

        {/* Payment */}
        <div className="card space-y-4 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink">
            <CreditCard className="h-4 w-4 text-primary" />
            Ödeme Yöntemi
          </div>
          <div className="space-y-2">
            {['Kredi / Banka Kartı', 'Kapıda Ödeme', 'Havale / EFT'].map((method, index) => (
              <label key={method} className="flex items-center justify-between rounded-card border border-border p-4 text-sm transition hover:border-primary">
                <span className="font-medium text-ink">{method}</span>
                <input type="radio" name="payment" defaultChecked={index === 0} className="accent-primary" />
              </label>
            ))}
          </div>
        </div>
      </section>

      <aside className="card h-fit p-5 lg:sticky lg:top-28">
        <h2 className="text-base font-bold text-ink">Sipariş Özeti</h2>

        <div className="mt-4 space-y-3 text-sm">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{item.product.name}</p>
                <p className="text-xs text-muted">Adet: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-ink">{formatLek(Number(item.subtotal))}</span>
            </div>
          ))}

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between text-muted"><span>Ürünler ({cart.item_count})</span><span>{formatLek(total)}</span></div>
            <div className="flex justify-between text-muted"><span>Kargo</span><span className="text-success font-medium">Ücretsiz</span></div>
            <div className="flex justify-between text-base font-bold text-ink pt-2 border-t border-border">
              <span>Toplam</span>
              <span className="text-primary">{formatLek(total)}</span>
            </div>
          </div>
        </div>

        <button onClick={handlePlaceOrder} disabled={isSubmitting} className="btn-primary mt-5 w-full disabled:opacity-70">
          {isSubmitting ? 'İşleniyor...' : 'Siparişi Onayla'}
        </button>

        {orderError && <p className="mt-3 text-sm text-danger">{orderError}</p>}
        {orderSuccess && <p className="mt-3 text-sm font-semibold text-success">{orderSuccess}</p>}

        <div className="mt-4 flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="h-4 w-4 text-success" />
          <span>256-bit SSL ile güvenli ödeme</span>
        </div>
      </aside>
    </div>
  );
}