'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Target, Eye, Heart, Clock, Trophy, Handshake, ChevronRight, ChevronLeft } from 'lucide-react'
import type { Locale } from '@/types'

interface AboutData {
  intro: Record<string, string>
  vision: Record<string, string>
  mission: Record<string, string>
  values: { id: string; title: Record<string, string>; description: Record<string, string> }[]
  workAreas: { id: string; title: Record<string, string>; description: Record<string, string> }[]
  history: { year: string; event: Record<string, string> }[]
  achievements: { id: string; value: string; title: Record<string, string> }[]
}

interface Partner {
  id: string
  logo: string
  name: Record<string, string>
}

interface AboutContentProps {
  locale: Locale
  about: AboutData
  partners: Partner[]
}

export default function AboutContent({ locale, about, partners }: AboutContentProps) {
  const isRTL = locale === 'ar'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const sections = [
    { id: 'overview', label: locale === 'ar' ? 'نظرة عامة' : 'Overview' },
    { id: 'vision-mission', label: locale === 'ar' ? 'الرؤية والرسالة' : 'Vision & Mission' },
    { id: 'values', label: locale === 'ar' ? 'قيمنا' : 'Our Values' },
    { id: 'work-areas', label: locale === 'ar' ? 'مجالات العمل' : 'Work Areas' },
    { id: 'history', label: locale === 'ar' ? 'مسيرتنا' : 'Our Journey' },
    { id: 'achievements', label: locale === 'ar' ? 'إنجازاتنا' : 'Achievements' },
    { id: 'partners', label: locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Supporters' },
  ]

  const [active, setActive] = useState('overview')

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

        {/* Sidebar */}
        <aside className="hidden md:block w-56 lg:w-64 shrink-0">
          <nav className="sticky top-32">
            <ul className="space-y-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setActive(s.id)}
                    className={`w-full text-start px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 group ${
                      active === s.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-primary-500'
                    }`}
                  >
                    {active === s.id && (
                      <span className="w-1 h-4 bg-secondary-500 rounded-full shrink-0" />
                    )}
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Divider + links */}
            <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
              <Link
                href={`/${locale}/team-governance`}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors px-4 py-2"
              >
                <ChevronIcon className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'الفريق والحوكمة' : 'Team & Governance'}
              </Link>
              <Link
                href={`/${locale}/partners-supporters`}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors px-4 py-2"
              >
                <ChevronIcon className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'الشركاء والداعمون' : 'Partners & Supporters'}
              </Link>
            </div>
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden w-full mb-6 -mt-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active === s.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">

          {/* ── OVERVIEW ── */}
          {active === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-3xl font-black text-primary-500 mb-4">
                  {locale === 'ar' ? 'من نحن' : 'Who We Are'}
                </h2>
                <p className="text-neutral-600 leading-relaxed text-lg">{about.intro[locale]}</p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: '2018', label: locale === 'ar' ? 'سنة التأسيس' : 'Founded' },
                  { value: '47+', label: locale === 'ar' ? 'مشروع' : 'Projects' },
                  { value: '85K+', label: locale === 'ar' ? 'مستفيد' : 'Beneficiaries' },
                  { value: '12', label: locale === 'ar' ? 'محافظة' : 'Governorates' },
                ].map(s => (
                  <div key={s.label} className="bg-primary-50 rounded-2xl p-5 text-center">
                    <div className="text-3xl font-black text-secondary-500 mb-1">{s.value}</div>
                    <div className="text-xs text-neutral-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => setActive('vision-mission')}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {locale === 'ar' ? 'رؤيتنا ورسالتنا' : 'Our Vision & Mission'}
                  <ChevronIcon className="w-4 h-4" />
                </button>
                <Link
                  href={`/${locale}/team-governance`}
                  className="inline-flex items-center gap-2 border border-primary-200 text-primary-500 hover:bg-primary-50 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  {locale === 'ar' ? 'تعرف على الفريق' : 'Meet the Team'}
                </Link>
              </div>
            </div>
          )}

          {/* ── VISION & MISSION ── */}
          {active === 'vision-mission' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-6">
                {locale === 'ar' ? 'الرؤية والرسالة' : 'Vision & Mission'}
              </h2>
              <div className="bg-primary-50 rounded-2xl p-8 border-s-4 border-primary-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-500">
                    {locale === 'ar' ? 'رؤيتنا' : 'Our Vision'}
                  </h3>
                </div>
                <p className="text-neutral-700 leading-relaxed text-lg">{about.vision[locale]}</p>
              </div>
              <div className="bg-secondary-50 rounded-2xl p-8 border-s-4 border-secondary-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-500">
                    {locale === 'ar' ? 'رسالتنا' : 'Our Mission'}
                  </h3>
                </div>
                <p className="text-neutral-700 leading-relaxed text-lg">{about.mission[locale]}</p>
              </div>
            </div>
          )}

          {/* ── VALUES ── */}
          {active === 'values' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-2">
                {locale === 'ar' ? 'قيمنا' : 'Our Values'}
              </h2>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar' ? 'القيم التي تحكم عملنا وتوجه قراراتنا' : 'Values that govern our work and guide our decisions'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {about.values.map((value, i) => (
                  <div key={value.id} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                        <Heart className="w-4 h-4 text-primary-500" />
                      </div>
                      <span className="text-xs font-bold text-secondary-500 bg-secondary-50 px-2 py-0.5 rounded-full">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="font-bold text-primary-500 mb-2">{value.title[locale]}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{value.description[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── WORK AREAS ── */}
          {active === 'work-areas' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-2">
                {locale === 'ar' ? 'مجالات عملنا' : 'Work Areas'}
              </h2>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar' ? 'نعمل عبر محاور رئيسية للتغيير الإيجابي' : 'We work across main axes for positive change'}
              </p>
              <div className="space-y-4">
                {about.workAreas.map((area) => (
                  <div key={area.id} className="flex gap-4 p-5 bg-white rounded-2xl border border-neutral-100 hover:border-secondary-200 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 bg-secondary-500 group-hover:bg-secondary-600 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary-500 mb-1">{area.title[locale]}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{area.description[locale]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {active === 'history' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-2">
                {locale === 'ar' ? 'مسيرتنا' : 'Our Journey'}
              </h2>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar' ? 'محطات أساسية في تاريخ المركز' : 'Key milestones in the Center\'s history'}
              </p>
              <div className="space-y-0">
                  {about.history.map((item, index) => (
                    <div key={item.year} className="flex gap-5 items-start">
                      {/* Badge + vertical line */}
                      <div className="relative z-10 shrink-0 flex flex-col items-center">
                        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center font-black text-white text-sm shadow-md">
                          {item.year}
                        </div>
                        {index < about.history.length - 1 && (
                          <div className="w-px flex-1 min-h-6 bg-neutral-200 my-1" />
                        )}
                      </div>
                      <div className="bg-white rounded-2xl p-5 flex-1 border border-neutral-100 hover:border-primary-100 hover:shadow-sm transition-all mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-3.5 h-3.5 text-secondary-500" />
                          <span className="text-xs font-bold text-secondary-500">{item.year}</span>
                        </div>
                        <p className="text-neutral-700 text-sm leading-relaxed">{item.event[locale]}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          )}

          {/* ── ACHIEVEMENTS ── */}
          {active === 'achievements' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-2">
                {locale === 'ar' ? 'إنجازاتنا' : 'Our Achievements'}
              </h2>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar' ? 'أرقام تعكس حجم تأثيرنا في المجتمع' : 'Numbers that reflect our community impact'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {about.achievements.map((a) => (
                  <div key={a.id} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-secondary-200 hover:shadow-md transition-all text-center group">
                    <div className="w-12 h-12 bg-secondary-50 group-hover:bg-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Trophy className="w-6 h-6 text-secondary-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-3xl font-black text-secondary-500 mb-1">{a.value}</div>
                    <p className="text-sm text-neutral-500">{a.title[locale]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PARTNERS ── */}
          {active === 'partners' && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500 mb-2">
                {locale === 'ar' ? 'شركاؤنا وداعمونا' : 'Partners & Supporters'}
              </h2>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar' ? 'نتعاون مع منظمات محلية ودولية لتحقيق أثر أكبر' : 'We collaborate with local and international organizations for greater impact'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {partners.slice(0, 9).map((partner) => (
                  <div key={partner.id} className="bg-white rounded-2xl p-5 border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all flex items-center justify-center h-24">
                    <Image
                      src={partner.logo}
                      alt={partner.name[locale]}
                      width={120}
                      height={48}
                      className="object-contain max-h-12"
                    />
                  </div>
                ))}
              </div>
              <Link
                href={`/${locale}/partners-supporters`}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Handshake className="w-4 h-4" />
                {locale === 'ar' ? 'عرض جميع الشركاء' : 'View All Partners'}
              </Link>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
