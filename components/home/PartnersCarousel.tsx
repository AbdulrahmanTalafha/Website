'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/types'

interface Partner {
  id: string
  name: Record<string, string>
  logo: string
  website?: string
  category: string
}

interface PartnersCarouselProps {
  locale: Locale
  partners: Partner[]
  title?: string | null
  description?: string | null
  viewAllLabel?: string | null
  viewAllHref?: string | null
}

export default function PartnersCarousel({
  locale,
  partners,
  title,
  description,
  viewAllLabel,
  viewAllHref,
}: PartnersCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  const displayTitle = title?.trim()
  const displayDescription = description?.trim()
  const viewAll = viewAllLabel?.trim()
  const viewAllUrl = viewAllHref?.trim()
  const showHeader = displayTitle || viewAll
  const showDescription = displayDescription

  const items = [...partners, ...partners]

  useEffect(() => {
    if (!partners.length) return

    const track = trackRef.current
    if (!track) return

    let position = 0
    const itemWidth = 200 // px per card including gap
    const totalOriginal = partners.length * itemWidth
    const speed = 0.5 // px per frame

    let raf: number
    const animate = () => {
      if (!pausedRef.current) {
        position += speed
        if (position >= totalOriginal) {
          position = 0
        }
      }
      track.style.transform = `translateX(${locale === 'ar' ? position : -position}px)`
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [partners.length, locale])

  if (!partners.length) return null

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container-wide mb-10">
        {showHeader && (
        <div className="flex items-center justify-between mb-2">
          {displayTitle ? (
          <div className="flex items-center gap-0">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <h2 className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {displayTitle}
            </h2>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent rtl:bg-gradient-to-l" />
          </div>
          ) : <div />}
          {viewAll && viewAllUrl && (
          <Link
            href={viewAllUrl}
            className="shrink-0 text-sm font-semibold text-primary-500 hover:text-secondary-500 transition-colors flex items-center gap-1"
          >
            {viewAll}
            <span className="text-base">{locale === 'ar' ? '←' : '→'}</span>
          </Link>
          )}
        </div>
        )}
        {showDescription && (
        <p className="text-neutral-500 text-sm ps-5">
          {displayDescription}
        </p>
        )}
      </div>

      <div
        className="relative"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false }}
      >
        <div
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        >
          <div ref={trackRef} className="flex gap-5 will-change-transform py-1" style={{ width: 'max-content' }}>
            {items.map((partner, i) => (
              <a
                key={`${partner.id}-${i}`}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-44 h-24 bg-white rounded-2xl border border-neutral-100 flex items-center justify-center p-4"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name[locale]}
                  width={140}
                  height={60}
                  className="object-contain max-h-14 w-full"
                  unoptimized={partner.logo.endsWith('.svg') || partner.logo.startsWith('http')}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Category badges */}
      <div className="container-wide mt-10 flex flex-wrap justify-center gap-3">
        {[
          { key: 'international-partner', label: locale === 'ar' ? 'شركاء دوليون' : 'International Partners', color: 'bg-primary-50 text-primary-600' },
          { key: 'local-partner', label: locale === 'ar' ? 'شركاء محليون' : 'Local Partners', color: 'bg-secondary-50 text-secondary-600' },
          { key: 'donor', label: locale === 'ar' ? 'داعمون' : 'Donors', color: 'bg-green-50 text-green-700' },
        ].map(cat => {
          const count = partners.filter(p => p.category === cat.key).length
          if (!count) return null
          return (
            <span key={cat.key} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${cat.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {cat.label} ({count})
            </span>
          )
        })}
      </div>
    </section>
  )
}
