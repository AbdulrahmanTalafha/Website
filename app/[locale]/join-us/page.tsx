import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildMetadata } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import JoinForm from '@/components/join/JoinForm'
import { getJoinPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveJoinPageSeo } from '@/lib/joinPageSeo'

interface PageProps { params: Promise<{ locale: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getJoinPageData(locale)
  const seo = resolveJoinPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/join-us`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex,
  })
}

function sectionVisible(
  connected: boolean,
  pageCms: Awaited<ReturnType<typeof getJoinPageData>>,
  key: 'application_form' | 'why_join',
): boolean {
  if (!connected) return true
  const section = pageCms?.sections?.[key]
  if (!section) return false
  return section.is_visible !== false
}

export default async function JoinUsPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'

  const pageCms = await getJoinPageData(locale)
  const connected = cmsConnected(pageCms)
  const seo = resolveJoinPageSeo(pageCms, locale)
  const hero = pageCms?.sections?.hero
  const applicationForm = pageCms?.sections?.application_form
  const whyJoin = pageCms?.sections?.why_join

  const pageTitle = cmsText(connected, hero?.title, isRTL ? 'انضم إلينا' : 'Join Us')
    ?? (isRTL ? 'انضم إلينا' : 'Join Us')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'كن جزءًا من فريق يعمل على تعزيز الديمقراطية وحقوق الإنسان والمواطنة الرقمية في الأردن'
      : 'Be part of a team working to strengthen democracy, human rights, and digital citizenship in Jordan',
  )

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'شاركنا' : 'Get Involved')

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, 'https://picsum.photos/seed/werise-join/1400/700')
    : 'https://picsum.photos/seed/werise-join/1400/700'

  const formTitle = cmsText(connected, applicationForm?.title, isRTL ? 'قدّم طلبك' : 'Submit Your Application')
  const formDescription = cmsText(
    connected,
    applicationForm?.description,
    isRTL
      ? 'أخبرنا كيف ترغب في المشاركة. سيراجع فريقنا طلبك وسيتواصل معك.'
      : 'Tell us how you would like to contribute. Our team will review your application and contact you.',
  )

  const whyTitle = cmsText(connected, whyJoin?.title, isRTL ? 'لماذا تنضم إلى We Rise؟' : 'Why Join We Rise?')
  const whySubtitle = cmsText(
    connected,
    whyJoin?.subtitle,
    isRTL
      ? 'انضم إلى فريق متعدد التخصصات ملتزم بصناعة التغيير الإيجابي'
      : 'Join a multidisciplinary team committed to positive change',
  )

  const whyItems = connected && whyJoin?.items?.length
    ? whyJoin.items
    : [
        {
          icon: '🎯',
          title: isRTL ? 'أثر ملموس' : 'Meaningful Impact',
          description: isRTL
            ? 'ساهم في برامج تعزز الديمقراطية وحقوق الإنسان والأمان الرقمي في الأردن.'
            : 'Contribute to programs that advance democracy, human rights, and digital safety in Jordan.',
        },
        {
          icon: '🌱',
          title: isRTL ? 'نمو مهني' : 'Professional Growth',
          description: isRTL
            ? 'طوّر مهاراتك في البحث والمناصرة وإدارة البرامج والعمل المجتمعي.'
            : 'Develop skills in research, advocacy, program management, and community engagement.',
        },
        {
          icon: '🤝',
          title: isRTL ? 'بيئة تعاونية' : 'Collaborative Culture',
          description: isRTL
            ? 'اعمل مع خبراء من المجتمع المدني والأوساط الأكاديمية والتقنية في بيئة داعمة.'
            : 'Work with experts from civil society, academia, and technology in an inclusive environment.',
        },
      ]

  const interests = pageCms?.config?.interests ?? {}

  const showForm = sectionVisible(connected, pageCms, 'application_form')
  const showWhy = sectionVisible(connected, pageCms, 'why_join')

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/join-us` },
        ]),
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
                <JoinForm
                  locale={locale}
                  formTitle={formTitle}
                  formDescription={formDescription}
                  interests={interests}
                />
              </div>
            )}

            {showWhy && (
              <div className={`space-y-5 ${showForm ? 'lg:col-span-2' : 'lg:col-span-5 max-w-3xl mx-auto'}`}>
                <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
                  <h3 className="font-black text-primary-500 text-lg mb-2">{whyTitle}</h3>
                  {whySubtitle && (
                    <p className="text-sm text-neutral-500 mb-5 leading-relaxed">{whySubtitle}</p>
                  )}
                  <div className="space-y-4">
                    {whyItems.map((item) => (
                      <div key={item.title} className="flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                        <div className="text-2xl shrink-0">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-primary-500 text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
