import Link from 'next/link';
import { CreditCard, Headphones, RotateCcw, Truck } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      {/* Trust bar */}
      <div className="border-b border-border">
        <div className="container-main grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
          {[
            { icon: Truck, title: 'Hızlı Kargo', desc: '1-3 iş günü teslimat' },
            { icon: RotateCcw, title: 'Kolay İade', desc: '14 gün koşulsuz iade' },
            { icon: CreditCard, title: 'Güvenli Ödeme', desc: '256-bit SSL şifreleme' },
            { icon: Headphones, title: '7/24 Destek', desc: 'Her zaman yanınızda' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="container-main grid gap-8 py-10 md:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold text-primary">AlbaniaShop</p>
          <p className="mt-3 text-sm leading-6 text-muted">
            Giyimden elektroniğe, kozmetikten ev eşyalarına binlerce ürün uygun fiyatlarla.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Kategoriler</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/category/kadin" className="transition hover:text-primary">Kadın</Link>
            <Link href="/category/erkek" className="transition hover:text-primary">Erkek</Link>
            <Link href="/category/ev-yasam" className="transition hover:text-primary">Ev & Yaşam</Link>
            <Link href="/category/kozmetik" className="transition hover:text-primary">Kozmetik</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Hesabım</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/account" className="transition hover:text-primary">Hesap Bilgilerim</Link>
            <Link href="/wishlist" className="transition hover:text-primary">Favorilerim</Link>
            <Link href="/cart" className="transition hover:text-primary">Sepetim</Link>
              <Link href="/account" className="transition hover:text-primary">Siparişlerim</Link>
          </nav>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Yardım</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-muted">
              <Link href="/account" className="transition hover:text-primary">Sıkça Sorulan Sorular</Link>
              <Link href="/account" className="transition hover:text-primary">İade & Değişim</Link>
              <Link href="/account" className="transition hover:text-primary">Kargo Takibi</Link>
              <Link href="/account" className="transition hover:text-primary">İletişim</Link>
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-4 text-xs text-muted md:flex-row">
          <p>&copy; 2026 AlbaniaShop. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
                <Link href="/account" className="transition hover:text-primary">Gizlilik Politikası</Link>
                <Link href="/account" className="transition hover:text-primary">Kullanım Koşulları</Link>
                <Link href="/account" className="transition hover:text-primary">KVKK</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}