import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import type { NewsItem } from '@/types'
import { Calendar, ArrowRight, ArrowLeft, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'

interface NewsCardProps {
  news: NewsItem
  locale: Locale
  featured?: boolean
}

const categoryLabels: Record<string, Record<string, string>> = {
  news: { ar: 'خبر', en: 'News' },
  'press-release': { ar: 'بيان صحفي', en: 'Press Release' },
  event: { ar: 'فعالية', en: 'Event' },
  announcement: { ar: 'إعلان', en: 'Announcement' },
}

const categoryColors: Record<string, string> = {
  news: 'bg-blue-50 text-blue-700',
  'press-release': 'bg-amber-50 text-amber-700',
  event: 'bg-green-50 text-green-700',
  announcement: 'bg-rose-50 text-rose-700',
}

export default function NewsCard({ news, locale, featured = false }: NewsCardProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight
  const catLabel = categoryLabels[news.category]?.[locale] ?? news.category
  const catColor = categoryColors[news.category] ?? 'bg-neutral-50 text-neutral-600'

  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden border border-neutral-100 card-hover group ${
        featured ? 'lg:grid lg:grid-cols-2' : 'flex flex-col'
      }`}
    >
      {/* Image */}
      <Link
        href={`/${locale}/media-center/${news.slug}`}
        className={`relative overflow-hidden block bg-neutral-100 ${featured ? 'h-full min-h-[240px]' : 'h-48'}`}
      >
        <Image
          src={news.image}
          alt={news.title[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={isCmsHostedMediaUrl(news.image)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 start-3 text-xs font-bold px-2.5 py-1 rounded-full ${catColor}`}>
          {catLabel}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={news.date}>{formatDate(news.date, locale)}</time>
          {news.author && <><span>·</span><span>{news.author[locale]}</span></>}
        </div>

        <Link href={`/${locale}/media-center/${news.slug}`}>
          <h3 className="font-bold text-base text-primary-500 mb-2 leading-snug group-hover:text-secondary-500 transition-colors line-clamp-2">
            {news.title[locale]}
          </h3>
        </Link>

        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {news.excerpt[locale]}
        </p>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {news.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="flex items-center gap-1 text-xs text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5" />
                {tag[locale]}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/${locale}/media-center/${news.slug}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-secondary-500 hover:text-secondary-600 transition-colors mt-auto"
        >
          {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )
}
