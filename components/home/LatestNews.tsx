import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import type { NewsItem } from '@/types'
import Button from '@/components/common/Button'
import { ArrowRight, ArrowLeft, Calendar, Tag } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface LatestNewsProps {
  locale: Locale
  news: NewsItem[]
}

const categoryLabels: Record<string, Record<string, string>> = {
  news: { ar: 'خبر', en: 'News' },
  'press-release': { ar: 'بيان صحفي', en: 'Press Release' },
  event: { ar: 'فعالية', en: 'Event' },
  announcement: { ar: 'إعلان', en: 'Announcement' },
}

export default function LatestNews({ locale, news }: LatestNewsProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const [featured, ...rest] = news.slice(0, 4)
  const side = rest.slice(0, 3)

  if (!featured) return null

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-0">
            <div className="w-1 h-9 bg-secondary-500 rounded-full shrink-0" />
            <span className="text-primary-500 text-xl md:text-2xl font-black px-3 tracking-tight leading-none">
              {locale === 'ar' ? 'آخر الأخبار والفعاليات' : 'Latest News & Events'}
            </span>
            <div className="hidden md:block h-px w-32 bg-gradient-to-r from-neutral-300 to-transparent" />
          </div>
          <Button
            href={`/${locale}/media-center`}
            variant="outline"
            size="sm"
            icon={<ArrowIcon className="w-4 h-4" />}
            className="shrink-0"
          >
            {locale === 'ar' ? 'المركز الإعلامي' : 'Media Center'}
          </Button>
        </div>

        {/* Grid: 1 big + 3 small */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">

          {/* Featured card */}
          <Link
            href={`/${locale}/media-center/${featured.slug}`}
            className="lg:col-span-3 group relative rounded-2xl overflow-hidden shadow-xl min-h-[480px] flex flex-col bg-primary-500"
          >
            <Image
              src={featured.image}
              alt={featured.title[locale]}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-60"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

            {/* Badge */}
            <div className="absolute top-5 start-5">
              <span className="bg-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-md">
                {categoryLabels[featured.category]?.[locale] ?? featured.category}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 mt-auto p-7">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-3">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={featured.date}>{formatDate(featured.date, locale)}</time>
                {featured.author && <><span>·</span><span>{featured.author[locale]}</span></>}
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight mb-3 group-hover:text-secondary-300 transition-colors">
                {featured.title[locale]}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-2">
                {featured.excerpt[locale]}
              </p>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary-400 group-hover:text-secondary-300 transition-colors">
                {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                <ArrowIcon className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Side cards */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {side.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}/media-center/${item.slug}`}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden border border-neutral-100 hover:border-secondary-200 hover:shadow-lg transition-all duration-300 flex-1"
              >
                {/* Thumbnail */}
                <div className="relative w-32 shrink-0 bg-neutral-100">
                  <Image
                    src={item.image}
                    alt={item.title[locale]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="128px"
                  />
                  <div className="absolute top-0 inset-x-0 h-1 bg-secondary-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-start" />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between py-4 pe-4 flex-1">
                  <div>
                    <span className="inline-block text-xs font-bold text-secondary-600 bg-secondary-50 px-2.5 py-0.5 rounded-full mb-2">
                      {categoryLabels[item.category]?.[locale] ?? item.category}
                    </span>
                    <h3 className="font-bold text-sm text-primary-500 leading-snug line-clamp-2 group-hover:text-secondary-500 transition-colors">
                      {item.title[locale]}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.excerpt[locale]}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-100 text-xs text-neutral-400">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={item.date}>{formatDate(item.date, locale)}</time>
                    {item.author && <><span>·</span><span>{item.author[locale]}</span></>}
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

