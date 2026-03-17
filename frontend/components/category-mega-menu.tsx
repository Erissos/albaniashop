'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

import { CategoryIcon } from '@/components/category-icon';
import type { Category } from '@/lib/data';

type Props = {
  categories: Category[];
};

export function CategoryMegaMenu({ categories }: Props) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  // Dinamik font boyutu: kategori sayısı arttıkça küçülür
  const count = categories.length;
  const fontSize = count <= 6 ? 'text-sm' : count <= 10 ? 'text-xs' : 'text-[11px]';
  const iconSize = count <= 6 ? 'h-4 w-4' : count <= 10 ? 'h-3.5 w-3.5' : 'h-3 w-3';
  const padding = count <= 6 ? 'px-3 py-2' : count <= 10 ? 'px-2 py-1.5' : 'px-1.5 py-1';

  return (
    <nav className="border-t border-border">
      <div className="container-main flex flex-nowrap items-center justify-evenly py-2">
        {categories.map((category) => (
          <div
            key={category.slug}
            className="relative"
            onMouseEnter={() => setOpenSlug(category.slug)}
            onMouseLeave={() => setOpenSlug(null)}
          >
            <Link
              href={`/category/${category.slug}`}
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg ${padding} ${fontSize} font-medium text-muted transition hover:bg-primary-light hover:text-primary`}
            >
              <CategoryIcon slug={category.slug} className={iconSize} />
              {category.name}
              {category.children && category.children.length > 0 && (
                <ChevronRight className="h-3 w-3 shrink-0 rotate-90 opacity-50" />
              )}
            </Link>

            {/* Mega dropdown */}
            {openSlug === category.slug && category.children && category.children.length > 0 && (
              <div className="absolute left-0 top-full z-[100] min-w-[280px] rounded-lg border border-border bg-white p-4 shadow-elevated">
                <p className="mb-3 text-sm font-bold text-ink">{category.name}</p>
                <div className="space-y-1">
                  {category.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/category/${child.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-primary-light hover:text-primary"
                    >
                      <span className="font-normal">{child.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 border-t border-border pt-3">
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Tümünü Gör →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
