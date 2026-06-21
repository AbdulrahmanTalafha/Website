import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import type { Publication } from '@/types'
import { Calendar, Download, FileText, ArrowRight, ArrowLeft } from 'lucide-react'

interface PublicationCardProps {
  publication: Publication
  locale: Locale
}

const typeLabels: Record<string, Record<string, string>> = {
  report: { ar: 'تقرير', en: 'Report' },
  study: { ar: 'دراسة', en: 'Study' },
  'policy-paper': { ar: 'ورقة سياسات', en: 'Policy Paper' },
  guide: { ar: 'دليل', en: 'Guide' },
  brief: { ar: 'موجز', en: 'Brief' },
}

const typeColors: Record<string, string> = {
  report: 'bg-blue-50 text-blue-700',
  study: 'bg-purple-50 text-purple-700',
  'policy-paper': 'bg-amber-50 text-amber-700',
  guide: 'bg-green-50 text-green-700',
  brief: 'bg-rose-50 text-rose-700',
}

export default function PublicationCard({ publication, locale }: PublicationCardProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const typeLabel = typeLabels[publication.type]?.[locale] ?? publication.type
  const typeColor = typeColors[publication.type] ?? 'bg-neutral-50 text-neutral-600'

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-neutral-100 card-hover flex flex-col group">
      {/* Cover */}
      <Link href={`/${locale}/publications-reports/${publication.slug}`} className="relative h-56 overflow-hidden block bg-neutral-100 shrink-0">
        <Image
          src={publication.coverImage}
          alt={publication.title[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={isCmsHostedMediaUrl(publication.coverImage)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {/* Type badge */}
        <span className={`absolute top-3 start-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}>
          {typeLabel}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/${locale}/publications-reports/${publication.slug}`}>
          <h3 className="font-bold text-base text-primary-500 mb-2 leading-snug group-hover:text-secondary-500 transition-colors line-clamp-2">
            {publication.title[locale]}
          </h3>
        </Link>

        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {publication.summary[locale]}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {publication.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="text-xs text-primary-500 bg-primary-50 px-2.5 py-1 rounded-full">
              {tag[locale]}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{publication.publishDate.slice(0, 7)}</span>
            {publication.pages && (
              <>
                <span>·</span>
                <FileText className="w-3.5 h-3.5" />
                <span>{publication.pages} {locale === 'ar' ? 'صفحة' : 'pages'}</span>
              </>
            )}
          </div>
          <a
            href={publication.pdfUrl}
            className="flex items-center gap-1 text-xs font-semibold text-secondary-500 hover:text-secondary-600 transition-colors"
            download
            aria-label={`Download ${publication.title[locale]}`}
          >
            <Download className="w-3.5 h-3.5" />
            {locale === 'ar' ? 'PDF' : 'PDF'}
          </a>
        </div>
      </div>
    </article>
  )
}
