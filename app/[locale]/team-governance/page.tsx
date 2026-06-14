import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildMetadata, buildBreadcrumbSchema, buildPersonSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import PageHero from '@/components/common/PageHero'
import SectionHeader from '@/components/common/SectionHeader'
import TeamMemberCard from '@/components/team/TeamMemberCard'
import { getTeam } from '@/lib/api'
import { governanceData } from '@/data/team'
import { Users, Building } from 'lucide-react'

interface TeamPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/team-governance`,
    customTitle: locale === 'ar' ? 'الفريق والحوكمة' : 'Team & Governance',
    customDescription: locale === 'ar'
      ? 'تعرف على فريق مركز We Rise وهيكل الحوكمة المؤسسية'
      : 'Meet the We Rise Center team and institutional governance structure',
  })
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params as { locale: Locale }
  const team = await getTeam(locale)

  const personSchemas = team.map((m) =>
    buildPersonSchema({
      name: m.name[locale],
      jobTitle: m.position[locale],
      email: m.email,
      image: m.photo,
    })
  )

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: locale === 'ar' ? 'الفريق والحوكمة' : 'Team & Governance', url: `${BASE_URL}/${locale}/team-governance` },
        ]),
        ...personSchemas,
      ]} />

      <PageHero
        locale={locale}
        title={locale === 'ar' ? 'الفريق والحوكمة' : 'Team & Governance'}
        subtitle={locale === 'ar' ? 'فريق متخصص ومتعدد الكفاءات يعمل لتحقيق رؤية المركز وتنفيذ برامجه' : "A specialized and multi-talented team working to achieve the Center's vision and implement its programs"}
        badge={locale === 'ar' ? 'فريقنا' : 'Our Team'}
        image="https://picsum.photos/seed/werise-team/1400/700"
        stats={[
          { value: `${team.length}`, label: locale === 'ar' ? 'عضو فريق' : 'Team Members' },
        ]}
      />

      {/* Team grid */}
      <section className="section-padding bg-neutral-50">
        <div className="container-wide">
          <SectionHeader
            title={locale === 'ar' ? 'فريق العمل' : 'The Team'}
            subtitle={locale === 'ar'
              ? 'يضم فريقنا خبراء من مختلف التخصصات المدنية والأكاديمية والتقنية'
              : 'Our team includes experts from various civil, academic, and technical specialties'
            }
            label={locale === 'ar' ? `${team.length} عضو` : `${team.length} Members`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <TeamMemberCard key={member.id} member={member} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <SectionHeader
            title={locale === 'ar' ? 'الهيكل المؤسسي والحوكمة' : 'Institutional Structure & Governance'}
            subtitle={locale === 'ar'
              ? 'نلتزم بمعايير الحوكمة الرشيدة والشفافية في جميع مستويات إدارة المركز'
              : 'We are committed to good governance standards and transparency at all levels of Center management'
            }
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {governanceData.map((body) => (
              <div key={body.id} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Building className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-primary-500 text-lg">{body.title[locale]}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{body.description[locale]}</p>
                <div className="flex flex-wrap gap-2">
                  {body.members.map((mid) => {
                    const member = team.find((m) => m.id === mid)
                    if (!member) return null
                    return (
                      <span key={mid} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-medium">
                        {member.name[locale]}
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Org chart — modern design */}
          <div className="relative overflow-hidden rounded-3xl border border-neutral-100" style={{background: 'linear-gradient(135deg, #f8f9ff 0%, #eef0fb 50%, #f5f0ff 100%)'}}>
            {/* Decorative bg circles */}
            <div className="absolute -top-20 -end-20 w-64 h-64 rounded-full bg-primary-500/5 pointer-events-none" />
            <div className="absolute -bottom-16 -start-16 w-48 h-48 rounded-full bg-secondary-500/5 pointer-events-none" />

            <div className="relative p-10">
              <div className="flex items-center justify-center gap-3 mb-12">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-secondary-400" />
                <h3 className="font-black text-primary-500 text-2xl tracking-tight">
                  {locale === 'ar' ? 'الهيكل التنظيمي' : 'Organizational Structure'}
                </h3>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-secondary-400" />
              </div>

              {/* Level 1 — CEO */}
              <div className="flex justify-center mb-2">
                <div className="relative bg-primary-500 text-white rounded-2xl px-10 py-5 text-center shadow-xl shadow-primary-500/30 min-w-[260px] border border-primary-400">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full">
                    {locale === 'ar' ? 'القيادة' : 'Leadership'}
                  </div>
                  <p className="text-primary-200 text-xs font-semibold mb-1">{locale === 'ar' ? 'الإدارة العليا' : 'Senior Management'}</p>
                  <p className="font-black text-xl">{locale === 'ar' ? 'المديرة العامة' : 'General Director'}</p>
                  <p className="text-primary-200 text-xs mt-1">{locale === 'ar' ? 'ليلى الحسن' : 'Layla Al-Hassan'}</p>
                </div>
              </div>

              {/* SVG connector lines */}
              <div className="relative flex justify-center" style={{height: 60}}>
                <svg width="700" height="60" viewBox="0 0 700 60" className="absolute" style={{maxWidth:'100%'}}>
                  {/* vertical from top */}
                  <line x1="350" y1="0" x2="350" y2="30" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  {/* horizontal bar */}
                  <line x1="117" y1="30" x2="583" y2="30" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  {/* verticals down to depts */}
                  <line x1="117" y1="30" x2="117" y2="60" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  <line x1="350" y1="30" x2="350" y2="60" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  <line x1="583" y1="30" x2="583" y2="60" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                </svg>
              </div>

              {/* Level 2 — Departments */}
              <div className="grid grid-cols-3 gap-5 mb-2">
                {[
                  { label: locale === 'ar' ? 'البرامج' : 'Programs', icon: '🎯', sub: locale === 'ar' ? 'إدارة وتنفيذ' : 'Management & Execution' },
                  { label: locale === 'ar' ? 'البحث والتطوير' : 'Research & Dev', icon: '🔬', sub: locale === 'ar' ? 'توثيق وتحليل' : 'Documentation & Analysis' },
                  { label: locale === 'ar' ? 'الحقوق الرقمية' : 'Digital Rights', icon: '🛡️', sub: locale === 'ar' ? 'رصد وحماية' : 'Monitoring & Protection' },
                ].map((dept) => (
                  <div key={dept.label} className="bg-secondary-500 text-white rounded-2xl px-4 py-4 text-center shadow-lg shadow-secondary-500/25 border border-secondary-400">
                    <div className="text-2xl mb-1">{dept.icon}</div>
                    <p className="font-black text-sm">{dept.label}</p>
                    <p className="text-secondary-100 text-xs mt-0.5 font-medium">{dept.sub}</p>
                  </div>
                ))}
              </div>

              {/* SVG connector lines level 2→3 */}
              <div className="relative flex justify-center" style={{height: 40}}>
                <svg width="700" height="40" viewBox="0 0 700 40" className="absolute" style={{maxWidth:'100%'}}>
                  <line x1="117" y1="0" x2="117" y2="40" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  <line x1="350" y1="0" x2="350" y2="40" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                  <line x1="583" y1="0" x2="583" y2="40" stroke="#c7c9e0" strokeWidth="2" strokeDasharray="4 2"/>
                </svg>
              </div>

              {/* Level 3 — Roles */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                  { roles: [locale === 'ar' ? 'مدير البرامج' : 'Programs Manager', locale === 'ar' ? 'منسق المشاريع' : 'Project Coordinator'], color: 'border-secondary-200 bg-white' },
                  { roles: [locale === 'ar' ? 'باحثة أولى' : 'Senior Researcher', locale === 'ar' ? 'باحثة' : 'Researcher'], color: 'border-secondary-200 bg-white' },
                  { roles: [locale === 'ar' ? 'ضابط الحقوق الرقمية' : 'Digital Rights Officer', locale === 'ar' ? 'التواصل والإعلام' : 'Comm. & Media'], color: 'border-secondary-200 bg-white' },
                ].map((col, gi) => (
                  <div key={gi} className="flex flex-col gap-2">
                    {col.roles.map((role) => (
                      <div key={role} className={`${col.color} border rounded-xl px-4 py-3 text-center shadow-sm hover:shadow-md hover:border-primary-300 transition-all`}>
                        <div className="w-2 h-2 rounded-full bg-secondary-400 mx-auto mb-2" />
                        <p className="text-xs font-bold text-primary-500">{role}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Support strip */}
              <div className="border-t-2 border-dashed border-primary-200 pt-6">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
                  {locale === 'ar' ? 'الأقسام الداعمة' : 'Support Units'}
                </p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {[
                    { label: locale === 'ar' ? 'المالية والإدارة' : 'Finance & Admin', icon: '💼' },
                    { label: locale === 'ar' ? 'التواصل والإعلام' : 'Comm. & Media', icon: '📢' },
                    { label: locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Donors', icon: '🤝' },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2 bg-white border border-primary-100 rounded-full px-5 py-2 shadow-sm">
                      <span className="text-sm">{s.icon}</span>
                      <p className="text-xs font-bold text-primary-400">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
