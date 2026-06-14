import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildContactPageSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHero from '@/components/common/PageHero'
import { siteData } from '@/data/site'
import { MapPin, Phone, Mail, Globe, Send } from 'lucide-react'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const description = locale === 'ar'
    ? 'تواصل مع مركز We Rise للاستفسارات والشراكات والدعم في مجالات المواطنة والديمقراطية والحقوق الرقمية'
    : 'Contact We Rise Center for inquiries, partnerships, and support in citizenship, democracy, and digital rights'
  return buildMetadata({
    locale: locale as Locale,
    canonicalPath: `/${locale}/contact`,
    customTitle: locale === 'ar' ? 'تواصل معنا' : 'Contact Us',
    customDescription: description,
  })
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params
  const typedLocale = locale as Locale
  const { email, phone, address, social } = siteData
  const pageTitle = locale === 'ar' ? 'تواصل معنا' : 'Contact Us'
  const pageDescription = locale === 'ar'
    ? 'تواصل مع مركز We Rise للاستفسارات والشراكات والدعم في مجالات المواطنة والديمقراطية والحقوق الرقمية'
    : 'Contact We Rise Center for inquiries, partnerships, and support in citizenship, democracy, and digital rights'

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/contact` },
        ]),
        buildContactPageSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${BASE_URL}/${locale}/contact`,
          locale: typedLocale,
        }),
      ]} />

      <PageHero
        locale={typedLocale}
        title={pageTitle}
        subtitle={locale === 'ar' ? 'نسعد بالتواصل معكم ونستقبل استفساراتكم ومقترحاتكم' : "We're happy to hear from you — questions, suggestions, or partnership inquiries"}
        badge={locale === 'ar' ? 'تواصل' : 'Get in Touch'}
        image="https://picsum.photos/seed/werise-contact/1400/700"
      />

      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-black text-primary-500 mb-6">
                {locale === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      {locale === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
                      placeholder={locale === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
                      placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    {locale === 'ar' ? 'موضوع الرسالة' : 'Subject'} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors"
                    placeholder={locale === 'ar' ? 'موضوع رسالتك' : 'Message subject'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                    {locale === 'ar' ? 'الرسالة' : 'Message'} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors resize-none"
                    placeholder={locale === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full bg-primary-500 text-white rounded-xl py-3.5 font-bold hover:bg-primary-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  {locale === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-primary-500 text-lg mb-5">
                  {locale === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: <MapPin className="w-5 h-5 text-primary-400" />, label: locale === 'ar' ? 'العنوان' : 'Address', value: address[typedLocale] },
                    { icon: <Phone className="w-5 h-5 text-primary-400" />, label: locale === 'ar' ? 'الهاتف' : 'Phone', value: phone, href: `tel:${phone}` },
                    { icon: <Mail className="w-5 h-5 text-primary-400" />, label: locale === 'ar' ? 'البريد الإلكتروني' : 'Email', value: email, href: `mailto:${email}` },
                    { icon: <Globe className="w-5 h-5 text-primary-400" />, label: locale === 'ar' ? 'الموقع' : 'Website', value: 'werise.org.jo', href: 'https://werise.org.jo' },
                  ].map(({ icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">{icon}</div>
                      <div>
                        <div className="text-xs text-neutral-400 mb-0.5">{label}</div>
                        {href ? (
                          <a href={href} className="font-semibold text-neutral-700 hover:text-primary-500 transition-colors">{value}</a>
                        ) : (
                          <div className="font-semibold text-neutral-700">{value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-black text-primary-500 text-lg mb-4">
                  {locale === 'ar' ? 'تابعونا' : 'Follow Us'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(social).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-neutral-50 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition-colors capitalize"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-neutral-200 rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center text-neutral-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{locale === 'ar' ? 'الخريطة' : 'Map'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
