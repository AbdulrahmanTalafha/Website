'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import type { Publication } from '@/types'
import Button from '@/components/common/Button'
import { ArrowRight, ArrowLeft, Calendar, Download, FileText, ChevronRight, ChevronLeft } from 'lucide-react'

interface LatestPublicationsProps {
  locale: Locale
  publications: Publication[]
}

const typeLabels: Record<string, Record<string, string>> = {
  report: { ar: 'تقرير', en: 'Report' },
  study: { ar: 'دراسة', en: 'Study' },
  'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper' },
  guide: { ar: 'دليل', en: 'Guide' },
  brief: { ar: 'موجز', en: 'Brief' },
}

export default function LatestPublications({ locale, publications }: LatestPublicationsProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const [featured, ...rest] = publications.slice(0, 3)
  const side = rest.slice(0, 2)

  if (!featured) return null

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">

        {/* Header — matches ContentCarousel style */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-0">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {locale === 'ar' ? 'أحدث المنشورات والتقارير' : 'Latest Publications & Reports'}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <Button
            href={`/${locale}/publications-reports`}
            variant="outline"
            size="sm"
            icon={<ArrowIcon className="w-4 h-4" />}
            className="shrink-0"
          >
            {locale === 'ar' ? 'المكتبة كاملة' : 'Full Library'}
          </Button>
        </div>

        {/* Grid: 1 big + 2 small */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch ${isRTL ? 'lg:flex lg:flex-row-reverse' : ''}`}>

          {/* Featured card — spans 3 cols */}
          <Link
            href={`/${locale}/publications-reports/${featured.slug}`}
            className="lg:col-span-3 lg:flex-[3] group relative rounded-2xl overflow-hidden shadow-xl min-h-[480px] flex flex-col bg-primary-500"
          >
            <Image
              src={featured.coverImage}
              alt={featured.title[locale]}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-60"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            {/* gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            {/* Badge */}
            <div className="absolute top-5 start-5">
              <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1.5">
                {typeLabels[featured.type]?.[locale] ?? featured.type}
              </span>
            </div>

            {/* Content at bottom */}
            <div className="relative z-10 mt-auto p-7">
              {/* Tags */}
              <div className={`flex flex-wrap gap-1.5 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {featured.tags.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-xs text-white/70 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {tag[locale]}
                  </span>
                ))}
              </div>

              <h2 className={`text-2xl lg:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors ${isRTL ? 'text-right' : ''}`}>
                {featured.title[locale]}
              </h2>
              <p className={`text-white/70 text-sm leading-relaxed mb-5 line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                {featured.summary[locale]}
              </p>

              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 text-white/50 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {featured.publishDate.slice(0, 7)}
                  </span>
                  {featured.pages && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {featured.pages} {locale === 'ar' ? 'صفحة' : 'pages'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(featured.pdfUrl, '_blank'); }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-white/15 hover:bg-secondary-500 border border-white/25 px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    PDF
                  </button>
                  <span className="flex items-center gap-1 text-xs font-semibold text-secondary-400 group-hover:text-secondary-300 transition-colors">
                    {locale === 'ar' ? 'اقرأ أكثر' : 'Read more'}
                    <ChevronIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Two side cards — span 2 cols */}
          <div className="lg:col-span-2 lg:flex-[2] flex flex-col gap-5">
            {side.map((pub) => (
              <Link
                key={pub.id}
                href={`/${locale}/publications-reports/${pub.slug}`}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-secondary-200 hover:shadow-lg transition-all duration-300 flex-1"
              >
                {/* Thumbnail */}
                <div className="relative w-32 shrink-0 bg-neutral-100">
                  <Image
                    src={pub.coverImage}
                    alt={pub.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                  />
                  {/* Red top bar on hover */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-secondary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                </div>

                {/* Info */}
                <div className={`flex flex-col justify-between py-4 pe-4 flex-1 ${isRTL ? 'ps-4 pe-0' : ''}`}>
                  <div>
                    <span className="inline-block text-xs font-bold text-secondary-600 bg-secondary-50 px-2.5 py-0.5 rounded-full mb-2">
                      {typeLabels[pub.type]?.[locale] ?? pub.type}
                    </span>
                    <h3 className={`font-bold text-sm text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-500 transition-colors ${isRTL ? 'text-right' : ''}`}>
                      {pub.title[locale]}
                    </h3>
                    <p className={`text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                      {pub.summary[locale]}
                    </p>
                  </div>

                  <div className={`flex items-center justify-between mt-3 pt-3 border-t border-neutral-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="flex items-center gap-1 text-xs text-neutral-400">
                      <Calendar className="w-3 h-3" />
                      {pub.publishDate.slice(0, 7)}
                      {pub.pages && <> · <FileText className="w-3 h-3" /> {pub.pages} {locale === 'ar' ? 'ص' : 'p'}</>}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(pub.pdfUrl, '_blank'); }}
                      className="flex items-center gap-1 text-xs font-semibold text-secondary-500 hover:text-secondary-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
