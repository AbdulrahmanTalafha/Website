import type { Metadata } from 'next'
import type { Locale } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { getObservatoryData } from '@/lib/api'
import { getObservatoryPageData } from '@/lib/cms'
import { cmsConnected, cmsText } from '@/lib/cmsHomeContent'
import { cmsAbsoluteMediaUrl } from '@/lib/cmsMedia'
import { resolveObservatoryPageSeo } from '@/lib/observatoryPageSeo'
import {
  OBSERVATORY_SECTION_ANCHORS,
  observatorySectionVisible,
  resolveObservatoryPageSectionOrder,
  type ObservatoryPageSectionKey,
} from '@/lib/observatoryPageSectionOrder'
import type {
  CmsObservatoryClassification,
  CmsObservatoryMethodologyStep,
  CmsObservatoryReportStep,
  CmsObservatoryTextItem,
} from '@/lib/cms'
import ObservatoryHeroBackground from '@/components/observatory/ObservatoryHeroBackground'
import {
  Shield, AlertTriangle, TrendingUp, FileBarChart2, BookOpen,
  Target, Layers, BarChart2, MapPin, Users, Clock, Info,
  ChevronRight, Download, ExternalLink, Activity,
  Microscope, Scale, Eye, ArrowLeft, ArrowRight,
} from 'lucide-react'
import DesignSwitcher from '@/components/projects/DesignSwitcher'
import ReportForm from '@/components/observatory/ReportForm'

const CLASSIFICATION_ICONS: Record<string, typeof AlertTriangle> = {
  'hate-speech': AlertTriangle,
  'digital-violence': Shield,
  defamation: Eye,
  impersonation: Users,
}

const DEFAULT_METHODOLOGY_STEPS: CmsObservatoryMethodologyStep[] = [
  { num: '01', title: 'Monitoring', desc: 'Continuous monitoring of social media platforms using specialized tools and community reports' },
  { num: '02', title: 'Documentation', desc: 'Documenting cases with unified standards and saving them in a secure database' },
  { num: '03', title: 'Analysis', desc: 'Analyzing patterns and trends, classifying cases by type, platform, and group' },
  { num: '04', title: 'Reporting', desc: 'Publishing periodic reports with findings and actionable recommendations' },
]

const DEFAULT_CLASSIFICATIONS: CmsObservatoryClassification[] = [
  { id: 'hate-speech', title: 'Hate Speech', desc: 'Content inciting hatred or discrimination based on gender, religion, or origin', color: '#FA382E' },
  { id: 'digital-violence', title: 'Digital Violence', desc: 'Threats, blackmail, electronic harassment, and online stalking', color: '#8b5cf6' },
  { id: 'defamation', title: 'Defamation & Harm', desc: 'Spreading false or harmful information to damage reputation', color: '#f59e0b' },
  { id: 'impersonation', title: 'Impersonation', desc: 'Creating fake accounts or pretending to be another person', color: '#0ea5e9' },
]

const DEFAULT_INDICATORS: CmsObservatoryTextItem[] = [
  { text: 'Total and categorized case counts' },
  { text: 'Geographic and gender case distribution' },
  { text: 'Monthly and quarterly time trends' },
  { text: 'Case distribution by platform' },
  { text: 'Most targeted demographic groups' },
  { text: 'Temporal comparison across periods' },
]

const DEFAULT_DISCLAIMER_ITEMS: CmsObservatoryTextItem[] = [
  { text: 'Data represents documented cases only and does not reflect the full extent of the phenomenon.' },
  { text: 'Not all submitted reports can be independently verified.' },
  { text: 'Data is used for research and awareness purposes only.' },
  { text: 'The observatory is not a legal entity for prosecution.' },
  { text: 'Personal names and information are removed before publication.' },
]

const DEFAULT_AFTER_REPORT_STEPS: CmsObservatoryReportStep[] = [
  { title: 'Report Received', desc: 'An instant reference number is generated for tracking' },
  { title: 'Review', desc: 'The specialized team reviews the report within 48 hours' },
  { title: 'Documentation', desc: 'Case is documented in the observatory database' },
  { title: 'Response', desc: 'Appropriate actions taken based on case nature' },
]

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ v?: string }>
}

