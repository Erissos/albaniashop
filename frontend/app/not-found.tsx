import Link from 'next/link';
import { ArrowLeft, Search, Store } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-main flex min-h-[70vh] items-center py-10">
      <div className="relative w-full overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-surface via-white to-primary-light/40 p-8 shadow-elevated md:p-12">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />
        <div className="absolute -bottom-12 left-8 h-28 w-28 rounded-full bg-ink/5 blur-2xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary shadow-soft">
            <Store className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-primary">404</p>
          <h1 className="mt-3 text-3xl font-black text-ink md:text-5xl">Aradığınız sayfa bulunamadı</h1>
          <p className="mt-4 text-sm leading-6 text-muted md:text-base">
            Link hatalı olabilir ya da içerik kaldırılmış olabilir. Aramaya dönebilir veya ana sayfadan gezinmeye devam edebilirsiniz.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/" className="btn-primary inline-flex min-w-44 justify-center">
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Link>
            <Link href="/search" className="btn-secondary inline-flex min-w-44 justify-center">
              <Search className="h-4 w-4" />
              Ürün Ara
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}