'use client'

import { useState, useEffect, useRef } from 'react'
import type { Locale } from '@/types'
import type { ObservatoryStats } from '@/types'
import type { CmsButtonDisplay } from '@/lib/cmsHomeContent'
import Button from '@/components/common/Button'
import { Shield, TrendingUp, AlertTriangle, Monitor } from 'lucide-react'

interface ObservatoryPreviewProps {
  locale: Locale
  stats: ObservatoryStats
  badge?: string | null
  title?: string | null
  description?: string | null
  primaryButton?: CmsButtonDisplay | null
  secondaryButton?: CmsButtonDisplay | null
  cmsConnected?: boolean
}

/* ── Animated counter ─────────────────────────────────────── */
function AnimatedNumber({ value, started, locale }: { value: number; started: boolean; locale: string }) {
  const [count, setCount] = useState(0)
  const animated = useRef(false)
  useEffect(() => {
    if (!started || animated.current) return
    animated.current = true
    const duration = 1800, steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) { setCount(value); clearInterval(timer) }
      else setCount(Math.floor(current))
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, value])
  return <>{count.toLocaleString()}</>
}

/* ── Animated bar ─────────────────────────────────────────── */
function AnimatedBar({ pct, started, delay = 0 }: { pct: number; started: boolean; delay?: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!started) return
    const t = setTimeout(() => setWidth(pct), delay)
    return () => clearTimeout(t)
  }, [started, pct, delay])
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-secondary-500 rounded-full"
        style={{ width: `${width}%`, transition: 'width 900ms cubic-bezier(0.22,1,0.36,1)' }} />
    </div>
  )
}

