import Link from 'next/link';
import { Heart, Menu, Search, ShoppingCart, User } from 'lucide-react';

import { CartBadge } from '@/components/cart-badge';
import { CategoryIcon } from '@/components/category-icon';
import { CategoryMegaMenu } from '@/components/category-mega-menu';
import { SearchAutocomplete } from '@/components/search-autocomplete';
import { getLiveCategories } from '@/lib/api';

export async function SiteHeader() {
  const categories = await getLiveCategories();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-soft">
      {/* Top bar */}
      <div className="border-b border-border bg-surface text-xs text-muted">
        <div className="container-main flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <span>Süper fırsatlar her gün burada!</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/account" className="transition hover:text-primary">Yardım & Destek</Link>
            <span className="text-border">|</span>
            <Link href="/account" className="transition hover:text-primary">Siparişlerim</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container-main flex items-center gap-4 py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-extrabold text-primary">
          AlbaniaShop
        </Link>

        {/* Search */}
        <div className="hidden flex-1 lg:block">
          <SearchAutocomplete />
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <button className="icon-btn lg:hidden" aria-label="Ara">
            <Search className="h-5 w-5" />
          </button>
          <button className="icon-btn lg:hidden" aria-label="Menü">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/account" className="btn-ghost hidden sm:inline-flex">
            <User className="h-5 w-5" />
            <span className="hidden md:inline">Hesabım</span>
          </Link>
          <Link href="/wishlist" className="btn-ghost hidden sm:inline-flex">
            <Heart className="h-5 w-5" />
            <span className="hidden md:inline">Favoriler</span>
          </Link>
          <Link href="/cart" className="btn-ghost relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden md:inline">Sepetim</span>
            <CartBadge />
          </Link>
        </div>
      </div>

      {/* Category navigation with mega-menu */}
      <CategoryMegaMenu categories={categories} />
    </header>
  );
}