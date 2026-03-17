import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AlbaniaShop - Online Alışveriş',
  description: 'Giyimden elektroniğe, kozmetikten ev eşyalarına binlerce ürün uygun fiyatlarla.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans text-ink antialiased`}>
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}