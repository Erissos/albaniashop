import Link from 'next/link';
import { ArrowRight, Flame, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="container-main py-4">
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        {/* Main banner */}
        <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-dark p-8 text-white md:p-12">
          <div className="relative z-10 max-w-lg">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
              <Flame className="h-4 w-4" />
              Süper Fırsat
            </div>
            <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Sezon Sonu<br />Büyük İndirim
            </h1>
            <p className="mt-4 text-base text-white/80 md:text-lg">
              Binlerce üründe %70&apos;e varan indirim fırsatlarını kaçırma!
            </p>
            <Link
              href="/search?q=indirim"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-primary transition hover:bg-white/90"
            >
              Hemen Keşfet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Decorative circles */}
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -top-8 right-24 h-32 w-32 rounded-full bg-white/5" />
        </div>

        {/* Side banners */}
        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-card bg-ink p-6 text-white">
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Zap className="h-3 w-3" /> FLASH KAMPANYA
              </div>
              <h2 className="text-lg font-bold">Elektronik&apos;te %50 İndirim</h2>
              <p className="mt-1 text-sm text-white/60">Kulaklık, şarj aleti ve daha fazlası</p>
              <Link href="/category/elektronik" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:underline">
                İncele <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-card bg-surface p-6">
            <div className="relative z-10">
              <div className="mb-2 text-xs font-semibold text-success">YENİ SEZON</div>
              <h2 className="text-lg font-bold text-ink">Ev & Yaşam Koleksiyonu</h2>
              <p className="mt-1 text-sm text-muted">Evinize şıklık katın</p>
              <Link href="/category/ev-yasam" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:underline">
                Keşfet <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}