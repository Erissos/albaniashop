'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Heart, Loader2, LogOut, Package, Settings, User2 } from 'lucide-react';

import { formatLek } from '@/lib/data';

type ProfileData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  order_count: number;
  active_order_count: number;
  wishlist_count: number;
  total_spent: string;
};

type OrderData = {
  order_number: string;
  status: string;
  total_amount: string;
  created_at: string;
  items: { product: string; quantity: number }[];
};

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

const accountNavItems = [
  { label: 'Hesap Bilgilerim', icon: User2, href: '#' },
  { label: 'Siparişlerim', icon: Package, href: '#' },
  { label: 'Favorilerim', icon: Heart, href: '/wishlist' },
  { label: 'Ayarlar', icon: Settings, href: '#' },
];

export default function AccountPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/profile', { cache: 'no-store' }).then(async (res) => {
        if (!res.ok) { setIsLoggedIn(false); return null; }
        return res.json() as Promise<ProfileData>;
      }),
      fetch('/api/cart', { cache: 'no-store' }).then(() => {
        // We just use profile endpoint for order info
      }),
    ]).then(([profileData]) => {
      if (profileData) setProfile(profileData);
    }).finally(() => setIsLoading(false));

    // Fetch order history
    fetch('/api/auth/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    window.location.href = '/';
  }

  if (isLoading) {
    return (
      <div className="container-main flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="container-main py-10">
        <div className="card p-10 text-center">
          <User2 className="mx-auto h-10 w-10 text-muted" />
          <h2 className="mt-4 text-xl font-bold text-ink">Giriş Yapın</h2>
          <p className="mt-2 text-sm text-muted">Hesabınıza erişmek için giriş yapmanız gerekiyor.</p>
        </div>
      </div>
    );
  }

  const initials = `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase() || profile.username.charAt(0).toUpperCase();

  return (
    <div className="container-main grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm">{initials}</div>
          <div>
            <p className="text-sm font-semibold text-ink">{profile.first_name} {profile.last_name}</p>
            <p className="text-xs text-muted">{profile.email}</p>
          </div>
        </div>
        <nav className="space-y-1">
          {accountNavItems.map(({ label, icon: ItemIcon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-ink"
            >
              <ItemIcon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-surface"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </button>
        </nav>
      </aside>

      <section className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-4">
            <p className="text-xs text-muted">Aktif Siparişler</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.active_order_count}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-muted">Favoriler</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.wishlist_count}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-muted">Toplam Sipariş</p>
            <p className="mt-1 text-2xl font-bold text-ink">{profile.order_count}</p>
          </div>
        </div>
      </section>
    </div>
  );
}