'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Target, Heart, Users, Shield, ChevronRight, ChevronLeft, ExternalLink, FileText } from 'lucide-react'
import type { Locale } from '@/types'
import type { CmsAboutPageData } from '@/lib/cms'
import { aboutData } from '@/data/about'
import CmsRichText from '@/components/common/CmsRichText'

interface AboutContentProps {
  locale: Locale
  pageCms: CmsAboutPageData | null
  connected: boolean
}

export default function AboutContent({ locale, pageCms, connected }: AboutContentProps) {
  const isRTL = locale === 'ar'
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight

  const overview = pageCms?.sections?.overview
  const whoWeAre = pageCms?.sections?.who_we_are
  const governance = pageCms?.sections?.governance

  const overviewTitle = connected && overview?.title
    ? overview.title
    : (isRTL ? 'من نحن' : 'Who We Are')

  const overviewDescription = connected && overview?.description
    ? overview.description
    : aboutData.intro[locale]

  const vision = connected && whoWeAre?.vision
    ? whoWeAre.vision
    : aboutData.vision[locale]

  const mission = connected && whoWeAre?.mission
    ? whoWeAre.mission
    : aboutData.mission[locale]

  const values = connected && whoWeAre?.values?.length
    ? whoWeAre.values.map((v, i) => ({
        id: v.id ?? `value-${i}`,
        title: v.title ?? '',
        description: v.description ?? '',
      }))
    : aboutData.values.map((v) => ({
        id: v.id,
        title: v.title[locale],
        description: v.description[locale],
      }))

  const governanceTitle = connected && governance?.title
    ? governance.title
    : (isRTL ? 'الحوكمة والشفافية' : 'Governance & Transparency')

  const governanceIntro = connected && governance?.intro
    ? governance.intro
    : (isRTL
      ? 'نلتزم بمعايير الحوكمة الرشيدة والشفافية في إدارة المركز.'
      : 'We are committed to good governance and transparency in managing the Center.')

  const policyGroups = connected && governance?.policy_groups?.length
    ? governance.policy_groups
    : []

  const sections = [
    { id: 'overview', label: isRTL ? 'نظرة عامة' : 'Overview', visible: !connected || overview?.is_visible !== false },
    { id: 'who-we-are', label: isRTL ? 'الرؤية والرسالة والقيم' : 'Vision, Mission & Values', visible: !connected || whoWeAre?.is_visible !== false },
    { id: 'governance', label: isRTL ? 'الحوكمة والشفافية' : 'Governance', visible: !connected || governance?.is_visible !== false },
  ].filter((s) => s.visible)

  const [active, setActive] = useState(sections[0]?.id ?? 'overview')

  return (
    <div className="container-wide py-12 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

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

            <div className="mt-6 pt-6 border-t border-neutral-200 space-y-2">
              <Link
                href={`/${locale}/team-governance`}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors px-4 py-2"
              >
                <ChevronIcon className="w-3.5 h-3.5" />
                {isRTL ? 'فريق العمل' : 'Our Team'}
              </Link>
              <Link
                href={`/${locale}/partners-supporters`}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors px-4 py-2"
              >
                <ChevronIcon className="w-3.5 h-3.5" />
                {isRTL ? 'الشركاء والداعمون' : 'Partners & Supporters'}
              </Link>
            </div>
          </nav>
        </aside>

        <div className="md:hidden w-full mb-6 -mt-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  active === s.id ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-3">
            <Link
              href={`/${locale}/team-governance`}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600"
            >
              {isRTL ? 'فريق العمل' : 'Our Team'}
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              href={`/${locale}/partners-supporters`}
              className="text-xs font-semibold text-primary-500 hover:text-primary-600"
            >
              {isRTL ? 'الشركاء والداعمون' : 'Partners & Supporters'}
            </Link>
          </div>
        </div>

        <main className="flex-1 min-w-0">

          {active === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500">{overviewTitle}</h2>
              <div className="text-neutral-600 leading-relaxed text-lg prose prose-lg max-w-none">
                <CmsRichText html={overviewDescription} />
              </div>
              <button
                onClick={() => setActive('who-we-are')}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {isRTL ? 'رؤيتنا ورسالتنا وقيمنا' : 'Vision, Mission & Values'}
                <ChevronIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {active === 'who-we-are' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-black text-primary-500">
                {connected && whoWeAre?.title
                  ? whoWeAre.title
                  : (isRTL ? 'الرؤية، الرسالة، القيم' : 'Vision, Mission & Values')}
              </h2>

              <div className="bg-primary-50 rounded-2xl p-8 border-s-4 border-primary-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-500">
                    {isRTL ? 'رؤيتنا' : 'Our Vision'}
                  </h3>
                </div>
                <div className="text-neutral-700 leading-relaxed text-lg prose prose-lg max-w-none">
                  <CmsRichText html={vision} />
                </div>
              </div>

              <div className="bg-secondary-50 rounded-2xl p-8 border-s-4 border-secondary-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-500">
                    {isRTL ? 'رسالتنا' : 'Our Mission'}
                  </h3>
                </div>
                <div className="text-neutral-700 leading-relaxed text-lg prose prose-lg max-w-none">
                  <CmsRichText html={mission} />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-primary-500 mb-6">
                  {isRTL ? 'قيمنا' : 'Our Values'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {values.map((value, i) => (
                    <div key={value.id} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:border-primary-200 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                          <Heart className="w-4 h-4 text-primary-500" />
                        </div>
                        <span className="text-xs font-bold text-secondary-500 bg-secondary-50 px-2 py-0.5 rounded-full">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <h4 className="font-bold text-primary-500 mb-2">{value.title}</h4>
                      <div className="text-sm text-neutral-600 leading-relaxed prose prose-sm max-w-none">
                        <CmsRichText html={value.description} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'governance' && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h2 className="text-3xl font-black text-primary-500 mb-4">{governanceTitle}</h2>
                <div className="text-neutral-600 leading-relaxed text-lg prose prose-lg max-w-none">
                  <CmsRichText html={governanceIntro} />
                </div>
              </div>

              {policyGroups.length > 0 ? (
                <div className="space-y-6">
                  {policyGroups.map((group, gi) => (
                    <div key={gi} className="bg-white rounded-2xl border border-neutral-100 p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
                          <Shield className="w-4 h-4 text-primary-500" />
                        </div>
                        <h3 className="font-black text-primary-500">{group.title}</h3>
                      </div>
                      <ul className="space-y-2">
                        {(group.policies ?? []).map((policy, pi) => (
                          <li key={pi}>
                            {policy.url ? (
                              <a
                                href={policy.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary-500 transition-colors py-2 px-3 rounded-xl hover:bg-primary-50"
                              >
                                <FileText className="w-4 h-4 shrink-0 text-primary-400" />
                                <span className="flex-1">{policy.title}</span>
                                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50" />
                              </a>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-neutral-700 py-2 px-3">
                                <FileText className="w-4 h-4 shrink-0 text-primary-400" />
                                <span>{policy.title}</span>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-neutral-500 text-sm bg-neutral-50 rounded-2xl p-6">
                  <Users className="w-5 h-5" />
                  {isRTL ? 'سيتم إضافة السياسات من لوحة التحكم.' : 'Policies will appear here once added in the CMS.'}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