/* ── SVG trend chart ──────────────────────────────────────── */
function TrendChart({ data, locale, started }: {
  data: { month: string; cases: number; hateSpeech: number; digitalViolence: number }[]
  locale: string; started: boolean
}) {
  const W = 500, H = 180
  const PAD = { top: 16, right: 16, bottom: 32, left: 44 }
  const IW = W - PAD.left - PAD.right
  const IH = H - PAD.top - PAD.bottom
  const maxVal = Math.max(...data.map(d => d.cases))

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * IW
  const y = (v: number) => PAD.top + IH - (v / maxVal) * IH

  const linePath = (key: 'cases' | 'hateSpeech' | 'digitalViolence') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(d[key]).toFixed(1)}`).join(' ')

  const areaPath = (key: 'cases' | 'hateSpeech' | 'digitalViolence') => {
    const pts = data.map((d, i) => `${x(i).toFixed(1)},${y(d[key]).toFixed(1)}`).join(' L ')
    return `M ${x(0).toFixed(1)},${(PAD.top + IH).toFixed(1)} L ${pts} L ${x(data.length - 1).toFixed(1)},${(PAD.top + IH).toFixed(1)} Z`
  }

  const monthAbbr: Record<string, { ar: string; en: string }> = {
    '01': { ar: 'يناير', en: 'Jan' }, '02': { ar: 'فبراير', en: 'Feb' },
    '03': { ar: 'مارس', en: 'Mar' }, '04': { ar: 'أبريل', en: 'Apr' },
    '05': { ar: 'مايو', en: 'May' }, '06': { ar: 'يونيو', en: 'Jun' },
    '07': { ar: 'يوليو', en: 'Jul' }, '08': { ar: 'أغسطس', en: 'Aug' },
    '09': { ar: 'سبتمبر', en: 'Sep' }, '10': { ar: 'أكتوبر', en: 'Oct' },
    '11': { ar: 'نوفمبر', en: 'Nov' }, '12': { ar: 'ديسمبر', en: 'Dec' },
  }

  const [clipWidth, setClipWidth] = useState(0)
  useEffect(() => {
    if (!started) return
    let frame = 0; const total = 90
    const tick = () => {
      frame++
      setClipWidth(Math.min(IW, (frame / total) * IW))
      if (frame < total) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [started, IW])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="tg-cases" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="tg-hate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(239,68,68,0.35)" />
          <stop offset="100%" stopColor="rgba(239,68,68,0)" />
        </linearGradient>
        <clipPath id="obs-reveal">
          <rect x={PAD.left} y={0} width={clipWidth} height={H} />
        </clipPath>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const yp = PAD.top + IH * (1 - t)
        return (
          <g key={t}>
            <line x1={PAD.left} y1={yp} x2={PAD.left + IW} y2={yp}
              stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            <text x={PAD.left - 6} y={yp + 4}
              fontSize="10" fill="rgba(255,255,255,0.4)" textAnchor="end">
              {Math.round(maxVal * t)}
            </text>
          </g>
        )
      })}

      <g clipPath="url(#obs-reveal)">
        <path d={areaPath('cases')} fill="url(#tg-cases)" />
        <path d={areaPath('hateSpeech')} fill="url(#tg-hate)" />
        <path d={linePath('cases')} fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinejoin="round" />
        <path d={linePath('hateSpeech')} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
        <path d={linePath('digitalViolence')} fill="none" stroke="rgba(99,179,237,0.8)" strokeWidth="1.5" strokeDasharray="4 3" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.cases)} r="3" fill="white" />
            <circle cx={x(i)} cy={y(d.hateSpeech)} r="2.5" fill="#ef4444" />
          </g>
        ))}
      </g>

      {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, li, arr) => {
        const origIdx = data.findIndex(item => item.month === d.month)
        const [, m] = d.month.split('-')
        return (
          <text key={d.month} x={x(origIdx)} y={H - 6}
            fontSize="10" fill="rgba(255,255,255,0.45)" textAnchor="middle">
            {monthAbbr[m]?.[locale as 'ar' | 'en'] ?? m}
          </text>
        )
      })}
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────── */
export default function ObservatoryPreview({
  locale,
  stats,
  badge,
  title,
  description,
  primaryButton,
  secondaryButton,
  cmsConnected = false,
}: ObservatoryPreviewProps) {
  const isRTL = locale === 'ar'
  const [tab, setTab] = useState<'platform' | 'trend'>('platform')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const staticBadge = locale === 'ar' ? 'المرصد الرقمي' : 'Digital Observatory'
  const staticTitle = locale === 'ar' ? 'المرصد الرقمي لخطاب الكراهية' : 'Digital Hate Speech Observatory'
  const staticDescription = locale === 'ar'
    ? 'نرصد ونوثق حالات خطاب الكراهية والعنف الرقمي في الأردن عبر منهجية علمية دقيقة'
    : 'We monitor and document hate speech and digital violence cases in Jordan with a precise scientific methodology'
  const staticPrimaryLabel = locale === 'ar' ? 'ادخل المرصد' : 'Enter Observatory'
  const staticPrimaryUrl = `/${locale}/digital-observatory`
  const staticSecondaryLabel = locale === 'ar' ? 'تقارير المرصد' : 'Observatory Reports'
  const staticSecondaryUrl = `/${locale}/publications-reports`

  const displayBadge = cmsConnected ? (badge?.trim() || null) : (badge?.trim() || staticBadge)
  const displayTitle = cmsConnected ? (title?.trim() || null) : (title?.trim() || staticTitle)
  const displayDescription = cmsConnected ? (description?.trim() || null) : (description?.trim() || staticDescription)
  const displayPrimary = cmsConnected
    ? primaryButton
    : (primaryButton ?? { label: staticPrimaryLabel, url: staticPrimaryUrl })
  const displaySecondary = cmsConnected
    ? secondaryButton
    : (secondaryButton ?? { label: staticSecondaryLabel, url: staticSecondaryUrl })

  const hasTextContent = displayBadge || displayTitle || displayDescription || displayPrimary || displaySecondary

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect() } },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const topPlatforms = stats.platformDistribution.slice(0, 4)
  const maxPlatform = Math.max(...topPlatforms.map(p => p.count))

  const statItems = [
    { icon: <Shield className="w-5 h-5 text-secondary-500" />, value: stats.totalCases, label: locale === 'ar' ? 'إجمالي الحالات الموثقة' : 'Total Documented Cases' },
    { icon: <AlertTriangle className="w-5 h-5 text-amber-400" />, value: stats.hateSpeeachCases, label: locale === 'ar' ? 'حالات خطاب كراهية' : 'Hate Speech Cases' },
    { icon: <Monitor className="w-5 h-5 text-blue-400" />, value: stats.digitalViolenceCases, label: locale === 'ar' ? 'حالات عنف رقمي' : 'Digital Violence Cases' },
    { icon: <TrendingUp className="w-5 h-5 text-emerald-400" />, value: stats.platformDistribution.length, label: locale === 'ar' ? 'منصات رقمية مرصودة' : 'Monitored Platforms' },
  ]

  return (
    <section ref={ref} className="section-padding bg-white overflow-hidden">
      <div className="container-wide">
        <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">

          {/* Text side */}
          {hasTextContent && (
          <div className={isRTL ? 'lg:order-2' : 'lg:order-1'}>
            {displayBadge && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 border border-secondary-200 text-xs font-bold px-4 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-500 animate-pulse" />
                {displayBadge}
              </span>
            </div>
            )}

            {displayTitle && (
            <h2 className={`text-3xl md:text-4xl font-black text-primary-500 leading-tight mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
              {displayTitle}
            </h2>
            )}
            {(displayTitle || displayDescription) && (
            <div className="w-12 h-1 bg-secondary-500 mb-4" />
            )}
            {displayDescription && (
            <p className={`text-neutral-500 text-base leading-relaxed mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
              {displayDescription}
            </p>
            )}

            <div className="grid grid-cols-2 gap-3 mb-8">
              {statItems.map((item, idx) => (
                <div key={item.label}
                  className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-all duration-300"
                  dir={isRTL ? 'rtl' : 'ltr'}
                  style={{
                    opacity: started ? 1 : 0,
                    transform: started ? 'translateY(0)' : 'translateY(14px)',
                    transition: `opacity 600ms ease ${idx * 100}ms, transform 600ms ease ${idx * 100}ms`,
                  }}
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div className={isRTL ? 'text-right w-full' : ''}>
                    <div className="font-black text-2xl text-primary-500 tabular-nums" dir="ltr">
                      <AnimatedNumber value={item.value} started={started} locale={locale} />
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 leading-snug">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {(displayPrimary || displaySecondary) && (
            <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {displayPrimary && (
              <Button href={displayPrimary.url} variant="primary" size="md">
                {displayPrimary.label}
              </Button>
              )}
              {displaySecondary && (
              <Button href={displaySecondary.url} variant="outline" size="md">
                {displaySecondary.label}
              </Button>
              )}
            </div>
            )}
          </div>
          )}

          {/* Chart side */}
          <div
            className={`mt-10 lg:mt-0 ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
            style={{
              opacity: started ? 1 : 0,
              transform: started ? 'translateX(0)' : `translateX(${isRTL ? '-28px' : '28px'})`,
              transition: 'opacity 700ms ease 250ms, transform 700ms ease 250ms',
            }}
          >
            <div className="bg-primary-500 rounded-2xl p-6 text-white shadow-2xl">

              {/* Tab bar */}
              <div className={`flex items-center justify-between mb-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="font-bold text-sm text-white/80">
                  {tab === 'platform'
                    ? (locale === 'ar' ? 'توزيع الحالات حسب المنصة' : 'Cases by Platform')
                    : (locale === 'ar' ? 'الاتجاه الشهري 2024' : 'Monthly Trend 2024')}
                </h3>
                <div className="flex gap-1 bg-white/10 rounded-lg p-1">
                  {(['platform', 'trend'] as const).map(t => (
                    <button key={t}
                      onClick={() => setTab(t)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${
                        tab === t ? 'bg-secondary-500 text-white shadow-sm' : 'text-white/55 hover:text-white'
                      }`}
                    >
                      {t === 'platform'
                        ? (locale === 'ar' ? 'منصات' : 'Platforms')
                        : (locale === 'ar' ? 'اتجاه' : 'Trend')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform tab */}
              <div style={{ display: tab === 'platform' ? 'block' : 'none' }}>
                <div className="space-y-4">
                  {topPlatforms.map((p, i) => (
                    <div key={p.platform} className="group">
                      <div className={`flex items-center justify-between text-xs mb-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-semibold text-white/90">{p.platform}</span>
                        <span className="font-bold text-secondary-400 tabular-nums">{p.count.toLocaleString()}</span>
                      </div>
                      <AnimatedBar
                        pct={(p.count / maxPlatform) * 100}
                        started={started && tab === 'platform'}
                        delay={i * 150}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <h4 className={`text-xs font-semibold text-white/60 mb-4 ${isRTL ? 'text-right' : ''}`}>
                    {locale === 'ar' ? 'التوزيع حسب النوع الاجتماعي' : 'Gender Distribution'}
                  </h4>
                  <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {stats.genderDistribution.map((g, gi) => {
                      const pct = Math.round((g.count / stats.totalCases) * 100)
                      return (
                        <div key={g.gender} className="flex-1 flex flex-col items-center">
                          <div className="w-full h-20 bg-white/10 rounded-lg flex items-end overflow-hidden">
                            <div className="w-full bg-secondary-400 rounded-t-md transition-all duration-1000"
                              style={{ height: started ? `${pct}%` : '0%', transitionDelay: `${gi * 150 + 400}ms` }} />
                          </div>
                          <div className="text-xs text-white/60 mt-1.5">{g.label[locale as 'ar' | 'en']}</div>
                          <div className="text-xs font-black text-white tabular-nums">{pct}%</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Trend tab */}
              <div style={{ display: tab === 'trend' ? 'block' : 'none' }}>
                <TrendChart data={stats.monthlyTrend} locale={locale} started={started && tab === 'trend'} />
                <div className={`flex flex-wrap gap-4 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {[
                    { color: 'rgba(255,255,255,0.75)', label: locale === 'ar' ? 'إجمالي الحالات' : 'Total Cases' },
                    { color: '#ef4444', label: locale === 'ar' ? 'خطاب كراهية' : 'Hate Speech' },
                    { color: 'rgba(99,179,237,0.8)', label: locale === 'ar' ? 'عنف رقمي' : 'Digital Violence', dashed: true },
                  ].map(l => (
                    <div key={l.label} className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <svg width="24" height="10">
                        <line x1="0" y1="5" x2="24" y2="5" stroke={l.color} strokeWidth="2"
                          strokeDasharray={l.dashed ? '4 3' : undefined} />
                      </svg>
                      <span className="text-xs text-white/60">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
