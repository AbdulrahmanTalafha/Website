import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BASE_URL, buildBreadcrumbSchema, buildMetadata, buildPersonSchema } from '@/lib/seo'
import JsonLd from '@/components/common/JsonLd'
import { getTeam } from '@/lib/api'
import { Mail, Linkedin, ArrowLeft, ArrowRight, Building2 } from 'lucide-react'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const team = await getTeam('en')
  const locales = ['en', 'ar']
  return locales.flatMap((locale) =>
    team.map((m) => ({ locale, slug: m.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const team = await getTeam(locale)
  const member = team.find((m) => m.slug === slug)
  if (!member) return {}
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/team-governance/${slug}`,
    customTitle: member.name[locale],
    customDescription: member.bio[locale].slice(0, 160),
  })
}

export default async function TeamMemberPage({ params }: Props) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const team = await getTeam(locale)
  const memberIndex = team.findIndex((m) => m.slug === slug)
  if (memberIndex === -1) notFound()

  const member = team[memberIndex]
  const isRTL = locale === 'ar'
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft
  const prevMember = memberIndex > 0 ? team[memberIndex - 1] : null
  const nextMember = memberIndex < team.length - 1 ? team[memberIndex + 1] : null

  return (
    <>
      <JsonLd data={[
        buildBreadcrumbSchema([
          { name: isRTL ? 'الرئيسية' : 'Home', url: `${BASE_URL}/${locale}` },
          { name: isRTL ? 'الفريق والحوكمة' : 'Team & Governance', url: `${BASE_URL}/${locale}/team-governance` },
          { name: member.name[locale], url: `${BASE_URL}/${locale}/team-governance/${slug}` },
        ]),
        buildPersonSchema({
          name: member.name[locale],
          jobTitle: member.position[locale],
          email: member.email,
          image: member.photo,
        }),
      ]} />

      {/* Hero section */}
      <section className="bg-white">
        <div className="container-wide py-12 lg:py-16">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 items-start">

            {/* Photo card */}
            <div className="lg:col-span-1">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
                <Image
                  src={member.photo}
                  alt={member.name[locale]}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-600/80 via-transparent to-transparent" />

                {/* Name card at bottom of photo */}
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <p className="text-secondary-400 text-sm font-semibold uppercase tracking-wider mb-1">
                    {member.department[locale]}
                  </p>
                  <h1 className="text-white text-2xl font-black leading-tight">
                    {member.name[locale]}
                  </h1>
                  <p className="text-white/80 text-sm mt-1 font-medium">
                    {member.position[locale]}
                  </p>
                </div>
              </div>

              {/* Contact buttons */}
              <div className="mt-5 flex flex-col gap-3">
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center justify-center gap-2.5 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  {member.email}
                </a>
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-5 rounded-xl transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-2 flex flex-col gap-8">

              {/* Back link */}
              <Link
                href={`/${locale}/team-governance`}
                className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary-500 transition-colors group w-fit"
              >
                <ArrowBack className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                {isRTL ? 'العودة إلى الفريق' : 'Back to Team'}
              </Link>

              {/* Role badge + title */}
              <div>
                <div className="inline-flex items-center gap-2 bg-secondary-50 text-secondary-600 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                  <Building2 className="w-3.5 h-3.5" />
                  {member.department[locale]}
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-primary-500 mb-2 leading-tight">
                  {member.name[locale]}
                </h2>
                <p className="text-secondary-500 text-lg font-semibold">
                  {member.position[locale]}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-secondary-500 via-neutral-200 to-transparent w-full" />

              {/* Bio */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">
                  {isRTL ? 'نبذة تعريفية' : 'Biography'}
                </h3>
                <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed text-base">
                  {member.bio[locale].split('\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                  ))}
                </div>
              </div>

              {/* Info chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                  <p className="text-xs text-neutral-400 font-medium mb-1">{isRTL ? 'المسمى الوظيفي' : 'Job Title'}</p>
                  <p className="text-primary-500 font-bold text-sm">{member.position[locale]}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                  <p className="text-xs text-neutral-400 font-medium mb-1">{isRTL ? 'القسم' : 'Department'}</p>
                  <p className="text-primary-500 font-bold text-sm">{member.department[locale]}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100 sm:col-span-2">
                  <p className="text-xs text-neutral-400 font-medium mb-1">{isRTL ? 'البريد الإلكتروني' : 'Email'}</p>
                  <a href={`mailto:${member.email}`} className="text-secondary-500 font-bold text-sm hover:underline">
                    {member.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other team members */}
      <section className="bg-neutral-50 border-t border-neutral-100 py-14">
        <div className="container-wide">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-secondary-500 rounded-full shrink-0" />
            <h3 className="text-primary-500 text-xl font-black">
              {isRTL ? 'أعضاء الفريق الآخرون' : 'Other Team Members'}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-200 to-transparent" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {team.filter((m) => m.id !== member.id).map((m) => (
              <Link
                key={m.id}
                href={`/${locale}/team-governance/${m.slug}`}
                className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:border-primary-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-36 overflow-hidden bg-primary-50">
                  <Image
                    src={m.photo}
                    alt={m.name[locale]}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-bold text-primary-500 leading-tight group-hover:text-secondary-500 transition-colors">{m.name[locale]}</p>
                  <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{m.position[locale]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Prev / Next navigation */}
      {(prevMember || nextMember) && (
        <div className="bg-white border-t border-neutral-100">
          <div className="container-wide py-6 flex justify-between items-center gap-4">
            {prevMember ? (
              <Link
                href={`/${locale}/team-governance/${prevMember.slug}`}
                className="flex items-center gap-3 group"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 rtl:rotate-180 transition-colors" />
                <div>
                  <p className="text-xs text-neutral-400">{isRTL ? 'السابق' : 'Previous'}</p>
                  <p className="text-sm font-bold text-primary-500">{prevMember.name[locale]}</p>
                </div>
              </Link>
            ) : <div />}
            {nextMember ? (
              <Link
                href={`/${locale}/team-governance/${nextMember.slug}`}
                className="flex items-center gap-3 group text-end"
              >
                <div>
                  <p className="text-xs text-neutral-400">{isRTL ? 'التالي' : 'Next'}</p>
                  <p className="text-sm font-bold text-primary-500">{nextMember.name[locale]}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-500 rtl:rotate-180 transition-colors" />
              </Link>
            ) : <div />}
          </div>
        </div>
      )}
    </>
  )
}
