import Link from 'next/link';

import { getLiveBrands } from '@/lib/api';

const staticFilters = [
  {
    title: 'Filtre',
    items: ['Çok Satan', 'Sınırlı Stok', 'Hızlı Kargo', 'Yeni'],
  },
  {
    title: 'Fiyat Aralığı',
    items: ['0 - 50 TL', '50 - 100 TL', '100 - 250 TL', '250+ TL'],
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
              <button
                key={item}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-muted transition hover:border-primary hover:text-primary"
              >
                {item}
              </button>
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