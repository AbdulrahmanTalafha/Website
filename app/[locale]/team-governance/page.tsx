import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { BASE_URL, buildBreadcrumbSchema, buildMetadata, buildPersonSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import PageHero from '@/components/common/PageHero'
import SectionHeader from '@/components/common/SectionHeader'
import TeamMemberCard from '@/components/team/TeamMemberCard'
import TeamOrgChart from '@/components/team/TeamOrgChart'
import { getTeam } from '@/lib/api'
import { getTeamPageData } from '@/lib/cms'
import { cmsConnected, cmsSectionVisible, cmsText } from '@/lib/cmsHomeContent'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { resolveTeamPageSeo } from '@/lib/teamPageSeo'
import { governanceData } from '@/data/team'
import { Building } from 'lucide-react'

interface TeamPageProps {
  params: Promise<{ locale: string }>
}

export const revalidate = 60

export async function generateMetadata({ params }: TeamPageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const pageCms = await getTeamPageData(locale)
  const seo = resolveTeamPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/team-governance`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: seo.noIndex,
  })
}

function buildHeroStats(
  connected: boolean,
  useLiveStats: boolean,
  cmsStats: Array<{ value: string; suffix?: string; label: string }> | undefined,
  teamCount: number,
) {
  if (connected && useLiveStats) {
    return cmsStats?.length
      ? cmsStats.map((s) => ({
          value: `${teamCount}${s.suffix ?? ''}`,
          label: s.label,
        }))
      : [{ value: `${teamCount}`, label: '' }]
  }

  if (connected && cmsStats?.length) {
    return cmsStats.map((s) => ({
      value: `${s.value}${s.suffix ?? ''}`,
      label: s.label,
    }))
  }

  return [{ value: `${teamCount}`, label: '' }]
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { locale } = await params as { locale: Locale }
  const isRTL = locale === 'ar'

  const [team, pageCms] = await Promise.all([
    getTeam(locale),
    getTeamPageData(locale),
  ])

  const connected = cmsConnected(pageCms)
  const cms = pageCms?.sections
  const hero = cms?.hero
  const teamGrid = cms?.team_grid
  const governance = cms?.governance

  const pageTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'الفريق والحوكمة' : 'Team & Governance',
  ) ?? (isRTL ? 'الفريق والحوكمة' : 'Team & Governance')

  const pageSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'فريق متخصص ومتعدد الكفاءات يعمل لتحقيق رؤية المركز وتنفيذ برامجه'
      : "A specialized and multi-talented team working to achieve the Center's vision and implement its programs",
  ) ?? ''

  const pageBadge = cmsText(connected, hero?.badge, isRTL ? 'فريقنا' : 'Our Team') ?? ''

  const heroImage = connected && hero?.background_image
    ? resolveCmsMediaUrl(hero.background_image, undefined, 'https://picsum.photos/seed/werise-team/1400/700')
    : 'https://picsum.photos/seed/werise-team/1400/700'

  const heroStats = buildHeroStats(
    connected,
    hero?.use_live_stats ?? true,
    hero?.stats,
    team.length,
  )

  const teamGridTitle = cmsText(
    connected,
    teamGrid?.title,
    isRTL ? 'فريق العمل' : 'The Team',
  ) ?? (isRTL ? 'فريق العمل' : 'The Team')

  const teamGridSubtitle = cmsText(
    connected,
    teamGrid?.subtitle,
    isRTL
      ? 'يضم فريقنا خبراء من مختلف التخصصات المدنية والأكاديمية والتقنية'
      : 'Our team includes experts from various civil, academic, and technical specialties',
  ) ?? ''

  const teamCountLabel = connected && teamGrid?.use_live_member_count
    ? `${team.length} ${teamGrid.count_label ?? ''}`.trim()
    : connected && teamGrid?.count_label
      ? teamGrid.count_label
      : isRTL
        ? `${team.length} عضو`
        : `${team.length} Members`

  const governanceTitle = cmsText(
    connected,
    governance?.title,
    isRTL ? 'الهيكل المؤسسي والحوكمة' : 'Institutional Structure & Governance',
  ) ?? (isRTL ? 'الهيكل المؤسسي والحوكمة' : 'Institutional Structure & Governance')

  const governanceSubtitle = cmsText(
    connected,
    governance?.subtitle,
    isRTL
      ? 'نلتزم بمعايير الحوكمة الرشيدة والشفافية في جميع مستويات إدارة المركز'
      : 'We are committed to good governance standards and transparency at all levels of Center management',
  ) ?? ''

  const governanceBodies = connected && governance?.bodies?.length
    ? governance.bodies
    : governanceData.map((body) => ({
        key: body.id,
        title: body.title[locale],
        description: body.description[locale],
        member_ids: body.members,
      }))

  const orgChart = connected && governance?.org_chart
    ? governance.org_chart
    : {
        title: isRTL ? 'الهيكل التنظيمي' : 'Organizational Structure',
        leadership: {
          badge: isRTL ? 'القيادة' : 'Leadership',
          subtitle: isRTL ? 'الإدارة العليا' : 'Senior Management',
          title: isRTL ? 'المديرة العامة' : 'General Director',
          person_name: isRTL ? 'ليلى الحسن' : 'Layla Al-Hassan',
        },
        departments: [
          { icon: '🎯', label: isRTL ? 'البرامج' : 'Programs', sub: isRTL ? 'إدارة وتنفيذ' : 'Management & Execution' },
          { icon: '🔬', label: isRTL ? 'البحث والتطوير' : 'Research & Dev', sub: isRTL ? 'توثيق وتحليل' : 'Documentation & Analysis' },
          { icon: '🛡️', label: isRTL ? 'الحقوق الرقمية' : 'Digital Rights', sub: isRTL ? 'رصد وحماية' : 'Monitoring & Protection' },
        ],
        role_columns: [
          { roles: [isRTL ? 'مدير البرامج' : 'Programs Manager', isRTL ? 'منسق المشاريع' : 'Project Coordinator'] },
          { roles: [isRTL ? 'باحثة أولى' : 'Senior Researcher', isRTL ? 'باحثة' : 'Researcher'] },
          { roles: [isRTL ? 'ضابط الحقوق الرقمية' : 'Digital Rights Officer', isRTL ? 'التواصل والإعلام' : 'Comm. & Media'] },
        ],
        support_strip: {
          title: isRTL ? 'الأقسام الداعمة' : 'Support Units',
          items: [
            { icon: '💼', label: isRTL ? 'المالية والإدارة' : 'Finance & Admin' },
            { icon: '📢', label: isRTL ? 'التواصل والإعلام' : 'Comm. & Media' },
            { icon: '🤝', label: isRTL ? 'الشركاء والداعمون' : 'Partners & Donors' },
          ],
        },
      }

  const personSchemas = team.map((m) =>
    buildPersonSchema({
      name: m.name[locale],
      jobTitle: m.position[locale],
      email: m.email,
      image: m.photo,
    })
  )

  const showTeamGrid = cmsSectionVisible(connected, cms, 'team_grid')
  const showGovernance = cmsSectionVisible(connected, cms, 'governance')

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: pageTitle, url: `${BASE_URL}/${locale}/team-governance` },
        ]),
        ...personSchemas,
      ]} />

      <PageHero
        locale={locale}
        title={pageTitle}
        subtitle={pageSubtitle}
        badge={pageBadge}
        image={heroImage}
        stats={heroStats}
      />

      {showTeamGrid && (
        <section id="team" className="section-padding bg-neutral-50 scroll-mt-24">
          <div className="container-wide">
            <SectionHeader
              title={teamGridTitle}
              subtitle={teamGridSubtitle}
              label={teamCountLabel}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {team.map((member) => (
                <TeamMemberCard key={member.id} member={member} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {showGovernance && (
        <section id="governance" className="section-padding bg-white scroll-mt-24">
          <div className="container-wide">
            <SectionHeader
              title={governanceTitle}
              subtitle={governanceSubtitle}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {governanceBodies.map((body) => (
                <div key={body.key} className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-bold text-primary-500 text-lg">{body.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed mb-4">{body.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {body.member_ids.map((memberId) => {
                      const member = team.find((m) => m.id === String(memberId))
                      if (!member) return null
                      return (
                        <span key={String(memberId)} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-medium">
                          {member.name[locale]}
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <TeamOrgChart orgChart={orgChart} />
          </div>
        </section>
      )}
    </>
  )
}
