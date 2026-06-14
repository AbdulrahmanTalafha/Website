'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Locale } from '@/types';

export interface CarouselItem {
  id: string;
  href: string;
  title: string;
  shortDescription: string;
  image: string;
  badge: string;
  date?: string;
}

interface ContentCarouselProps {
  locale: Locale;
  items: CarouselItem[];
  sectionTitle: string;
  viewAllHref: string;
  viewAllLabel: string;
}

const VISIBLE = 2.2;
const SCALE   = 1.28;

function useIsMobile(bp = 768) {
  const [val, setVal] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp - 1}px)`);
    setVal(mq.matches);
    const h = (e: MediaQueryListEvent) => setVal(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [bp]);
  return val;
}

export default function ContentCarousel({
  locale, items, sectionTitle, viewAllHref, viewAllLabel,
}: ContentCarouselProps) {
  const isRTL  = locale === 'ar';
  const mobile = useIsMobile();

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container-wide">
        <div className="flex items-center justify-between mb-6 md:mb-10">
          <div className="flex items-center gap-0">
            {/* Red accent bar — sits on the start side (right in RTL, left in LTR) */}
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {sectionTitle}
            </span>
            {/* Decorative fading line — extends away from title */}
            <div className={`hidden md:block h-px w-32 ${isRTL ? 'bg-gradient-to-r' : 'bg-gradient-to-r'} from-neutral-300 to-transparent`} />
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1.5 text-sm font-bold text-primary-500 hover:text-secondary-500 transition-colors group"
          >
            {viewAllLabel}
            <span className="w-6 h-6 rounded-full bg-secondary-500/10 group-hover:bg-secondary-500 flex items-center justify-center transition-colors duration-200">
              {isRTL
                ? <ChevronLeft className="w-3.5 h-3.5 text-secondary-500 group-hover:text-white transition-colors" />
                : <ChevronRight className="w-3.5 h-3.5 text-secondary-500 group-hover:text-white transition-colors" />}
            </span>
          </Link>
        </div>

        {mobile === null ? null : mobile
          ? <MobileCarousel items={items} isRTL={isRTL} />
          : <DesktopCarousel items={items} isRTL={isRTL} />
        }
      </div>
    </section>
  );
}

/* ══ MOBILE ══════════════════════════════════════════════════ */
function MobileCarousel({ items, isRTL }: { items: CarouselItem[]; isRTL: boolean }) {
  const n = items.length;
  // Clones: [last, ...items, first] — enables seamless infinite loop
  const ext = [items[n - 1], ...items, items[0]];
  const [slot, setSlot] = useState(1); // 1 = items[0]
  const [animated, setAnimated] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: 'next' | 'prev') => {
    setSlot(p => p + (dir === 'next' ? 1 : -1));
  }, []);

  // After transition ends, snap from clone to real equivalent
  useEffect(() => {
    if (!animated) return;
    if (slot === 0) {
      const t = setTimeout(() => { setAnimated(false); setSlot(n); }, 480);
      return () => clearTimeout(t);
    }
    if (slot === n + 1) {
      const t = setTimeout(() => { setAnimated(false); setSlot(1); }, 480);
      return () => clearTimeout(t);
    }
  }, [slot, animated, n]);

  // Re-enable transition after instant snap
  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 30);
      return () => clearTimeout(t);
    }
  }, [animated]);

  useEffect(() => {
    autoRef.current = setInterval(() => go('next'), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [go]);

  const reset = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => go('next'), 5000);
  };

  const dotIdx = ((slot - 1) % n + n) % n;
  // offset: translateX relative to track (track = ext.length * container)
  const offset = `-${(slot / ext.length) * 100}%`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl" dir="ltr" style={{ height: '280px' }}>
        <div
          className="flex h-full"
          style={{
            width: `${ext.length * 100}%`,
            transform: `translateX(${offset})`,
            transition: animated ? 'transform 480ms cubic-bezier(0.22,1,0.36,1)' : 'none',
          }}
        >
          {ext.map((item, i) => (
            <div key={`${i}-${item.id}`} style={{ width: `${100 / ext.length}%` }} className="h-full flex-shrink-0">
              <MobileCard item={item} isRTL={isRTL} />
            </div>
          ))}
        </div>

        <button
          onClick={() => { go('prev'); reset(); }}
          aria-label="previous"
          className="absolute top-1/2 -translate-y-1/2 left-3 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary-700 hover:bg-secondary-500 hover:text-white transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => { go('next'); reset(); }}
          aria-label="next"
          className="absolute top-1/2 -translate-y-1/2 right-3 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-primary-700 hover:bg-secondary-500 hover:text-white transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center items-center gap-2.5 mt-6">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => { setSlot(i + 1); reset(); }}
            aria-label={`slide ${i + 1}`}
            style={i === dotIdx ? { boxShadow: '0 2px 8px rgba(220,38,38,0.45)' } : {}}
            className={`rounded-full transition-all duration-300 ${
              i === dotIdx ? 'w-7 h-2.5 bg-secondary-500' : 'w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function MobileCard({ item, isRTL }: { item: CarouselItem; isRTL: boolean }) {
  return (
    <Link
      href={item.href}
      className="group relative block w-full h-full overflow-hidden"
      style={{ borderRadius: '16px' }}
    >
      <Image src={item.image} alt={item.title} fill priority sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10`}>
        <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow inline-block">
          {item.badge}
        </span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="text-base font-black text-white leading-snug line-clamp-2 mb-2">{item.title}</h3>
        {item.date && (
          <span className="inline-flex self-start bg-secondary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
            {item.date}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ══ DESKTOP ═════════════════════════════════════════════════ */
function DesktopCarousel({ items, isRTL }: { items: CarouselItem[]; isRTL: boolean }) {
  const n = items.length;
  // Clones: [last, ...items, first]
  const ext = [items[n - 1], ...items, items[0]];
  const extLen = ext.length; // n + 2
  const [slot, setSlot] = useState(1); // 1 = items[0] is center
  const [animated, setAnimated] = useState(true);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((dir: 'next' | 'prev') => {
    setSlot(p => p + (dir === 'next' ? 1 : -1));
  }, []);

  // Snap from clone back to real item after transition
  useEffect(() => {
    if (!animated) return;
    if (slot === 0) {
      const t = setTimeout(() => { setAnimated(false); setSlot(n); }, 580);
      return () => clearTimeout(t);
    }
    if (slot === n + 1) {
      const t = setTimeout(() => { setAnimated(false); setSlot(1); }, 580);
      return () => clearTimeout(t);
    }
  }, [slot, animated, n]);

  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 30);
      return () => clearTimeout(t);
    }
  }, [animated]);

  useEffect(() => {
    autoRef.current = setInterval(() => go('next'), 5000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [go]);

  const reset = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => go('next'), 5000);
  };

  // Center the viewport on card at `slot`
  const shiftPct = ((slot - (VISIBLE / 2 - 0.5)) / extLen) * 100;
  const offset = isRTL ? `${shiftPct}%` : `-${shiftPct}%`;

  const dotIdx = ((slot - 1) % n + n) % n;

  return (
    <div>
      <div className="overflow-hidden rounded-2xl">
        <div className="relative py-10">
          <div
            className="flex"
            style={{
              width: `${(extLen / VISIBLE) * 100}%`,
              transform: `translateX(${offset})`,
              transition: animated ? 'transform 580ms cubic-bezier(0.22,1,0.36,1)' : 'none',
              ...(isRTL ? { direction: 'rtl' } : {}),
            }}
          >
            {ext.map((item, i) => {
              const isCenter   = i === slot;
              const isAdjacent = i === slot - 1 || i === slot + 1;
              return (
                <div
                  key={`${i}-${item.id}`}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / extLen}%`, position: 'relative', zIndex: isCenter ? 20 : isAdjacent ? 10 : 1 }}
                >
                  <div style={{
                    transform: `scale(${isCenter ? SCALE : 1})`,
                    transformOrigin: 'center center',
                    opacity: isCenter ? 1 : isAdjacent ? 0.85 : 0.45,
                    transition: 'transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 500ms ease',
                  }}>
                    <DesktopCard item={item} isCenter={isCenter} isRTL={isRTL} />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => { go('prev'); reset(); }}
            aria-label="previous"
            className="absolute top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-primary-700 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-all duration-200"
            style={{ [isRTL ? 'right' : 'left']: '4px' }}
          >
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => { go('next'); reset(); }}
            aria-label="next"
            className="absolute top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-neutral-200 flex items-center justify-center text-primary-700 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-all duration-200"
            style={{ [isRTL ? 'left' : 'right']: '4px' }}
          >
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {n > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8 pb-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => { setSlot(i + 1); reset(); }}
              aria-label={`slide ${i + 1}`}
              style={i === dotIdx ? { boxShadow: '0 2px 8px rgba(220,38,38,0.45)' } : {}}
              className={`rounded-full transition-all duration-300 ${
                i === dotIdx
                  ? 'w-8 h-2.5 bg-secondary-500'
                  : 'w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400 hover:scale-110'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DesktopCard({ item, isCenter, isRTL }: { item: CarouselItem; isCenter: boolean; isRTL: boolean }) {
  return (
    <Link
      href={item.href}
      className="group relative block w-full overflow-hidden"
      style={{ height: '270px', borderRadius: '16px', boxShadow: isCenter ? '0 25px 50px -12px rgba(0,0,0,0.4)' : 'none' }}
    >
      <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0" style={{
        background: isCenter
          ? 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.2) 55%,transparent 100%)'
          : 'linear-gradient(to top,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.15) 60%,transparent 100%)',
      }} />
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-10`}>
        <span className="bg-secondary-500 text-white text-[11px] font-bold px-3 py-1.5 leading-none rounded-md shadow-md inline-block">
          {item.badge}
        </span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="font-black text-white leading-snug line-clamp-3"
          style={{ fontSize: isCenter ? '1.1rem' : '1rem' }}>
          {item.title}
        </h3>
        {item.date && (
          <div className="mt-2.5">
            {isCenter
              ? <span className="inline-flex items-center bg-secondary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">{item.date}</span>
              : <span className="text-xs text-white/55 font-medium">{item.date}</span>
            }
          </div>
        )}
        {isCenter && (
          <div className="overflow-hidden max-h-0 group-hover:max-h-24 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out mt-0 group-hover:mt-3">
            <p className="text-white/75 text-sm leading-relaxed line-clamp-3">{item.shortDescription}</p>
          </div>
        )}
      </div>
    </Link>
  );
}
