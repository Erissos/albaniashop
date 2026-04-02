import Link from 'next/link';

import { getLiveBrands } from '@/lib/api';

const staticFilters = [
  {
    title: 'Ürün Durumu',
    items: ['Çok Satan', 'Yeni Sezon', 'İndirimli', 'Sınırlı Stok', 'Hızlı Teslimat'],
  },
  {
    title: 'Fiyat Aralığı',
    items: ['0 - 500 TL', '500 - 1.000 TL', '1.000 - 2.500 TL', '2.500 TL ve üzeri'],
  },
  {
    title: 'Beden / Ölçü',
    items: ['XS', 'S', 'M', 'L', 'XL', 'Standart'],
  },
  {
    title: 'Renk',
    items: ['Siyah', 'Beyaz', 'Bej', 'Mavi', 'Yeşil', 'Pembe'],
  },
  {
    title: 'Teslimat',
    items: ['Bugün Kargoda', '1-3 Gün Teslimat', 'Ücretsiz Kargo'],
  },
];

export async function FilterSidebar() {
  const brands = await getLiveBrands();

  return (
    <aside className="card space-y-5 p-5">
      <h2 className="text-base font-bold text-ink">Filtreler</h2>

      {staticFilters.map((group) => (
        <div key={group.title} className="space-y-3">
          <p className="text-sm font-semibold text-ink">{group.title}</p>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Brands from backend */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-ink">Marka</p>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brand/${brand.slug}`}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted transition hover:border-primary hover:text-primary"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}