import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata, buildBreadcrumbSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHero from '@/components/common/PageHero'
import Button from '@/components/common/Button'
import { getElections } from '@/lib/api'
import { Vote, Users, CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/e-election-platform`,
    customTitle: locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform',
  })
}

const statusLabels: Record<string, Record<string, string>> = {
  active: { ar: 'جارية الآن', en: 'Active Now' },
  upcoming: { ar: 'قادمة', en: 'Upcoming' },
  completed: { ar: 'مكتملة', en: 'Completed' },
}
const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-neutral-100 text-neutral-600 border-neutral-200',
}

export default async function EElectionPage({ params }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const elections = await getElections(locale)

  const active = elections.filter(e => e.status === 'active')
  const upcoming = elections.filter(e => e.status === 'upcoming')
  const completed = elections.filter(e => e.status === 'completed')

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://werise.org.jo/${locale}` },
        { name: locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform', url: `https://werise.org.jo/${locale}/e-election-platform` },
      ])} />

      <PageHero
        locale={locale}
        title={locale === 'ar' ? 'منصة الانتخابات الإلكترونية' : 'E-Election Platform'}
        subtitle={locale === 'ar' ? 'نوفر بنية تحتية رقمية لإجراء انتخابات شفافة وموثوقة للمنظمات المدنية ومؤسسات المجتمع' : 'We provide digital infrastructure for transparent and reliable elections for civil society organizations and community institutions'}
        badge={locale === 'ar' ? 'منصة رقمية' : 'Digital Platform'}
        image="https://picsum.photos/seed/werise-election/1400/700"
        stats={[
          { value: `${elections.length}`, label: locale === 'ar' ? 'انتخاب' : 'Elections' },
          { value: `${active.length}`, label: locale === 'ar' ? 'جارية الآن' : 'Active Now' },
          { value: `${completed.length}`, label: locale === 'ar' ? 'مكتملة' : 'Completed' },
        ]}
      />

      {/* Features */}
      <section className="py-14 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle2 className="w-6 h-6 text-green-500" />, title: locale === 'ar' ? 'شفافية كاملة' : 'Full Transparency', desc: locale === 'ar' ? 'نتائج موثقة وقابلة للتحقق' : 'Verified and auditable results' },
              { icon: <Users className="w-6 h-6 text-primary-500" />, title: locale === 'ar' ? 'سهولة المشاركة' : 'Easy Participation', desc: locale === 'ar' ? 'تصويت إلكتروني آمن من أي مكان' : 'Secure online voting from anywhere' },
              { icon: <Vote className="w-6 h-6 text-secondary-500" />, title: locale === 'ar' ? 'دعم متخصص' : 'Specialized Support', desc: locale === 'ar' ? 'فريق فني لإدارة العملية الانتخابية' : 'Technical team to manage the electoral process' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 p-5 bg-neutral-50 rounded-2xl">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-black text-neutral-800 mb-1">{f.title}</h3>
                  <p className="text-neutral-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active elections */}
      {active.length > 0 && (
        <section id="active-elections" className="section-padding bg-green-50">
          <div className="container-wide">
            <h2 className="text-2xl font-black text-primary-500 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              {locale === 'ar' ? 'انتخابات جارية' : 'Active Elections'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {active.map(election => (
                <ElectionCard key={election.id} election={election} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="section-padding bg-neutral-50">
          <div className="container-wide">
            <h2 className="text-2xl font-black text-primary-500 mb-6">
              {locale === 'ar' ? 'انتخابات قادمة' : 'Upcoming Elections'}
            </h2>
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
        <section className="section-padding bg-white">
          <div className="container-wide">
            <h2 className="text-2xl font-black text-primary-500 mb-6">
              {locale === 'ar' ? 'انتخابات مكتملة' : 'Completed Elections'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completed.map(election => (
                <ElectionCard key={election.id} election={election} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function ElectionCard({ election, locale }: { election: import('@/types').Election; locale: Locale }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {election.image && (
        <div className="aspect-video overflow-hidden bg-neutral-100">
          <img src={election.image} alt={election.title[locale]} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[election.status]}`}>
            {statusLabels[election.status][locale]}
          </span>
          <span className="text-xs text-neutral-400">{election.type[locale]}</span>
        </div>
        <h3 className="font-black text-neutral-800 mb-2 text-lg">{election.title[locale]}</h3>
        <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{election.description[locale]}</p>
        <div className="flex flex-wrap gap-4 text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{election.startDate} — {election.endDate}</span>
          </div>
          {election.totalVoters && (
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{election.totalVoters.toLocaleString()} {locale === 'ar' ? 'ناخب' : 'voters'}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-neutral-400">{election.organization[locale]}</p>
      </div>
    </div>
  )
}
