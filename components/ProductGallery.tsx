'use client';

/**
 * ProductGallery — Amazon-style product image viewer.
 *
 * Two modes:
 *  1. Hover zoom (desktop pointers only): a lens follows the cursor over the
 *     main image and a panel beside it shows that region magnified, painted
 *     from the full-resolution file rather than the optimized thumbnail.
 *  2. Lightbox (all devices): click the image for a fullscreen overlay with
 *     thumbnails, arrows, keyboard control and swipe.
 *
 * Note on the zoom maths: the main image is rendered with `object-contain`,
 * so the visible photo is letterboxed inside its box. All cursor mapping is
 * done against that *contained* rectangle — using the container box instead
 * would offset the magnified region from the lens.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { getDictionary } from '@/i18n';
import { useLocale } from '@/i18n/locale-context';
import { CloseIcon } from './icons';

/** Magnification factor for the hover panel. */
const ZOOM = 2.4;
/** Upper bound on the zoom panel width, so it cannot run off-screen. */
const MAX_PANEL_W = 560;
/** Horizontal travel (px) that counts as a swipe in the lightbox. */
const SWIPE_THRESHOLD = 50;

interface ZoomState {
  lensLeft: number;
  lensTop: number;
  lensW: number;
  lensH: number;
  panelW: number;
  panelH: number;
  bgSize: string;
  bgPos: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * True on devices with a real hovering pointer (mouse/trackpad).
 * useSyncExternalStore keeps the server snapshot `false`, so SSR and the
 * first client render agree and the zoom never causes a hydration mismatch.
 */
function useHasHover(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    () => false,
  );
}

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const { locale } = useLocale();
  const t = getDictionary(locale).gallery;

  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const [open, setOpen] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const hasHover = useHasHover();

  const src = images[active];
  const count = images.length;

  /**
   * Warm the full-resolution file. The displayed photo is an optimized
   * next/image variant, so the original is a separate request — without this
   * the zoom panel would be blank for the first moments of a hover. Skipped on
   * touch devices, where the zoom never runs.
   */
  useEffect(() => {
    if (!hasHover || !src) return;
    const preload = new window.Image();
    preload.src = src;
  }, [hasHover, src]);

  const show = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);
  const next = useCallback(() => show(active + 1), [show, active]);
  const prev = useCallback(() => show(active - 1), [show, active]);

  /** Map the cursor onto the contained image and derive lens + panel offsets. */
  const onMouseMove = (e: React.MouseEvent) => {
    const img = imgRef.current;
    if (!img || !img.naturalWidth) return;

    const box = img.getBoundingClientRect();
    // Rectangle the photo actually occupies inside `box` under object-contain.
    const scale = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const dispW = img.naturalWidth * scale;
    const dispH = img.naturalHeight * scale;
    const padX = (box.width - dispW) / 2;
    const padY = (box.height - dispH) / 2;

    const x = e.clientX - box.left - padX;
    const y = e.clientY - box.top - padY;
    // Cursor is over the letterbox bars, not the photo.
    if (x < 0 || y < 0 || x > dispW || y > dispH) {
      setZoom(null);
      return;
    }

    const panelW = Math.min(box.width, MAX_PANEL_W);
    const panelH = box.height;
    // The lens is exactly the region the panel reveals at this magnification.
    const lensW = Math.min(dispW, panelW / ZOOM);
    const lensH = Math.min(dispH, panelH / ZOOM);
    const lensX = clamp(x - lensW / 2, 0, dispW - lensW);
    const lensY = clamp(y - lensH / 2, 0, dispH - lensH);

    setZoom({
      lensLeft: padX + lensX,
      lensTop: padY + lensY,
      lensW,
      lensH,
      panelW,
      panelH,
      bgSize: `${dispW * ZOOM}px ${dispH * ZOOM}px`,
      bgPos: `-${lensX * ZOOM}px -${lensY * ZOOM}px`,
    });
  };

  return (
    <div className="min-w-0">
      {/* Main image + hover zoom */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(true)}
          onMouseMove={hasHover ? onMouseMove : undefined}
          onMouseLeave={() => setZoom(null)}
          aria-label={t.openFullscreen}
          data-testid="gallery-main"
          className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-md border border-border bg-panel"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
        >
          {src ? (
            <Image
              ref={imgRef}
              src={src}
              alt={alt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-3"
            />
          ) : null}

          {/* Lens */}
          {zoom ? (
            <span
              aria-hidden
              data-testid="zoom-lens"
              className="pointer-events-none absolute border border-accent/70 bg-cream/20"
              style={{
                left: zoom.lensLeft,
                top: zoom.lensTop,
                width: zoom.lensW,
                height: zoom.lensH,
              }}
            />
          ) : null}
        </button>

        {/* Zoom panel — sits beside the image, over the info column */}
        {zoom && src ? (
          <div
            aria-hidden
            data-testid="zoom-panel"
            className="pointer-events-none absolute left-full top-0 z-30 ml-5 hidden overflow-hidden rounded-md border border-border bg-panel shadow-2xl lg:block"
            style={{
              width: zoom.panelW,
              height: zoom.panelH,
              // Full-resolution source, not the optimized display variant.
              backgroundImage: `url(${src})`,
              backgroundSize: zoom.bgSize,
              backgroundPosition: zoom.bgPos,
              backgroundRepeat: 'no-repeat',
            }}
          />
        ) : null}
      </div>

      {hasHover ? (
        <p className="mt-2 hidden font-heading text-xs uppercase tracking-wide text-subtle lg:block">
          {t.zoomHint}
        </p>
      ) : null}

      {/* Thumbnails */}
      {count > 1 ? (
        <div className="mt-5 flex gap-4 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => show(i)}
              aria-label={`${t.thumb} ${i + 1}`}
              aria-current={i === active}
              data-testid="gallery-thumb"
              className={`relative aspect-[4/3] w-[140px] shrink-0 overflow-hidden rounded-[4px] border-2 bg-panel transition ${
                i === active ? 'border-accent' : 'border-transparent hover:brightness-110'
              }`}
            >
              <Image src={img} alt="" fill sizes="140px" className="object-contain p-1" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <Lightbox
          images={images}
          alt={alt}
          active={active}
          onShow={show}
          onNext={next}
          onPrev={prev}
          onClose={() => setOpen(false)}
          labels={t}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  images,
  alt,
  active,
  onShow,
  onNext,
  onPrev,
  onClose,
  labels,
}: {
  images: string[];
  alt: string;
  active: number;
  onShow: (i: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  labels: { close: string; prev: string; next: string; thumb: string; counter: string };
}) {
  const touchX = useRef<number | null>(null);
  const stageImg = useRef<HTMLImageElement>(null);
  const many = images.length > 1;

  /**
   * The image element spans the whole stage while the photo itself is
   * letterboxed inside it, so "did the click land on the photo?" has to be
   * measured against the contained rectangle — otherwise clicking the dark
   * surround would never close the lightbox.
   */
  const onStageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const img = stageImg.current;
    if (!img?.naturalWidth) {
      onClose();
      return;
    }
    const r = img.getBoundingClientRect();
    const s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    const x = e.clientX - (r.left + (r.width - w) / 2);
    const y = e.clientY - (r.top + (r.height - h) / 2);
    if (x < 0 || y < 0 || x > w || y > h) onClose();
  };

  // Keyboard control.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  // Lock page scroll while open, restoring whatever was set before.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (dx < 0) onNext();
    else onPrev();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      data-testid="lightbox"
      // Backdrop click closes; clicks inside the content stop propagation.
      onClick={onClose}
      className="fixed inset-0 z-[2000] flex flex-col bg-black/90 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-3 text-cream sm:px-6">
        <span className="font-heading text-sm uppercase tracking-wide text-cream/70">
          {active + 1} {labels.counter} {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={labels.close}
          data-testid="lightbox-close"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-accent hover:text-accent-text"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16"
        onClick={onStageClick}
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative h-full w-full">
          <Image
            key={images[active]}
            ref={stageImg}
            src={images[active]}
            alt={alt}
            fill
            sizes="100vw"
            className="object-contain"
            data-testid="lightbox-image"
          />
        </div>

        {many ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label={labels.prev}
              data-testid="lightbox-prev"
              className="absolute left-1 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 bg-black/40 text-2xl leading-none text-cream transition-colors hover:border-accent hover:text-accent-text sm:left-4"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label={labels.next}
              data-testid="lightbox-next"
              className="absolute right-1 flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 bg-black/40 text-2xl leading-none text-cream transition-colors hover:border-accent hover:text-accent-text sm:right-4"
            >
              ›
            </button>
          </>
        ) : null}
      </div>

      {/* Thumbnails */}
      {many ? (
        <div
          className="flex justify-start gap-3 overflow-x-auto px-4 py-4 sm:justify-center sm:px-6"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => onShow(i)}
              aria-label={`${labels.thumb} ${i + 1}`}
              aria-current={i === active}
              data-testid="lightbox-thumb"
              className={`relative aspect-[4/3] w-[92px] shrink-0 overflow-hidden rounded-[4px] border-2 bg-black/40 transition ${
                i === active ? 'border-accent' : 'border-cream/20 hover:border-cream/50'
              }`}
            >
              <Image src={img} alt="" fill sizes="92px" className="object-contain p-0.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
