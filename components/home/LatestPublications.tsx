'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import type { Publication } from '@/types'
import Button from '@/components/common/Button'
import { ArrowRight, ArrowLeft, Calendar, Download, FileText, ChevronRight, ChevronLeft } from 'lucide-react'
import { splitFeaturedGridRows } from '@/lib/splitFeaturedGridItems'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'

interface LatestPublicationsProps {
  locale: Locale
  publications: Publication[]
  sectionTitle?: string | null
  viewAllLabel?: string | null
  viewAllHref?: string | null
}

const typeLabels: Record<string, Record<string, string>> = {
  report: { ar: 'تقرير', en: 'Report' },
  study: { ar: 'دراسة', en: 'Study' },
  'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper' },
  guide: { ar: 'دليل', en: 'Guide' },
  brief: { ar: 'موجز', en: 'Brief' },
}

export default function LatestPublications({
  locale,
  publications,
  sectionTitle,
  viewAllLabel,
  viewAllHref,
}: LatestPublicationsProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const rows = splitFeaturedGridRows(publications)
  if (rows.length === 0) return null

  const firstRow = rows[0]
  const moreItems = publications.slice(3)

  const title = sectionTitle?.trim()
  const viewAll = viewAllLabel?.trim()
  const viewAllUrl = viewAllHref?.trim()
  const showHeader = title || viewAll

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">

        {showHeader && (
        <div className="flex items-center justify-between mb-10">
          {title ? (
          <div className="flex items-center gap-0">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {title}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent rtl:bg-gradient-to-l" />
          </div>
          ) : <div />}
          {viewAll && viewAllUrl && (
          <Button
            href={viewAllUrl}
            variant="outline"
            size="sm"
            icon={<ArrowIcon className="w-4 h-4" />}
            className="shrink-0"
          >
            {viewAll}
          </Button>
          )}
        </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
            <Link
              href={`/${locale}/publications-reports/${firstRow.featured.slug}`}
              className={`lg:col-span-3 group relative rounded-2xl overflow-hidden shadow-xl min-h-[320px] lg:min-h-0 lg:h-full flex flex-col bg-primary-500 ${firstRow.side.length === 0 ? 'lg:col-span-5' : ''}`}
            >
                <Image
                  src={firstRow.featured.coverImage}
                  alt={firstRow.featured.title[locale]}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-60"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  unoptimized={isCmsHostedMediaUrl(firstRow.featured.coverImage)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent rtl:bg-gradient-to-l rtl:from-transparent rtl:to-black/40" />

                <div className="absolute top-5 start-5">
                  <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1.5">
                    {typeLabels[firstRow.featured.type]?.[locale] ?? firstRow.featured.type}
                  </span>
                </div>

                <div className="relative z-10 mt-auto p-7">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {firstRow.featured.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-white/70 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {tag[locale]}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors">
                    {firstRow.featured.title[locale]}
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2">
                    {firstRow.featured.summary[locale]}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white/50 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {firstRow.featured.publishDate.slice(0, 7)}
                      </span>
                      {firstRow.featured.pages && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          {firstRow.featured.pages} {locale === 'ar' ? 'صفحة' : 'pages'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(firstRow.featured.pdfUrl, '_blank'); }}
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

            {firstRow.side.length > 0 && (
            <div className="lg:col-span-2 flex flex-col gap-5 lg:h-full">
              {firstRow.side.map((pub) => (
                  <Link
                    key={pub.id}
                    href={`/${locale}/publications-reports/${pub.slug}`}
                    className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-secondary-200 hover:shadow-lg transition-all duration-300 min-h-[140px]"
                  >
                    <div className="relative w-32 shrink-0 self-stretch bg-neutral-100">
                      <Image
                        src={pub.coverImage}
                        alt={pub.title[locale]}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="128px"
                        unoptimized={isCmsHostedMediaUrl(pub.coverImage)}
                      />
                      <div className="absolute top-0 inset-x-0 h-1 bg-secondary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                    </div>

                    <div className="flex flex-col justify-between py-4 pe-4 flex-1 min-w-0">
                      <div>
                        <span className="inline-block text-xs font-bold text-secondary-600 bg-secondary-50 px-2.5 py-0.5 rounded-full mb-2">
                          {typeLabels[pub.type]?.[locale] ?? pub.type}
                        </span>
                        <h3 className="font-bold text-sm text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-500 transition-colors">
                          {pub.title[locale]}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {pub.summary[locale]}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
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
            )}
          </div>

          {moreItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {moreItems.map((pub) => (
              <Link
                key={pub.id}
                href={`/${locale}/publications-reports/${pub.slug}`}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-secondary-200 hover:shadow-lg transition-all duration-300 min-h-[140px]"
              >
                <div className="relative w-32 shrink-0 self-stretch bg-neutral-100">
                  <Image
                    src={pub.coverImage}
                    alt={pub.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                    unoptimized={isCmsHostedMediaUrl(pub.coverImage)}
                  />
                  <div className="absolute top-0 inset-x-0 h-1 bg-secondary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                </div>

                <div className="flex flex-col justify-between py-4 pe-4 flex-1 min-w-0">
                  <div>
                    <span className="inline-block text-xs font-bold text-secondary-600 bg-secondary-50 px-2.5 py-0.5 rounded-full mb-2">
                      {typeLabels[pub.type]?.[locale] ?? pub.type}
                    </span>
                    <h3 className="font-bold text-sm text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-500 transition-colors">
                      {pub.title[locale]}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {pub.summary[locale]}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
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
          )}
        </div>
      </div>
    </section>
  )
}
