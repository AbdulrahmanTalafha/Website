import type { Metadata } from 'next'
import type { Locale } from '@/types'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildBreadcrumbSchema, buildMetadata, buildServiceSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Button from '@/components/common/Button'
import ElectionCard from '@/components/election/ElectionCard'
import { getElections } from '@/lib/api'
import {
  Vote, Users, Shield, Lock, BarChart3,
  ArrowRight, ArrowLeft, Sparkles,
} from 'lucide-react'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const description = locale === 'ar'
    ? 'منصة We Rise الرقمية لإدارة انتخابات إلكترونية شفافة وآمنة للمنظمات المدنية والمؤسسات المجتمعية'
    : 'We Rise digital platform for managing transparent and secure electronic elections for civil society and community institutions'
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/e-election-platform`,
    customTitle: locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform',
    customDescription: description,
  })
}

function SectionTitle({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className={`w-1 h-9 rounded-full shrink-0 ${accent ? 'bg-green-400' : 'bg-secondary-500'}`} />
      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{children}</h2>
    </div>
  )
}

export default async function EElectionPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'
  const Arrow = isRTL ? ArrowLeft : ArrowRight
  const elections = await getElections(locale)

  const active = elections.filter(e => e.status === 'active')
  const upcoming = elections.filter(e => e.status === 'upcoming')
  const completed = elections.filter(e => e.status === 'completed')
  const pageTitle = isRTL ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform'
  const pageDescription = isRTL
    ? 'منصة We Rise الرقمية لإدارة انتخابات إلكترونية شفافة وآمنة للمنظمات المدنية والمؤسسات المجتمعية'
    : 'We Rise digital platform for managing transparent and secure electronic elections for civil society and community institutions'

  const heroStats = [
    { value: String(elections.length), label: isRTL ? 'انتخاب' : 'Elections' },
    { value: String(active.length), label: isRTL ? 'جارية الآن' : 'Active Now' },
    { value: String(completed.length), label: isRTL ? 'مكتملة' : 'Completed' },
  ]

  const features = [
    {
      icon: Shield,
      color: 'text-green-400',
      bg: 'bg-green-500/15 border-green-500/25',
      title: isRTL ? 'شفافية كاملة' : 'Full Transparency',
      desc: isRTL ? 'نتائج موثقة وقابلة للتحقق مع سجل تدقيق كامل' : 'Verified, auditable results with a full audit trail',
    },
    {
      icon: Lock,
      color: 'text-blue-300',
      bg: 'bg-blue-500/15 border-blue-500/25',
      title: isRTL ? 'تصويت آمن' : 'Secure Voting',
      desc: isRTL ? 'تشفير وحماية بيانات الناخبين وفق أفضل الممارسات' : 'Encryption and voter data protection following best practices',
    },
    {
      icon: Users,
      color: 'text-secondary-400',
      bg: 'bg-secondary-500/15 border-secondary-500/25',
      title: isRTL ? 'سهولة المشاركة' : 'Easy Participation',
      desc: isRTL ? 'تصويت إلكتروني من أي مكان مع واجهة بسيطة للناخبين' : 'Online voting from anywhere with a simple voter interface',
    },
    {
      icon: BarChart3,
      color: 'text-purple-300',
      bg: 'bg-purple-500/15 border-purple-500/25',
      title: isRTL ? 'نتائج فورية' : 'Instant Results',
      desc: isRTL ? 'إحصاءات ونتائج مباشرة بعد إغلاق التصويت' : 'Live statistics and results as soon as voting closes',
    },
  ]

  const steps = [
    { n: '01', title: isRTL ? 'التسجيل والإعداد' : 'Setup & Registration', desc: isRTL ? 'تعريف الناخبين والمرشحين وإعداد الدوائر' : 'Define voters, candidates, and electoral districts' },
    { n: '02', title: isRTL ? 'فترة التصويت' : 'Voting Period', desc: isRTL ? 'تصويت آمن عبر المنصة مع مراقبة فورية' : 'Secure platform voting with real-time monitoring' },
    { n: '03', title: isRTL ? 'الفرز والتدقيق' : 'Count & Audit', desc: isRTL ? 'فرز تلقائي مع سجلات تدقيق قابلة للمراجعة' : 'Automated counting with reviewable audit logs' },
    { n: '04', title: isRTL ? 'إعلان النتائج' : 'Results Published', desc: isRTL ? 'نتائج شفافة مع تقارير قابلة للتصدير' : 'Transparent results with exportable reports' },
  ]

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/e-election-platform` },
        ]),
        buildServiceSchema({
          name: pageTitle,
          description: pageDescription,
          url: `${BASE_URL}/${locale}/e-election-platform`,
          locale,
        }),
      ]} />

      {/* Hero */}
      <section id="about" className="relative min-h-[58vh] flex items-end overflow-hidden scroll-mt-24">
        <Image
          src="https://picsum.photos/seed/werise-election-dark/1920/1080"
          alt=""
          fill
          className="object-cover opacity-25 scale-105"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/85 to-primary-900/60" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -top-32 end-0 w-[500px] h-[500px] rounded-full bg-secondary-500/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 start-0 w-[400px] h-[400px] rounded-full bg-green-500/8 blur-3xl" />

        <div className="relative z-10 container-wide pb-14 pt-28 w-full">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white text-xs font-black px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
            <Vote className="w-3.5 h-3.5 text-secondary-400" />
            {isRTL ? 'منصة رقمية' : 'Digital Platform'}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl mb-5">
            {pageTitle}
          </h1>
          <p className="text-white/65 text-base md:text-lg max-w-2xl leading-relaxed mb-10">
            {isRTL
              ? 'نوفر بنية تحتية رقمية لإجراء انتخابات شفافة وموثوقة للمنظمات المدنية ومؤسسات المجتمع — تجربة ديمقراطية حديثة وآمنة.'
              : 'We provide digital infrastructure for transparent, reliable elections for civil society and community institutions — a modern, secure democratic experience.'}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-4 min-w-[120px]"
              >
                <div className="text-2xl md:text-3xl font-black text-white">{stat.value}</div>
                <div className="text-xs font-bold text-white/45 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {active.length > 0 && (
              <Button href="#voting" variant="white" size="lg" icon={<Arrow className="w-4 h-4" />}>
                {isRTL ? 'الانتخابات الجارية' : 'Active Elections'}
              </Button>
            )}
            <Button
              href={`/${locale}/contact`}
              variant="outline"
              size="lg"
              className="border-white/25 text-white hover:bg-white/10 hover:text-white hover:border-white/40"
            >
              {isRTL ? 'اطلب منصة انتخابات' : 'Request a Platform'}
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 md:py-20 border-t border-white/5">
        <div className="container-wide">
          <SectionTitle>{isRTL ? 'لماذا منصتنا؟' : 'Why Our Platform?'}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="font-black text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-16 md:py-20 bg-white/[0.02] border-t border-white/5">
        <div className="container-wide">
          <SectionTitle>{isRTL ? 'كيف تعمل المنصة؟' : 'How It Works'}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={step.n} className="relative rounded-2xl border border-white/10 bg-primary-800/40 p-6">
                <span className="text-secondary-400 font-black text-sm tracking-widest">{step.n}</span>
                <h3 className="font-black text-white mt-2 mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -end-3 w-6 h-px bg-white/15" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active elections */}
      {active.length > 0 && (
        <section id="voting" className="relative section-padding scroll-mt-24">
          <div className="container-wide">
            <SectionTitle accent>
              <span className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                {isRTL ? 'انتخابات جارية' : 'Active Elections'}
              </span>
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {active.map((election, i) => (
                <ElectionCard key={election.id} election={election} locale={locale} featured={i === 0 && active.length === 1} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="relative section-padding border-t border-white/5">
          <div className="container-wide">
            <SectionTitle>{isRTL ? 'انتخابات قادمة' : 'Upcoming Elections'}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map(election => (
                <ElectionCard key={election.id} election={election} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section id="results" className="relative section-padding border-t border-white/5 scroll-mt-24">
          <div className="container-wide">
            <SectionTitle>{isRTL ? 'انتخابات مكتملة' : 'Completed Elections'}</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map(election => (
                <ElectionCard key={election.id} election={election} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="faq" className="relative py-16 md:py-20 border-t border-white/5 scroll-mt-24">
        <div className="container-wide">
          <SectionTitle>{isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {[
              {
                q: isRTL ? 'من يمكنه استخدام منصة الانتخابات؟' : 'Who can use the election platform?',
                a: isRTL
                  ? 'المنظمات المدنية، النقابات، الجمعيات، والمؤسسات المجتمعية التي تحتاج انتخابات شفافة وآمنة.'
                  : 'Civil society organizations, unions, associations, and community institutions that need transparent, secure elections.',
              },
              {
                q: isRTL ? 'هل التصويت آمن؟' : 'Is voting secure?',
                a: isRTL
                  ? 'نعم — تستخدم المنصة تشفير وحماية بيانات الناخبين وفق أفضل الممارسات مع سجلات تدقيق قابلة للمراجعة.'
                  : 'Yes — the platform uses encryption and voter data protection following best practices, with reviewable audit logs.',
              },
              {
                q: isRTL ? 'كيف يمكن طلب المنصة؟' : 'How can we request the platform?',
                a: isRTL
                  ? 'تواصل معنا عبر صفحة تواصل معنا وسيقوم فريق We Rise بمساعدتكم في التخطيط والإعداد.'
                  : 'Contact us through the Contact page and the We Rise team will help you plan and set up your election.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="font-black text-white mb-2">{item.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 md:py-20 border-t border-white/10">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-primary-800 to-primary-900 p-8 md:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(250,56,46,0.15) 0%, transparent 55%)' }} />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 text-secondary-400 text-xs font-black uppercase tracking-widest mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isRTL ? 'ابدأ انتخاباتك' : 'Start Your Election'}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-3 leading-tight">
                  {isRTL
                    ? 'هل تحتاج منصة انتخابات إلكترونية لمنظمتك'
                    : 'Need an electronic election platform for your organization?'}
                </h2>
                <p className="text-white/55 leading-relaxed">
                  {isRTL
                    ? 'فريق We Rise يدعمكم في تصميم وإدارة عملية انتخابية شفافة وآمنة — من الإعداد حتى إعلان النتائج.'
                    : 'The We Rise team supports you in designing and running a transparent, secure election — from setup through results.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button href={`/${locale}/contact`} variant="white" size="lg" icon={<Arrow className="w-4 h-4" />}>
                  {isRTL ? 'تواصل معنا' : 'Contact Us'}
                </Button>
                <Link
                  href={`/${locale}/about`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/80 text-sm font-bold hover:bg-white/10 hover:text-white transition-colors"
                >
                  {isRTL ? 'تعرف على We Rise' : 'About We Rise'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
