'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, MapPin, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

import { type CartResponse } from '@/lib/api';
import { formatLek } from '@/lib/data';

type Address = {
  id: number;
  title: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  address_line: string;
  address_line_2: string;
  company_name: string;
  is_default: boolean;
};

type AddressForm = {
  title: string;
  full_name: string;
  phone: string;
  country: string;
  city: string;
  postal_code: string;
  address_line: string;
  address_line_2: string;
  company_name: string;
  is_default: boolean;
};

const emptyAddressForm: AddressForm = {
  title: 'Ev',
  full_name: '',
  phone: '',
  country: 'Albania',
  city: '',
  postal_code: '',
  address_line: '',
  address_line_2: '',
  company_name: '',
  is_default: true,
};

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<AddressForm>(emptyAddressForm);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Kredi / Banka Kartı');
  const [note, setNote] = useState('');
  const [authRequired, setAuthRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/cart', { cache: 'no-store' }).then((res) => res.json() as Promise<CartResponse>),
      fetch('/api/addresses', { cache: 'no-store' }),
    ])
      .then(async ([cartData, addressResponse]) => {
        setCart(cartData);

        if (addressResponse.status === 401 || addressResponse.status === 403) {
          setAuthRequired(true);
          return;
        }

        const addressData = addressResponse.ok ? ((await addressResponse.json()) as Address[]) : [];
        setAddresses(addressData);
        const defaultAddress = addressData.find((address) => address.is_default) ?? addressData[0] ?? null;
        setSelectedAddressId(defaultAddress?.id ?? null);
        setShowAddressForm(addressData.length === 0);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function updateAddressField<K extends keyof AddressForm>(field: K, value: AddressForm[K]) {
    setAddressForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderError('');
    setIsAddressSubmitting(true);

    try {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = Array.isArray(data) ? data[0] : data.detail || 'Adres kaydedilemedi.';
        setOrderError(typeof detail === 'string' ? detail : 'Adres kaydedilemedi.');
        return;
      }

      const createdAddress = data as Address;
      setAddresses((current) => [createdAddress, ...current.filter((address) => address.id !== createdAddress.id)]);
      setSelectedAddressId(createdAddress.id);
      setShowAddressForm(false);
      setAddressForm(emptyAddressForm);
    } finally {
      setIsAddressSubmitting(false);
    }
  }

  async function handlePlaceOrder() {
    if (authRequired) {
      setOrderError('Siparişi tamamlamak için önce giriş yapın.');
      return;
    }

    if (!selectedAddressId) {
      setOrderError('Sipariş vermek için bir teslimat adresi seçin.');
      return;
    }

    setIsSubmitting(true);
    setOrderError('');
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address_id: selectedAddressId,
          note: [note.trim(), `Ödeme yöntemi: ${paymentMethod}`].filter(Boolean).join(' | '),
        }),
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

          {authRequired ? (
            <div className="rounded-card border border-border bg-surface p-4 text-sm text-muted">
              Siparişi tamamlamak için önce hesabınıza giriş yapın.
              <div className="mt-3">
                <Link href="/account" className="btn-primary inline-flex">Giriş Yap / Kayıt Ol</Link>
              </div>
            </div>
          ) : (
            <>
              {addresses.length ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label key={address.id} className={`block cursor-pointer rounded-card border p-4 text-sm transition ${selectedAddressId === address.id ? 'border-primary bg-primary-light/30' : 'border-border hover:border-primary/40'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-ink">{address.title}</span>
                            {address.is_default ? <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">Varsayılan</span> : null}
                          </div>
                          <p className="mt-1 font-medium text-ink">{address.full_name}</p>
                          <p className="mt-1 text-muted">{address.address_line}{address.address_line_2 ? `, ${address.address_line_2}` : ''}</p>
                          <p className="text-muted">{address.city}, {address.country} {address.postal_code}</p>
                          <p className="text-muted">{address.phone}</p>
                        </div>
                        <input
                          type="radio"
                          name="address"
                          className="mt-1 accent-primary"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                      </div>
                    </label>
                  ))}
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setShowAddressForm((current) => !current)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {showAddressForm ? 'Adres formunu kapat' : 'Yeni adres ekle'}
              </button>

              {showAddressForm ? (
                <form className="grid gap-3 md:grid-cols-2" onSubmit={handleCreateAddress}>
                  <input value={addressForm.title} onChange={(event) => updateAddressField('title', event.target.value)} className="input-field" placeholder="Adres başlığı" required />
                  <input value={addressForm.full_name} onChange={(event) => updateAddressField('full_name', event.target.value)} className="input-field" placeholder="Ad Soyad" required />
                  <input value={addressForm.phone} onChange={(event) => updateAddressField('phone', event.target.value)} className="input-field" placeholder="Telefon" required />
                  <input value={addressForm.city} onChange={(event) => updateAddressField('city', event.target.value)} className="input-field" placeholder="Şehir" required />
                  <input value={addressForm.country} onChange={(event) => updateAddressField('country', event.target.value)} className="input-field" placeholder="Ülke" required />
                  <input value={addressForm.postal_code} onChange={(event) => updateAddressField('postal_code', event.target.value)} className="input-field" placeholder="Posta kodu" />
                  <input value={addressForm.company_name} onChange={(event) => updateAddressField('company_name', event.target.value)} className="input-field" placeholder="Şirket adı" />
                  <input value={addressForm.address_line_2} onChange={(event) => updateAddressField('address_line_2', event.target.value)} className="input-field" placeholder="Adres satırı 2" />
                  <textarea value={addressForm.address_line} onChange={(event) => updateAddressField('address_line', event.target.value)} className="input-field min-h-28 md:col-span-2" placeholder="Açık adres" required />
                  <label className="md:col-span-2 flex items-center gap-2 text-sm text-muted">
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={addressForm.is_default}
                      onChange={(event) => updateAddressField('is_default', event.target.checked)}
                    />
                    Varsayılan adres olarak kaydet
                  </label>
                  <div className="md:col-span-2">
                    <button type="submit" disabled={isAddressSubmitting} className="btn-secondary disabled:opacity-70">
                      {isAddressSubmitting ? 'Kaydediliyor...' : 'Adresi Kaydet'}
                    </button>
                  </div>
                </form>
              ) : null}
            </>
          )}
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
                <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-primary" />
              </label>
            ))}
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-medium text-ink">Sipariş notu</span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="input-field min-h-24"
              placeholder="Teslimat için ek notunuz varsa yazın"
            />
          </label>
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