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
}

export default function PartnersCarousel({ locale, partners }: PartnersCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  // Duplicate items for infinite loop
  const items = [...partners, ...partners]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let position = 0
    const itemWidth = 200 // px per card including gap
    const totalOriginal = partners.length * itemWidth
    const speed = 0.5 // px per frame

    let raf: number
    const animate = () => {
      position += speed
      if (position >= totalOriginal) {
        position = 0
      }
      track.style.transform = `translateX(${locale === 'ar' ? position : -position}px)`
      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [partners.length, locale])

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container-wide mb-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-0">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <h2 className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {locale === 'ar' ? 'شركاؤنا وداعمونا' : 'Partners & Supporters'}
            </h2>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <Link
            href={`/${locale}/partners-supporters`}
            className="shrink-0 text-sm font-semibold text-primary-500 hover:text-secondary-500 transition-colors flex items-center gap-1"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
            <span className="text-base">{locale === 'ar' ? '←' : '→'}</span>
          </Link>
        </div>
        <p className="text-neutral-500 text-sm ps-5">
          {locale === 'ar'
            ? 'نفخر بشراكاتنا مع منظمات دولية ومحلية رائدة'
            : 'We are proud of our partnerships with leading international and local organizations'}
        </p>
      </div>

      {/* Carousel track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute inset-y-0 start-0 w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 end-0 w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="overflow-hidden px-2">
          <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: 'max-content' }}>
            {items.map((partner, i) => (
              <a
                key={`${partner.id}-${i}`}
                href={partner.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-44 h-24 bg-white rounded-2xl border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 group"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name[locale]}
                  width={140}
                  height={60}
                  className="object-contain max-h-14 w-full grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
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
