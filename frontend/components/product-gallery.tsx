'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const prev = useCallback(() => setActiveIndex((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActiveIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, prev, next]);

  return (
    <>
      <div className="space-y-3">
        {/* Main image with zoom button */}
        <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-card border border-border bg-surface" onClick={() => setLightboxOpen(true)}>
          <Image src={images[activeIndex]} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/10 group-hover:opacity-100">
            <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
          </div>
        </div>
        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, i) => (
            <button
              key={image}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${activeIndex === i ? 'border-primary' : 'border-border hover:border-primary/40'}`}
            >
              <Image src={image} alt={alt} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90" onClick={() => setLightboxOpen(false)}>
          <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" onClick={() => setLightboxOpen(false)} aria-label="Kapat">
            <X className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Önceki"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Sonraki"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative h-[85vh] w-[85vw]" onClick={(e) => e.stopPropagation()}>
            <Image src={images[activeIndex]} alt={alt} fill className="object-contain" sizes="85vw" priority />
          </div>

          {/* Indicator dots */}
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`h-2 w-2 rounded-full transition ${activeIndex === i ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}