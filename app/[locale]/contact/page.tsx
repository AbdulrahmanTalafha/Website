import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildContactPageSchema } from '@/lib/seo'
import { buildCmsPageMetadata } from '@/lib/buildCmsPageMetadata'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import ContactForm from '@/components/contact/ContactForm'
import { getContactPageData, getSettings } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveContactPageSeo } from '@/lib/contactPageSeo'
import { resolveSiteSettings } from '@/lib/siteSettings'
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'

interface PageProps { params: Promise<{ locale: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const [pageCms, settings] = await Promise.all([
    getContactPageData(locale),
    getSettings(locale),
  ])
  const site = resolveSiteSettings(settings, locale)
  const seo = resolveContactPageSeo(pageCms, locale)

  return buildCmsPageMetadata(site, {
    locale,
    canonicalPath: `/${locale}/contact`,
    title: seo.title,
    description: seo.description,
    noIndex: seo.noIndex,
  })
}

function sectionVisible(
  connected: boolean,
  pageCms: Awaited<ReturnType<typeof getContactPageData>>,
  key: 'contact_form' | 'contact_info' | 'map',
): boolean {
  if (!connected) return true
  const section = pageCms?.sections?.[key]
  if (!section) return false
  return section.is_visible !== false
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'

  const [pageCms, cmsSettings] = await Promise.all([
    getContactPageData(locale),
    getSettings(locale),
  ])

  const connected = cmsConnected(pageCms)
  const site = resolveSiteSettings(cmsSettings, locale)
  const seo = resolveContactPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero
  const contactForm = pageCms?.sections?.contact_form
  const contactInfo = pageCms?.sections?.contact_info
  const mapSection = pageCms?.sections?.map

  const pageTitle = cmsText(connected, hero?.title, isRTL ? 'تواصل معنا' : 'Contact Us')
    ?? (isRTL ? 'تواصل معنا' : 'Contact Us')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'نسعد بالتواصل معكم ونستقبل استفساراتكم ومقترحاتكم'
      : "We're happy to hear from you — questions, suggestions, or partnership inquiries",
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'تواصل' : 'Get in Touch')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, placeholderPhotoUrl('werise-contact', 1400, 700))
    : placeholderPhotoUrl('werise-contact', 1400, 700)

  const formTitle = cmsText(connected, contactForm?.title, isRTL ? 'أرسل رسالة' : 'Send a Message')
  const formDescription = cmsText(
    connected,
    contactForm?.description,
    isRTL
      ? 'أرسل رسالتك وسيتواصل معك فريقنا في أقرب وقت.'
      : 'Fill out the form and our team will get back to you as soon as possible.',
  )

  const infoTitle = cmsText(connected, contactInfo?.title, isRTL ? 'معلومات التواصل' : 'Contact Information')
  const socialTitle = cmsText(connected, contactInfo?.subtitle, isRTL ? 'تابعونا' : 'Follow Us')
  const mapTitle = cmsText(connected, mapSection?.title, isRTL ? 'موقعنا' : 'Our Location')

  const websiteUrl = connected && contactInfo?.website_url?.trim()
    ? contactInfo.website_url.trim()
    : site.url

  const websiteLabel = connected && contactInfo?.website_label?.trim()
    ? contactInfo.website_label.trim()
    : 'werise.org.jo'

  const showForm = sectionVisible(connected, pageCms, 'contact_form')
  const showInfo = sectionVisible(connected, pageCms, 'contact_info')
  const showMap = sectionVisible(connected, pageCms, 'map')
  const showSocial = !connected || contactInfo?.show_social !== false

  const socialEntries = Object.entries(site.social).filter(([, url]) => url?.trim())

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/contact` },
        ]),
        buildContactPageSchema({
          name: pageTitle,
          description: seo.description,
          url: `${BASE_URL}/${locale}/contact`,
          locale,
          site,
        }),
      ]} />

      <PageHero
        locale={locale}
        title={pageTitle}
        subtitle={pageSubtitle ?? undefined}
        badge={pageBadge ?? undefined}
        image={heroImage}
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {showForm && (
              <div className="lg:col-span-3">
                <ContactForm
                  locale={locale}
                  formTitle={formTitle}
                  formDescription={formDescription}
                />
              </div>
            )}

            {(showInfo || showMap) && (
              <div className={`space-y-5 ${showForm ? 'lg:col-span-2' : 'lg:col-span-5 max-w-2xl mx-auto'}`}>
                {showInfo && (
                  <>
                    <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
                      <h3 className="font-black text-primary-500 text-lg mb-5">{infoTitle}</h3>
                      <div className="space-y-4">
                        {[
                          {
                            icon: <MapPin className="w-5 h-5 text-secondary-500" />,
                            label: isRTL ? 'العنوان' : 'Address',
                            value: site.contact.address,
                          },
                          {
                            icon: <Phone className="w-5 h-5 text-secondary-500" />,
                            label: isRTL ? 'الهاتف' : 'Phone',
                            value: site.contact.phone,
                            href: `tel:${site.contact.phone}`,
                          },
                          {
                            icon: <Mail className="w-5 h-5 text-secondary-500" />,
                            label: isRTL ? 'البريد الإلكتروني' : 'Email',
                            value: site.contact.email,
                            href: `mailto:${site.contact.email}`,
                          },
                          {
                            icon: <Globe className="w-5 h-5 text-secondary-500" />,
                            label: isRTL ? 'الموقع' : 'Website',
                            value: websiteLabel,
                            href: websiteUrl,
                          },
                        ].map(({ icon, label, value, href }) => (
                          <div key={label} className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                              {icon}
                            </div>
                            <div>
                              <div className="text-xs text-neutral-400 mb-0.5">{label}</div>
                              {href ? (
                                <a href={href} className="font-semibold text-neutral-700 hover:text-primary-500 transition-colors">
                                  {value}
                                </a>
                              ) : (
                                <div className="font-semibold text-neutral-700">{value}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {showSocial && socialEntries.length > 0 && (
                      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
                        <h3 className="font-black text-primary-500 text-lg mb-4">{socialTitle}</h3>
                        <div className="flex flex-wrap gap-3">
                          {socialEntries.map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-neutral-50 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors capitalize"
                            >
                              {platform === 'x' ? 'X' : platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {showMap && (
                  <div className="rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm overflow-hidden">
                    {mapSection?.map_embed_url ? (
                      <div>
                        {mapTitle && (
                          <h3 className="font-black text-primary-500 text-lg mb-3 px-2">{mapTitle}</h3>
                        )}
                        <div className="relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3] min-h-[200px]">
                          <iframe
                            src={mapSection.map_embed_url}
                            className="absolute inset-0 w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={mapTitle ?? 'Map'}
                            allowFullScreen
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-neutral-100 aspect-[4/3] min-h-[200px] flex items-center justify-center">
                        <div className="text-center text-neutral-400">
                          <MapPin className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">{mapTitle ?? (isRTL ? 'الخريطة' : 'Map')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