export const revalidate = 60

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  const { v } = await searchParams
  const pageCms = await getObservatoryPageData(locale)
  const seo = resolveObservatoryPageSeo(pageCms, locale)

  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/digital-observatory`,
    customTitle: seo.title,
    customDescription: seo.description,
    noIndex: Boolean(v) || seo.noIndex,
  })
}

/* ── Bar chart helper ── */
function Bar({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5 text-sm">
        <span className="font-semibold">{label}{sub && <span className="opacity-50 text-xs ms-1">({sub})</span>}</span>
        <span className="font-black tabular-nums">{value.toLocaleString()}</span>
      </div>
      <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

/* ── Monthly trend bar ── */
function TrendBar({ cases, hs, dv, max, month, textCls }: { cases: number; hs: number; dv: number; max: number; month: string; textCls: string }) {
  const shortMonth = month.slice(5)
  return (
    <div className="flex-1 flex flex-col items-center gap-1 group relative">
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {cases}
      </div>
      <div className="w-full flex flex-col justify-end gap-px" style={{ height: '100px' }}>
        <div className="w-full rounded-t-sm" style={{ height: `${(dv / max) * 100}px`, backgroundColor: '#f43f5e' }} />
        <div className="w-full" style={{ height: `${(hs / max) * 100}px`, backgroundColor: '#2B245B' }} />
      </div>
      <span className={`text-[9px] rotate-45 origin-left mt-1 opacity-50 ${textCls}`}>{shortMonth}</span>
    </div>
  )
}

export default async function DigitalObservatoryPage({ params, searchParams }: PageProps) {
  const { locale } = await params as { locale: Locale }
  await searchParams
  const variant = 'dark' as 'dark' | 'light' | 'classic'
  const [{ stats, reports }, pageCms] = await Promise.all([
    getObservatoryData(locale),
    getObservatoryPageData(locale),
  ])

  const connected = cmsConnected(pageCms)
  const hero = pageCms?.sections?.hero
  const isRTL = locale === 'ar'
  const heroVideoUrl = connected ? cmsAbsoluteMediaUrl(hero?.background_video) : null

  const heroBadge = cmsText(
    connected,
    hero?.badge,
    isRTL ? 'يعمل الآن' : 'Live Monitoring',
  )

  const heroTitle = cmsText(
    connected,
    hero?.title,
    isRTL ? 'المرصد الرقمي لخطاب الكراهية والعنف الرقمي' : 'Digital Observatory for Hate Speech & Digital Violence',
  ) ?? (isRTL ? 'المرصد الرقمي لخطاب الكراهية والعنف الرقمي' : 'Digital Observatory for Hate Speech & Digital Violence')

  const heroSubtitle = cmsText(
    connected,
    hero?.subtitle,
    isRTL
      ? 'نرصد ونوثق ونحلل حالات خطاب الكراهية والعنف الرقمي عبر المنصات الرقمية في الأردن، لبناء بيئة رقمية آمنة ومحمية.'
      : 'We monitor, document, and analyze hate speech and digital violence cases across digital platforms in Jordan, building a safe and protected digital environment.',
  )

  const about = pageCms?.sections?.about
  const dashboards = pageCms?.sections?.dashboards
  const reportsSection = pageCms?.sections?.reports
  const reportForm = pageCms?.sections?.report_form

  const sectionOrder = resolveObservatoryPageSectionOrder(pageCms, connected)

  const aboutBadge = cmsText(connected, about?.badge, isRTL ? 'نبذة عن المرصد' : 'About the Observatory')
  const aboutTitle = cmsText(connected, about?.title, isRTL ? 'ما هو المرصد الرقمي؟' : 'What is the Digital Observatory?')
  const goalTitle = cmsText(connected, about?.goal_title, isRTL ? 'هدف المرصد' : 'Observatory Goal')
  const goalText = cmsText(connected, about?.goal_text, isRTL
    ? 'رصد وتوثيق وتحليل حالات خطاب الكراهية والعنف الرقمي الموجهة ضد الأفراد والمجتمعات عبر منصات التواصل الاجتماعي في الأردن، بهدف دعم السياسات الرقمية وتعزيز الحماية القانونية.'
    : 'Monitor, document, and analyze hate speech and digital violence cases targeting individuals and communities on social media in Jordan, to support digital policies and strengthen legal protections.')
  const roleTitle = cmsText(connected, about?.role_title, isRTL ? 'دور المرصد' : 'Observatory Role')
  const roleText = cmsText(connected, about?.role_text, isRTL
    ? 'يعمل المرصد على تقديم بيانات موثوقة للجهات الحكومية والمجتمع المدني والباحثين والإعلاميين، لتعزيز المساءلة الرقمية والاستجابة الفعّالة لظاهرة العنف الإلكتروني.'
    : 'The observatory provides reliable data to government entities, civil society, researchers, and journalists to enhance digital accountability and effective response to online violence.')
  const methodologyTitle = cmsText(connected, about?.methodology_title, isRTL ? 'المنهجية المعتمدة' : 'Adopted Methodology')
  const methodologySteps = connected && about?.methodology_steps?.length ? about.methodology_steps : DEFAULT_METHODOLOGY_STEPS
  const classificationsTitle = cmsText(connected, about?.classifications_title, isRTL ? 'التصنيفات المعتمدة' : 'Adopted Classifications')
  const classifications = connected && about?.classifications?.length ? about.classifications : DEFAULT_CLASSIFICATIONS
  const indicatorsTitle = cmsText(connected, about?.indicators_title, isRTL ? 'أنواع المؤشرات' : 'Types of Indicators')
  const indicators = connected && about?.indicators?.length ? about.indicators : DEFAULT_INDICATORS
  const disclaimerTitle = cmsText(connected, about?.disclaimer_title, isRTL ? 'حدود البيانات والتنويه' : 'Data Limits & Disclaimer')
  const disclaimerItems = connected && about?.disclaimer_items?.length ? about.disclaimer_items : DEFAULT_DISCLAIMER_ITEMS

  const dashboardsBadge = cmsText(connected, dashboards?.badge, isRTL ? 'لوحات البيانات التفاعلية' : 'Interactive Dashboards')
  const dashboardsTitle = cmsText(connected, dashboards?.title, isRTL ? 'تحليل البيانات الشامل' : 'Comprehensive Data Analysis')
  const dashboardsStatusBadge = cmsText(connected, dashboards?.status_badge, isRTL ? 'يُحدَّث دورياً' : 'Updated periodically')
  const platformChartTitle = cmsText(connected, dashboards?.platform_title, isRTL ? 'توزيع الحالات حسب المنصة' : 'Cases by Platform')
  const genderChartTitle = cmsText(connected, dashboards?.gender_title, isRTL ? 'توزيع الحالات حسب الجنس' : 'Cases by Gender')
  const trendChartTitle = cmsText(connected, dashboards?.trend_title, isRTL ? 'الاتجاه الزمني الشهري (2024)' : 'Monthly Time Trend (2024)')
  const governorateChartTitle = cmsText(connected, dashboards?.governorate_title, isRTL ? 'توزيع الحالات الجغرافي (حسب المحافظة)' : 'Geographic Distribution by Governorate')
  const comparisonNote = cmsText(connected, dashboards?.comparison_note, isRTL
    ? 'تُظهر البيانات ارتفاعاً ملحوظاً في حالات خطاب الكراهية خلال الربع الأخير من 2024 بنسبة 18% مقارنةً بالربع ذاته من 2023، مع تصاعد واضح في منصات الفيديو القصير.'
    : 'Data shows a notable 18% increase in hate speech cases during Q4 2024 compared to the same quarter in 2023, with a clear surge on short-video platforms.')

  const reportsBadge = cmsText(connected, reportsSection?.badge, isRTL ? 'أرشيف التقارير' : 'Reports Archive')
  const reportsTitle = cmsText(connected, reportsSection?.title, isRTL ? 'تقارير المرصد الدورية' : 'Periodic Observatory Reports')

  const reportFormBadge = cmsText(connected, reportForm?.badge, isRTL ? 'الإبلاغ عن حالة' : 'Report a Case')
  const reportFormTitle = cmsText(connected, reportForm?.title, isRTL ? 'نموذج الإبلاغ عن حالة عنف رقمي' : 'Digital Violence Incident Report Form')
  const reportFormIntro = cmsText(connected, reportForm?.subtitle, isRTL
    ? 'إذا تعرضت أو شهدت حالة خطاب كراهية أو عنف رقمي، أبلغنا بها. يمكنك الإبلاغ بشكل مجهول، وسنعمل على توثيق الحالة ومتابعتها.'
    : 'If you have experienced or witnessed a hate speech or digital violence incident, report it to us. You can report anonymously and we will document and follow up on the case.')
  const afterReportTitle = cmsText(connected, reportForm?.after_report_title, isRTL ? 'ماذا يحدث بعد الإبلاغ؟' : 'What Happens After Reporting?')
  const afterReportSteps = connected && reportForm?.after_report_steps?.length ? reportForm.after_report_steps : DEFAULT_AFTER_REPORT_STEPS
  const privacyTitle = cmsText(connected, reportForm?.privacy_title, isRTL ? 'خصوصيتك محمية' : 'Your Privacy is Protected')
  const privacyText = cmsText(connected, reportForm?.privacy_text, isRTL
    ? 'جميع البلاغات تُعامَل بسرية تامة. بياناتك الشخصية لن تُكشَف أو تُشارَك مع أي جهة خارجية.'
    : 'All reports are treated with complete confidentiality. Your personal data will never be revealed or shared with any external party.')

  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const ArrowFwd = isRTL ? ArrowLeft : ArrowRight

  const basePath    = `/${locale}/digital-observatory`
  const darkHref    = basePath
  const lightHref   = `${basePath}?v=light`
  const classicHref = `${basePath}?v=classic`

  const maxPlatform = Math.max(...stats.platformDistribution.map(p => p.count))
  const maxGov      = Math.max(...stats.governorateDistribution.map(g => g.count))
  const totalGender = stats.genderDistribution.reduce((a, g) => a + g.count, 0)
  const maxMonthly  = Math.max(...stats.monthlyTrend.map(t => t.cases))

  /* ── Variant tokens ── */
  const V = {
    dark: {
      page:     'bg-primary-900',
      hero:     'bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900',
      card:     'bg-white/5 border border-white/10',
      cardHov:  'hover:bg-white/10 hover:border-white/20',
      heading:  'text-white',
      sub:      'text-white/60',
      label:    'text-white/50',
      badge:    'bg-white/10 text-white/70 border border-white/10',
      nav:      'bg-primary-900/95 backdrop-blur-md border-b border-white/10',
      navItem:  'text-white/40 hover:text-white hover:border-secondary-400',
      input:    'bg-white/10 border border-white/15 text-white placeholder:text-white/30 focus:border-primary-400 focus:outline-none',
      divider:  'border-white/10',
      accent:   '#FA382E',
      btn:      'bg-secondary-500 hover:bg-secondary-600',
      stat1:    'bg-blue-500/20 border border-blue-500/30 text-blue-300',
      stat2:    'bg-secondary-500/20 border border-secondary-500/30 text-secondary-300',
      stat3:    'bg-purple-500/20 border border-purple-500/30 text-purple-300',
      stat4:    'bg-green-500/20 border border-green-500/30 text-green-300',
      blob1:    'bg-primary-700/30',
      blob2:    'bg-secondary-500/10',
    },
    light: {
      page:     'bg-neutral-50',
      hero:     '',
      card:     'bg-white border border-neutral-100 shadow-sm',
      cardHov:  'hover:shadow-md hover:border-primary-200',
      heading:  'text-primary-900',
      sub:      'text-neutral-600',
      label:    'text-neutral-500',
      badge:    'bg-primary-50 text-primary-700 border border-primary-100',
      nav:      'bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm',
      navItem:  'text-neutral-400 hover:text-primary-500 hover:border-primary-500',
      input:    'bg-white border border-neutral-200 text-primary-900 placeholder:text-neutral-300 focus:border-primary-400 focus:outline-none',
      divider:  'border-neutral-100',
      accent:   '#2B245B',
      btn:      'bg-primary-500 hover:bg-primary-600',
      stat1:    'bg-blue-50 border border-blue-100 text-blue-700',
      stat2:    'bg-secondary-50 border border-secondary-100 text-secondary-700',
      stat3:    'bg-purple-50 border border-purple-100 text-purple-700',
      stat4:    'bg-green-50 border border-green-100 text-green-700',
      blob1:    'bg-primary-100/30',
      blob2:    'bg-secondary-100/20',
    },
    classic: {
      page:     '',
      hero:     '',
      card:     'bg-white/80 backdrop-blur-sm border border-neutral-100/80 shadow-sm',
      cardHov:  'hover:shadow-lg hover:border-primary-200/80',
      heading:  'text-primary-900',
      sub:      'text-neutral-600',
      label:    'text-neutral-500',
      badge:    'bg-primary-50 text-primary-700 border border-primary-100',
      nav:      'bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm',
      navItem:  'text-neutral-400 hover:text-primary-500 hover:border-primary-500',
      input:    'bg-white/80 border border-neutral-200 text-primary-900 placeholder:text-neutral-300 focus:border-primary-400 focus:outline-none backdrop-blur-sm',
      divider:  'border-neutral-100',
      accent:   '#2B245B',
      btn:      'bg-primary-500 hover:bg-primary-600',
      stat1:    'bg-blue-50/80 border border-blue-100 text-blue-700',
      stat2:    'bg-secondary-50/80 border border-secondary-100 text-secondary-700',
      stat3:    'bg-purple-50/80 border border-purple-100 text-purple-700',
      stat4:    'bg-green-50/80 border border-green-100 text-green-700',
      blob1:    'bg-primary-100/40',
      blob2:    'bg-secondary-100/30',
    },
  }[variant]

  const navLinks = sectionOrder
    .filter((key) => observatorySectionVisible(pageCms, connected, key))
    .map((key) => {
      const section = pageCms?.sections?.[key]
      const defaultLabels: Record<ObservatoryPageSectionKey, { ar: string; en: string }> = {
        about: { ar: 'نبذة عن المرصد', en: 'About' },
        dashboards: { ar: 'لوحات البيانات', en: 'Dashboards' },
        reports: { ar: 'تقارير المرصد', en: 'Reports' },
        report_form: { ar: 'أبلغ عن حالة', en: 'Report Incident' },
      }
      const label = connected && section?.badge
        ? section.badge
        : defaultLabels[key][isRTL ? 'ar' : 'en']

      return {
        href: `#${OBSERVATORY_SECTION_ANCHORS[key]}`,
        label,
      }
    })

  /* ─── RENDER ─── */
  const isDark = variant === 'dark'
  const isClassic = variant === 'classic'
  const useFullPageVideo = isDark && heroVideoUrl

  return (
    <div className="relative w-full">
      {useFullPageVideo && (
        <ObservatoryHeroBackground videoUrl={heroVideoUrl} fixed />
      )}

      <div className="relative z-[2] w-full">
      {/* ─── HERO ─── */}
      {isDark ? (
        <div className="relative min-h-[55vh] overflow-hidden flex items-end">
          {!heroVideoUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900" />
          )}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(250,56,46,0.12) 0%, transparent 70%)' }} />
          <div className="relative z-10 container-wide pb-14 pt-24 w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              <span className="text-xs font-black text-secondary-400 uppercase tracking-widest">{heroBadge}</span>
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-black leading-tight max-w-3xl mb-4">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-white/60 text-base md:text-lg max-w-2xl mb-8">
                {heroSubtitle}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: stats.totalCases.toLocaleString(), label: isRTL ? 'حالة موثقة' : 'Documented Cases', cls: 'text-white' },
                { val: stats.hateSpeeachCases.toLocaleString(), label: isRTL ? 'خطاب كراهية' : 'Hate Speech', cls: 'text-secondary-400' },
                { val: stats.digitalViolenceCases.toLocaleString(), label: isRTL ? 'عنف رقمي' : 'Digital Violence', cls: 'text-purple-400' },
                { val: stats.platformDistribution.length + '+', label: isRTL ? 'منصة مُراقَبة' : 'Platforms Monitored', cls: 'text-blue-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className={`text-3xl font-black mb-1 ${s.cls}`}>{s.val}</div>
                  <div className="text-xs text-white/40 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isClassic ? (
        <div className="relative h-80 md:h-[420px] overflow-hidden bg-primary-900">
          <ObservatoryHeroBackground
            videoUrl={heroVideoUrl}
            overlayClassName="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent"
          />
          {!heroVideoUrl && (
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/60 to-transparent" />
          )}
          <div className="absolute inset-0 flex flex-col justify-end container-wide pb-10 z-10">
            <div className="inline-flex items-center gap-1.5 bg-secondary-500/20 text-secondary-300 border border-secondary-500/30 text-xs font-bold px-3 py-1.5 rounded-full w-fit mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 animate-pulse" />
              {heroBadge}
            </div>
            <h1 className="text-white text-2xl md:text-4xl font-black leading-tight max-w-3xl">
              {heroTitle}
            </h1>
          </div>
        </div>
      ) : (
        /* LIGHT hero */
        <div className="relative min-h-[52vh] overflow-hidden flex items-end" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 40%, #f9f9ff 100%)' }}>
          {heroVideoUrl ? (
            <ObservatoryHeroBackground
              videoUrl={heroVideoUrl}
              overlayClassName="absolute inset-0 bg-white/75"
            />
          ) : (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -start-20 w-80 h-80 rounded-full bg-primary-100/30 blur-3xl" />
              <div className="absolute top-1/3 -end-16 w-72 h-72 rounded-full bg-secondary-100/20 blur-3xl" />
            </div>
          )}
          <div className="relative z-10 container-wide pb-14 pt-24 w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse" />
              <span className="text-xs font-black text-secondary-500 uppercase tracking-widest">{heroBadge}</span>
            </div>
            <h1 className="text-primary-900 text-3xl md:text-5xl font-black leading-tight max-w-3xl mb-4">
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="text-neutral-600 text-base md:text-lg max-w-2xl mb-8">
                {heroSubtitle}
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { val: stats.totalCases.toLocaleString(), label: isRTL ? 'حالة موثقة' : 'Cases', bg: 'bg-primary-50 border-primary-100', txt: 'text-primary-700' },
                { val: stats.hateSpeeachCases.toLocaleString(), label: isRTL ? 'خطاب كراهية' : 'Hate Speech', bg: 'bg-secondary-50 border-secondary-100', txt: 'text-secondary-700' },
                { val: stats.digitalViolenceCases.toLocaleString(), label: isRTL ? 'عنف رقمي' : 'Digital Violence', bg: 'bg-purple-50 border-purple-100', txt: 'text-purple-700' },
                { val: stats.platformDistribution.length + '+', label: isRTL ? 'منصات' : 'Platforms', bg: 'bg-blue-50 border-blue-100', txt: 'text-blue-700' },
              ].map(s => (
                <div key={s.label} className={`${s.bg} border rounded-2xl p-5`}>
                  <div className={`text-3xl font-black mb-1 ${s.txt}`}>{s.val}</div>
                  <div className="text-xs text-neutral-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── STICKY NAV ─── */}
      <div className={`sticky top-10 z-30 ${V.nav}`}>
        <div className="container-wide flex overflow-x-auto scrollbar-none">
          {navLinks.map(nl => (
            <a key={nl.href} href={nl.href} className={`px-5 py-4 text-xs font-black border-b-2 border-transparent transition-all whitespace-nowrap shrink-0 ${V.navItem}`}>{nl.label}</a>
          ))}
        </div>
      </div>

      {/* ─── MAIN BODY ─── */}
      <div className={`relative ${isClassic ? 'bg-gradient-to-br from-primary-50 via-white to-secondary-50/30' : isDark ? (heroVideoUrl ? '' : 'bg-primary-900') : 'bg-neutral-50'}`}>
        {/* Blobs */}
        {!isDark && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className={`absolute -top-24 -start-24 w-96 h-96 rounded-full blur-3xl ${V.blob1}`} />
            <div className={`absolute top-1/3 -end-24 w-80 h-80 rounded-full blur-3xl ${V.blob2}`} />
          </div>
        )}

        <div className="relative container-wide py-12 pb-16 flex flex-col gap-16">

          {observatorySectionVisible(pageCms, connected, 'about') && (
          <section id="about" style={{ order: sectionOrder.indexOf('about') }} className="scroll-mt-24 space-y-10">
            {/* Section header */}
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-secondary-400' : 'text-primary-500'}`}>
                <div className={`w-6 h-0.5 rounded-full ${isDark ? 'bg-secondary-400' : 'bg-primary-500'}`} />
                {aboutBadge}
              </div>
              <h2 className={`text-2xl md:text-3xl font-black ${V.heading}`}>
                {aboutTitle}
              </h2>
            </div>

            {/* Goal + Role 2-col */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-7 ${V.card}`}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-primary-500/10">
                  <Target className="w-5 h-5 text-primary-500" />
                </div>
                <h3 className={`text-lg font-black mb-3 ${V.heading}`}>{goalTitle}</h3>
                <p className={`text-sm leading-relaxed ${V.sub}`}>
                  {goalText}
                </p>
              </div>
              <div className={`rounded-3xl p-7 ${V.card}`}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-secondary-500/10">
                  <Scale className="w-5 h-5 text-secondary-500" />
                </div>
                <h3 className={`text-lg font-black mb-3 ${V.heading}`}>{roleTitle}</h3>
                <p className={`text-sm leading-relaxed ${V.sub}`}>
                  {roleText}
                </p>
              </div>
            </div>

            {/* Methodology steps */}
            <div className={`rounded-3xl p-7 ${V.card}`}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-blue-500/10">
                <Microscope className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className={`text-lg font-black mb-6 ${V.heading}`}>{methodologyTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {methodologySteps.map((step, index) => (
                  <div key={step.num ?? String(index)} className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-500 flex items-center justify-center text-white font-black text-sm shrink-0">{step.num}</div>
                    <div>
                      <div className={`font-black text-sm mb-1 ${V.heading}`}>{step.title}</div>
                      <p className={`text-xs leading-relaxed ${V.sub}`}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Classifications */}
            <div className={`rounded-3xl p-7 ${V.card}`}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-purple-500/10">
                <Layers className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className={`text-lg font-black mb-6 ${V.heading}`}>{classificationsTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classifications.map((cls, index) => {
                  const Icon = CLASSIFICATION_ICONS[cls.id ?? ''] ?? AlertTriangle
                  const color = cls.color ?? '#FA382E'
                  return (
                    <div key={cls.id ?? String(index)} className={`flex gap-4 rounded-2xl p-5 ${isDark ? 'bg-white/5' : 'bg-neutral-50'} border ${V.divider}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <div>
                        <div className={`font-black text-sm mb-1 ${V.heading}`}>{cls.title}</div>
                        <p className={`text-xs leading-relaxed ${V.sub}`}>{cls.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Indicators + Data limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-3xl p-7 ${V.card}`}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-green-500/10">
                  <Activity className="w-5 h-5 text-green-500" />
                </div>
                <h3 className={`text-lg font-black mb-4 ${V.heading}`}>{indicatorsTitle}</h3>
                <ul className="space-y-2.5">
                  {indicators.map((item, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${V.sub}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0 mt-1.5" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`rounded-3xl p-7 border-2 ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 bg-amber-500/15">
                  <Info className="w-5 h-5 text-amber-500" />
                </div>
                <h3 className={`text-lg font-black mb-4 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>{disclaimerTitle}</h3>
                <ul className="space-y-2.5">
                  {disclaimerItems.map((item, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-sm ${isDark ? 'text-amber-200/70' : 'text-amber-800'}`}>
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          )}

          {observatorySectionVisible(pageCms, connected, 'dashboards') && (
          <section id="dashboards" style={{ order: sectionOrder.indexOf('dashboards') }} className="scroll-mt-24 space-y-8">
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-secondary-400' : 'text-primary-500'}`}>
                <div className={`w-6 h-0.5 rounded-full ${isDark ? 'bg-secondary-400' : 'bg-primary-500'}`} />
                {dashboardsBadge}
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className={`text-2xl md:text-3xl font-black ${V.heading}`}>
                  {dashboardsTitle}
                </h2>
                <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${V.badge}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  {dashboardsStatusBadge}
                </div>
              </div>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Activity,   label: isRTL ? 'إجمالي الحالات' : 'Total Cases',         val: stats.totalCases.toLocaleString(),         cls: V.stat1 },
                { icon: AlertTriangle, label: isRTL ? 'خطاب كراهية' : 'Hate Speech',        val: stats.hateSpeeachCases.toLocaleString(),     cls: V.stat2 },
                { icon: Shield,     label: isRTL ? 'عنف رقمي' : 'Digital Violence',          val: stats.digitalViolenceCases.toLocaleString(), cls: V.stat3 },
                { icon: TrendingUp, label: isRTL ? 'أعلى شهر' : 'Peak Month',               val: Math.max(...stats.monthlyTrend.map(t => t.cases)).toLocaleString(), cls: V.stat4 },
              ].map(kpi => {
                const Icon = kpi.icon
                return (
                  <div key={kpi.label} className={`rounded-2xl p-5 ${kpi.cls}`}>
                    <Icon className="w-5 h-5 mb-3 opacity-70" />
                    <div className="text-2xl font-black mb-1">{kpi.val}</div>
                    <div className="text-xs font-medium opacity-70">{kpi.label}</div>
                  </div>
                )
              })}
            </div>

            {/* Platform + Gender row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform distribution */}
              <div className={`rounded-3xl p-7 ${V.card}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                    <BarChart2 className="w-4 h-4 text-primary-500" />
                  </div>
                  <h3 className={`font-black text-base ${V.heading}`}>{platformChartTitle}</h3>
                </div>
                <div className={`space-y-4 text-sm ${V.sub}`}>
                  {stats.platformDistribution.map(({ platform, count }) => (
                    <Bar key={platform} value={count} max={maxPlatform} color="#2B245B" label={platform} />
                  ))}
                </div>
              </div>

              {/* Gender distribution */}
              <div className={`rounded-3xl p-7 ${V.card}`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-secondary-500/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-secondary-500" />
                  </div>
                  <h3 className={`font-black text-base ${V.heading}`}>{genderChartTitle}</h3>
                </div>
                <div className={`space-y-4 text-sm ${V.sub}`}>
                  {stats.genderDistribution.map(({ gender, count, label }) => {
                    const pct = Math.round((count / totalGender) * 100)
                    const colors: Record<string, string> = { female: '#FA382E', male: '#2B245B', other: '#8b5cf6' }
                    return (
                      <div key={gender}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="font-semibold">{label[locale as Locale]}</span>
                          <span className="font-black tabular-nums">{pct}% <span className="font-normal opacity-50">({count.toLocaleString()})</span></span>
                        </div>
                        <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: colors[gender] ?? '#888' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Donut representation */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {stats.genderDistribution.map(({ gender, count, label }) => {
                    const pct = Math.round((count / totalGender) * 100)
                    const colors: Record<string, string> = { female: '#FA382E', male: '#2B245B', other: '#8b5cf6' }
                    return (
                      <div key={gender} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${isDark ? 'bg-white/5' : 'bg-neutral-50'}`}>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[gender] ?? '#888' }} />
                        <span className={`text-xs font-bold ${V.heading}`}>{label[locale as Locale]}</span>
                        <span className={`text-xs ${V.label}`}>{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Monthly trend */}
            <div className={`rounded-3xl p-7 ${V.card}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <h3 className={`font-black text-base ${V.heading}`}>{trendChartTitle}</h3>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-5 mb-5">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-primary-500" />
                  <span className={V.label}>{isRTL ? 'خطاب الكراهية' : 'Hate Speech'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-sm bg-secondary-500" />
                  <span className={V.label}>{isRTL ? 'العنف الرقمي' : 'Digital Violence'}</span>
                </div>
              </div>
              <div className="flex items-end gap-1" style={{ height: '130px' }}>
                {stats.monthlyTrend.map(({ month, cases, hateSpeech, digitalViolence }) => (
                  <TrendBar key={month} cases={cases} hs={hateSpeech} dv={digitalViolence} max={maxMonthly} month={month} textCls={V.sub} />
                ))}
              </div>
            </div>

            {/* Governorate distribution */}
            <div className={`rounded-3xl p-7 ${V.card}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-amber-500" />
                </div>
                <h3 className={`font-black text-base ${V.heading}`}>{governorateChartTitle}</h3>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-sm ${V.sub}`}>
                {stats.governorateDistribution.map(({ governorate, count, label }) => (
                  <Bar key={governorate} value={count} max={maxGov} color="#f59e0b" label={label[locale as Locale]} sub={`${Math.round((count / stats.totalCases) * 100)}%`} />
                ))}
              </div>
            </div>

            {/* Comparison note */}
            <div className={`rounded-2xl p-5 flex items-start gap-3 ${isDark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
              <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                {comparisonNote}
              </p>
            </div>
          </section>
          )}

          {observatorySectionVisible(pageCms, connected, 'reports') && (
          <section id="reports" style={{ order: sectionOrder.indexOf('reports') }} className="scroll-mt-24 space-y-8">
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-secondary-400' : 'text-primary-500'}`}>
                <div className={`w-6 h-0.5 rounded-full ${isDark ? 'bg-secondary-400' : 'bg-primary-500'}`} />
                {reportsBadge}
              </div>
              <h2 className={`text-2xl md:text-3xl font-black ${V.heading}`}>
                {reportsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map(report => (
                <a
                  key={report.id}
                  href={report.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group rounded-3xl overflow-hidden transition-all block ${V.card} ${V.cardHov}`}
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-800">
                    <Image src={report.coverImage || 'https://picsum.photos/seed/obs-report/400/225'} alt={report.title[locale as Locale]} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-3 start-3 inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${V.badge}`}>
                      <FileBarChart2 className="w-3 h-3" />
                      {isRTL ? 'تقرير المرصد' : 'Observatory Report'}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className={`flex items-center gap-1.5 text-xs mb-3 ${V.label}`}>
                      <Clock className="w-3 h-3" />
                      {new Date(report.publishDate).toLocaleDateString(isRTL ? 'ar-JO' : 'en-GB', { year: 'numeric', month: 'long' })}
                    </div>
                    <h3 className={`font-black text-base mb-2 leading-snug ${V.heading}`}>{report.title[locale as Locale]}</h3>
                    <p className={`text-sm leading-relaxed mb-5 line-clamp-3 ${V.sub}`}>{report.summary[locale as Locale]}</p>
                    <div className={`inline-flex items-center gap-2 text-sm font-black transition-colors ${isDark ? 'text-secondary-400 group-hover:text-secondary-300' : 'text-primary-500 group-hover:text-secondary-500'}`}>
                      <Download className="w-4 h-4" />
                      {isRTL ? 'تحميل التقرير (PDF)' : 'Download Report (PDF)'}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
          )}

          {observatorySectionVisible(pageCms, connected, 'report_form') && (
          <section id="report" style={{ order: sectionOrder.indexOf('report_form') }} className="scroll-mt-24 space-y-8">
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-secondary-400' : 'text-primary-500'}`}>
                <div className={`w-6 h-0.5 rounded-full ${isDark ? 'bg-secondary-400' : 'bg-primary-500'}`} />
                {reportFormBadge}
              </div>
              <h2 className={`text-2xl md:text-3xl font-black ${V.heading}`}>
                {reportFormTitle}
              </h2>
              <p className={`mt-2 max-w-2xl ${V.sub}`}>
                {reportFormIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReportForm
                  locale={locale as Locale}
                  cardCls={V.card}
                  inputCls={V.input}
                  labelCls={V.sub}
                  headingCls={V.heading}
                  accentColor={V.accent}
                  btnCls={V.btn}
                  isDark={isDark}
                />
              </div>
              {/* Sidebar info */}
              <div className="space-y-5">
                <div className={`rounded-3xl p-6 ${V.card}`}>
                  <h3 className={`font-black text-base mb-4 ${V.heading}`}>{afterReportTitle}</h3>
                  <ol className="space-y-4">
                    {afterReportSteps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">{index + 1}</div>
                        <div>
                          <div className={`text-sm font-black ${V.heading}`}>{step.title}</div>
                          <div className={`text-xs mt-0.5 ${V.sub}`}>{step.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className={`rounded-3xl p-6 ${isDark ? 'bg-secondary-500/10 border border-secondary-500/20' : 'bg-secondary-50 border border-secondary-100'}`}>
                  <Shield className={`w-6 h-6 mb-3 ${isDark ? 'text-secondary-400' : 'text-secondary-500'}`} />
                  <h3 className={`font-black text-sm mb-2 ${isDark ? 'text-secondary-300' : 'text-secondary-800'}`}>{privacyTitle}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-secondary-200/60' : 'text-secondary-700'}`}>
                    {privacyText}
                  </p>
                </div>
              </div>
            </div>
          </section>
          )}

        </div>
      </div>

      <DesignSwitcher darkHref={darkHref} lightHref={lightHref} classicHref={classicHref} current={variant} isRTL={isRTL} />
      </div>
    </div>
  )
}
