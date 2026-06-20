import type { Partner, Locale, PartnerCategory } from '@/types'
import Image from 'next/image'
import { isCmsHostedMediaUrl } from '@/lib/cmsMedia'
import { ExternalLink } from 'lucide-react'

const DEFAULT_CATEGORY_ORDER: PartnerCategory[] = [
  'donor',
  'international-partner',
  'local-partner',
]

const FALLBACK_CATEGORY_LABELS: Record<PartnerCategory, Record<Locale, string>> = {
  donor: { en: 'Donors', ar: 'الجهات المانحة' },
  'international-partner': { en: 'International Partners', ar: 'شركاء دوليون' },
  'local-partner': { en: 'Local Partners', ar: 'شركاء محليون' },
}

interface Props {
  partners: Partner[]
  locale: Locale
  categoryOrder?: string[]
  categoryLabels?: Record<string, string>
}

export default function PartnersList({
  partners,
  locale,
  categoryOrder = DEFAULT_CATEGORY_ORDER,
  categoryLabels = {},
}: Props) {
  const isRTL = locale === 'ar'

  const orderedCategories = categoryOrder.filter(
    (key): key is PartnerCategory =>
      DEFAULT_CATEGORY_ORDER.includes(key as PartnerCategory),
  )

  const getCategoryLabel = (category: PartnerCategory) =>
    categoryLabels[category] ?? FALLBACK_CATEGORY_LABELS[category][locale]

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide space-y-14">
        {orderedCategories.map((category) => {
          const items = partners.filter((p) => p.category === category)
          if (items.length === 0) return null

          return (
            <div key={category}>
              <h2 className="text-2xl font-black text-primary-500 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-secondary-500 rounded-full" />
                {getCategoryLabel(category)}
                <span className="text-lg text-neutral-400 font-normal">({items.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {items.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {partner.logo && (
                      <div className="relative w-20 h-16 mb-3">
                        <Image
                          src={partner.logo}
                          alt={partner.name[locale]}
                          fill
                          className="object-contain grayscale group-hover:grayscale-0 transition-all"
                          sizes="80px"
                          unoptimized={
                            partner.logo.endsWith('.svg') ||
                            partner.logo.startsWith('http') ||
                            isCmsHostedMediaUrl(partner.logo)
                          }
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-neutral-700 text-sm mb-1 leading-snug">
                      {partner.name[locale]}
                    </h3>
                    {partner.description && (
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-2">
                        {partner.description[locale]}
                      </p>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-400 hover:text-primary-600 flex items-center gap-1 mt-auto"
                      >
                        {isRTL ? 'الموقع' : 'Website'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
