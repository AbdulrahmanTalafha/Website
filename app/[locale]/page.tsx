import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildOrganizationSchema, buildWebsiteSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Hero from '@/components/home/Hero'
import HomeStats from '@/components/home/HomeStats'
import LatestPublications from '@/components/home/LatestPublications'
import ObservatoryPreview from '@/components/home/ObservatoryPreview'
import LatestNews from '@/components/home/LatestNews'
import ContentCarousel from '@/components/home/ContentCarousel'
import type { CarouselItem } from '@/components/home/ContentCarousel'
import { getProjects, getPublications, getNews, getObservatoryData, getInitiatives } from '@/lib/api'
import Button from '@/components/common/Button'
import PartnersCarousel from '@/components/home/PartnersCarousel'
import NewsTicker from '@/components/home/NewsTicker'
import { partnersData } from '@/data/partners'
import { ArrowRight, ArrowLeft, Vote, BookOpen, Eye } from 'lucide-react'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}`,
    customDescription: locale === 'ar'
      ? 'مركز We Rise للمواطنة والتنمية — منظمة مدنية أردنية تعمل في المواطنة الفاعلة، الديمقراطية، حقوق الإنسان، والحقوق الرقمية'
      : 'We Rise Center for Citizenship & Development — A Jordanian civil organization working in active citizenship, democracy, human rights, and digital rights',
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const [projects, publications, news, observatory, initiatives] = await Promise.all([
    getProjects(locale),
    getPublications(locale),
    getNews(locale),
    getObservatoryData(locale),
    getInitiatives(locale),
  ])

  const loc = locale as import('@/types').Locale

  const projectItems: CarouselItem[] = projects.slice(0, 6).map((p) => ({
    id: p.id,
    href: `/${loc}/programs-projects/${p.slug}`,
    title: p.title[loc],
    shortDescription: p.shortDescription[loc],
    image: p.featuredImage,
    badge: p.sector[loc],
    date: new Date(p.startDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))

  const initiativeItems: CarouselItem[] = initiatives.slice(0, 6).map((i) => ({
    id: i.id,
    href: `/${loc}/initiatives-campaigns`,
    title: i.title[loc],
    shortDescription: i.shortDescription[loc],
    image: i.featuredImage,
    badge: loc === 'ar' ? 'مبادرة' : 'Initiative',
    date: new Date(i.startDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))

  const publicationItems: CarouselItem[] = publications.slice(0, 6).map((pub) => ({
    id: pub.id,
    href: `/${loc}/publications-reports/${pub.slug}`,
    title: pub.title[loc],
    shortDescription: pub.summary[loc],
    image: pub.coverImage,
    badge: loc === 'ar'
      ? pub.type === 'guide' ? 'دليل' : pub.type === 'report' ? 'تقرير' : 'إصدار'
      : pub.type === 'guide' ? 'Guide' : pub.type === 'report' ? 'Report' : 'Publication',
    date: new Date(pub.publishDate).toLocaleDateString(loc === 'ar' ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' }),
  }))

  const orgSchema = buildOrganizationSchema(locale)
  const webSchema = buildWebsiteSchema(locale)

  return (
    <>
      <JsonLd data={[orgSchema, webSchema]} />

      {/* Hero */}
      <Hero locale={locale} />

      {/* Reports Ticker */}
      <NewsTicker
        locale={locale}
        items={publications.slice(0, 8).map((p) => ({ id: p.id, slug: p.slug, title: p.title[loc] }))}
        label={locale === 'ar' ? 'تقارير' : 'Latest Reports'}
        href={`/${locale}/publications-reports`}
      />

      {/* About teaser */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            <div data-reveal="up">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4 bg-secondary-50 text-secondary-600">
                {locale === 'ar' ? 'من نحن' : 'About Us'}
              </span>
              <h2 className="text-3xl lg:text-4xl font-black text-primary-500 mb-5 text-balance leading-tight">
                {locale === 'ar'
                  ? 'نعمل من أجل الحق والكرامة والمشاركة'
                  : 'We Work for Rights, Dignity & Participation'}
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                {locale === 'ar'
                  ? 'مركز We Rise للمواطنة والتنمية منظمة مدنية أردنية تأسست عام 2018 في عمّان. نعمل على تعزيز المشاركة المدنية الفاعلة، ودعم قيم الديمقراطية وحقوق الإنسان، ورصد الحقوق الرقمية وخطاب الكراهية الإلكتروني في الأردن.'
                  : 'We Rise Center for Citizenship and Development is a Jordanian civil organization founded in 2018 in Amman. We work to promote active civic participation, support democratic values and human rights, and monitor digital rights and online hate speech in Jordan.'}
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6">
                {locale === 'ar'
                  ? 'من خلال برامج متنوعة تشمل التدريب، والبحث، والمناصرة، والرصد الرقمي، نسعى لبناء مجتمع أكثر وعيًا وعدالةً ومشاركةً.'
                  : 'Through diverse programs including training, research, advocacy, and digital monitoring, we strive to build a more aware, just, and participatory society.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={`/${locale}/about`} variant="primary" size="md" icon={<ArrowIcon className="w-4 h-4" />}>
                  {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                </Button>
                <Button href={`/${locale}/team-governance`} variant="outline" size="md">
                  {locale === 'ar' ? 'فريق العمل' : 'Our Team'}
                </Button>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4" data-reveal-stagger>
              {[
                { icon: <Vote className="w-7 h-7 text-white" />, bg: 'bg-primary-500', title: locale === 'ar' ? 'الديمقراطية والانتخابات' : 'Democracy & Elections', desc: locale === 'ar' ? 'تعزيز المشاركة السياسية' : 'Promoting political participation' },
                { icon: <Eye className="w-7 h-7 text-white" />, bg: 'bg-secondary-500', title: locale === 'ar' ? 'الحقوق الرقمية' : 'Digital Rights', desc: locale === 'ar' ? 'رصد خطاب الكراهية الرقمي' : 'Monitoring digital hate speech' },
                { icon: <BookOpen className="w-7 h-7 text-white" />, bg: 'bg-secondary-500', title: locale === 'ar' ? 'البحث والتوثيق' : 'Research & Documentation', desc: locale === 'ar' ? 'إنتاج المعرفة والتقارير' : 'Knowledge production & reports' },
                { icon: <Vote className="w-7 h-7 text-white" />, bg: 'bg-primary-500', title: locale === 'ar' ? 'تمكين المرأة' : 'Women Empowerment', desc: locale === 'ar' ? 'المشاركة السياسية للمرأة' : "Women's political participation" },
              ].map((item) => (
                <div key={item.title} className="bg-neutral-50 rounded-2xl p-5 flex flex-col gap-3">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary-500 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-neutral-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications & Reports carousel */}
      <ContentCarousel
        locale={loc}
        items={publicationItems}
        sectionTitle={loc === 'ar' ? 'الإصدارات والتقارير' : 'Publications & Reports'}
        viewAllHref={`/${loc}/publications-reports`}
        viewAllLabel={loc === 'ar' ? 'عرض الكل' : 'View All'}
      />

      {/* Stats */}
      <HomeStats locale={locale} />

      {/* Projects & Programs carousel */}
      <ContentCarousel
        locale={loc}
        items={projectItems}
        sectionTitle={loc === 'ar' ? 'البرامج والمشاريع' : 'Programs & Projects'}
        viewAllHref={`/${loc}/programs-projects`}
        viewAllLabel={loc === 'ar' ? 'عرض الكل' : 'View All'}
      />

      {/* Observatory Preview */}
      <ObservatoryPreview locale={locale} stats={observatory.stats} />

      {/* Initiatives & Campaigns carousel */}
      <ContentCarousel
        locale={loc}
        items={initiativeItems}
        sectionTitle={loc === 'ar' ? 'المبادرات والحملات' : 'Initiatives & Campaigns'}
        viewAllHref={`/${loc}/initiatives-campaigns`}
        viewAllLabel={loc === 'ar' ? 'عرض الكل' : 'View All'}
      />

      {/* Latest Publications */}
      <LatestPublications locale={locale} publications={publications} />

      {/* E-Election CTA */}
      <section className="section-padding bg-primary-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-0 end-0 w-[480px] h-[480px] rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 start-0 w-[320px] h-[320px] rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="container-wide relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left / Start: text */}
            <div data-reveal="up">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <Vote className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'منصة رقمية' : 'Digital Platform'}
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                {locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform'}
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-lg">
                {locale === 'ar'
                  ? 'شارك في الانتخابات الإلكترونية الشفافة والموثوقة عبر منصة We Rise — تجربة ديمقراطية حديثة وآمنة في متناول يدك.'
                  : 'Participate in transparent and reliable electronic elections via the We Rise platform — a modern, secure democratic experience at your fingertips.'}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href={`/${locale}/e-election-platform`} variant="white" size="lg">
                  {locale === 'ar' ? 'استكشف المنصة' : 'Explore Platform'}
                </Button>
                <Button href={`/${locale}/e-election-platform`} variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
                  {locale === 'ar' ? 'الانتخابات الحالية' : 'Current Elections'}
                </Button>
              </div>
            </div>

            {/* Right / End: visual stats */}
            <div className="mt-12 lg:mt-0 grid grid-cols-2 gap-4" data-reveal-stagger>
              {[
                { value: '+٢٠٠', valueEn: '200+', label: locale === 'ar' ? 'انتخاب منجز' : 'Elections Completed' },
                { value: '+١٥ ألف', valueEn: '15K+', label: locale === 'ar' ? 'ناخب مسجّل' : 'Registered Voters' },
                { value: '٩٨٪', valueEn: '98%', label: locale === 'ar' ? 'نسبة الرضا' : 'Satisfaction Rate' },
                { value: '٢٤/٧', valueEn: '24/7', label: locale === 'ar' ? 'دعم مستمر' : 'Continuous Support' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm">
                  <p className="text-3xl font-black text-white mb-1">
                    {locale === 'ar' ? stat.value : stat.valueEn}
                  </p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <LatestNews locale={locale} news={news} />

      {/* Partners & Supporters Carousel */}
      <PartnersCarousel locale={locale} partners={partnersData} />

      {/* Contact CTA */}
      <section className="py-16 bg-primary-50">
        <div className="container-wide text-center" data-reveal="up">
          <h2 className="text-2xl lg:text-3xl font-black text-primary-500 mb-4">
            {locale === 'ar' ? 'تواصل معنا أو انضم إلينا' : 'Contact Us or Join Us'}
          </h2>
          <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
            {locale === 'ar'
              ? 'يسعدنا التعاون معك أو الإجابة على استفساراتك'
              : 'We would love to collaborate with you or answer your inquiries'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href={`/${locale}/contact`} variant="primary" size="lg">
              {locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}
            </Button>
            <Button href={`/${locale}/partners-supporters`} variant="outline" size="lg">
              {locale === 'ar' ? 'شركاؤنا' : 'Our Partners'}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
