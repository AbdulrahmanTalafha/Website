'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface TickerItem {
  id: string
  slug: string
  title: string
}

interface NewsTickerProps {
  items: TickerItem[]
  locale: string
  label?: string | null
  href?: string | null
}

export default function NewsTicker({ items, locale, label, href }: NewsTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const halfWidthRef = useRef<number>(0)
  const isRTL = locale === 'ar'

  const displayLabel = label?.trim()
  const displayHref = href?.trim()
  const repeated = [...items, ...items, ...items, ...items]

  useEffect(() => {
    if (!items.length) return

    const track = trackRef.current
    if (!track) return

    // halfWidth = width of ONE copy of the items list
    // We use scrollWidth / 4 since we rendered 4 copies
    const measureHalf = () => {
      halfWidthRef.current = track.scrollWidth / 4
    }
    measureHalf()

    let animId: number
    let pos = 0
    const speed = 0.6 // px per frame

    const animate = () => {
      pos += speed
      const half = halfWidthRef.current
      // Once we've scrolled one full copy, snap back to start — seamless loop
      if (half > 0 && pos >= half) pos -= half
      track.style.transform = isRTL
        ? `translateX(${pos}px)`
        : `translateX(${-pos}px)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    const pause = () => cancelAnimationFrame(animId)
    const resume = () => { animId = requestAnimationFrame(animate) }
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(animId)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
    }
  }, [isRTL, items])

  if (!items.length) return null

  const defaultLabel = isRTL ? 'أخبار عاجلة' : 'Breaking News'
  const defaultHref = `/${locale}/media-center`
  const badgeLabel = displayLabel ?? defaultLabel
  const badgeHref = displayHref ?? defaultHref

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="w-full bg-primary-500 text-white flex items-stretch overflow-hidden"
      style={{ height: 44 }}
    >
      {displayLabel && (
      <Link
        href={badgeHref}
        className="flex-shrink-0 flex items-center gap-2 bg-secondary-500 px-4 text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap hover:bg-secondary-600 transition-colors z-10"
      >
        <BookOpen className="w-3.5 h-3.5" />
        {badgeLabel}
      </Link>
      )}

      {displayLabel && (
      <div
        className="flex-shrink-0 w-0 h-0 self-center"
        style={{
          borderTop: '22px solid transparent',
          borderBottom: '22px solid transparent',
          borderLeft: isRTL ? 'none' : '12px solid #e63946',
          borderRight: isRTL ? '12px solid #e63946' : 'none',
        }}
      />
      )}

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={trackRef}
          className="flex items-center h-full gap-0 will-change-transform whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {repeated.map((item, i) => (
            <Link
              key={`${item.id}-${i}`}
              href={`/${locale}/media-center/${item.slug}`}
              className="inline-flex items-center gap-2 px-6 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-400 flex-shrink-0" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
