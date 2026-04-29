import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHero from '@/components/common/PageHero'
import { getPartners } from '@/lib/api'
import { ExternalLink, Handshake } from 'lucide-react'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/partners-supporters`,
    customTitle: locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Supporters',
  })
}

const categoryLabels: Record<string, Record<string, string>> = {
  'local-partner': { ar: 'شركاء محليون', en: 'Local Partners' },
  'international-partner': { ar: 'شركاء دوليون', en: 'International Partners' },
  'donor': { ar: 'الجهات المانحة', en: 'Donors' },
  'network': { ar: 'الشبكات والتحالفات', en: 'Networks & Coalitions' },
}

export default async function PartnersPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const partners = await getPartners(locale)

  const categories = ['donor', 'international-partner', 'local-partner', 'network']

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://werise.org.jo/${locale}` },
        { name: locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Supporters', url: `https://werise.org.jo/${locale}/partners-supporters` },
      ])} />

      <PageHero
        locale={locale}
        title={locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Supporters'}
        subtitle={locale === 'ar' ? 'نتعاون مع منظمات محلية ودولية لتحقيق أهدافنا المشتركة في تعزيز الديمقراطية وحقوق الإنسان' : 'We collaborate with local and international organizations to achieve shared goals in advancing democracy and human rights'}
        badge={locale === 'ar' ? 'شركاؤنا' : 'Our Partners'}
        image="https://picsum.photos/seed/werise-partners/1400/700"
        stats={[
          { value: `${partners.length}`, label: locale === 'ar' ? 'شريك وداعم' : 'Partners & Donors' },
        ]}
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-wide space-y-14">
          {categories.map(category => {
            const items = partners.filter(p => p.category === category)
            if (items.length === 0) return null
            return (
              <div key={category}>
                <h2 className="text-2xl font-black text-primary-500 mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-secondary-500 rounded-full" />
                  {categoryLabels[category][locale]}
                  <span className="text-lg text-neutral-400 font-normal">({items.length})</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {items.map(partner => (
                    <div key={partner.id} className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow group">
                      {partner.logo && (
                        <div className="w-20 h-16 mb-3 flex items-center justify-center">
                          <img
                            src={partner.logo}
                            alt={partner.name[locale]}
                            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-neutral-700 text-sm mb-1 leading-snug">{partner.name[locale]}</h3>
                      {partner.description && (
                        <p className="text-xs text-neutral-400 line-clamp-2 mb-2">{partner.description[locale]}</p>
                      )}
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-400 hover:text-primary-600 flex items-center gap-1 mt-auto"
                        >
                          {locale === 'ar' ? 'الموقع' : 'Website'}
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
    </>
  )
}
