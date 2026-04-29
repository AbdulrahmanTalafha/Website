import type { Metadata } from 'next'
import type { Locale } from '@/types'
import { buildMetadata } from '@/lib/seo'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { searchContent } from '@/lib/api'
import { Search, FileText, Folder, Newspaper, Megaphone } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params as { locale: Locale }
  return buildMetadata({
    locale,
    canonicalPath: `/${locale}/search`,
    customTitle: locale === 'ar' ? 'البحث' : 'Search',
  })
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params as { locale: Locale }
  const { q } = await searchParams
  const query = q ?? ''

  const results = query.length >= 2 ? await searchContent(locale, query) : null
  const totalResults = results
    ? results.projects.length + results.publications.length + results.news.length + results.initiatives.length
    : 0

  const sections = results
    ? [
        { key: 'projects', icon: <Folder className="w-4 h-4" />, label: locale === 'ar' ? 'المشاريع' : 'Projects', items: results.projects, href: (slug: string) => `/${locale}/programs-projects/${slug}` },
        { key: 'publications', icon: <FileText className="w-4 h-4" />, label: locale === 'ar' ? 'المنشورات' : 'Publications', items: results.publications, href: (slug: string) => `/${locale}/publications-reports/${slug}` },
        { key: 'news', icon: <Newspaper className="w-4 h-4" />, label: locale === 'ar' ? 'الأخبار' : 'News', items: results.news, href: (slug: string) => `/${locale}/media-center/${slug}` },
        { key: 'initiatives', icon: <Megaphone className="w-4 h-4" />, label: locale === 'ar' ? 'المبادرات' : 'Initiatives', items: results.initiatives, href: () => `/${locale}/initiatives-campaigns` },
      ]
    : []

  return (
    <>
      <div className="bg-primary-500 text-white py-16">
        <div className="container-wide">
          <Breadcrumbs locale={locale} items={[{ label: locale === 'ar' ? 'البحث' : 'Search' }]} light />
          <h1 className="text-4xl font-black mt-4 mb-6">{locale === 'ar' ? 'البحث' : 'Search'}</h1>
          <form method="GET" className="max-w-2xl">
            <div className="relative">
              <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 ${locale === 'ar' ? 'right-4' : 'left-4'}`} />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={locale === 'ar' ? 'ابحث عن مشاريع، منشورات، أخبار...' : 'Search projects, publications, news...'}
                className={`w-full bg-white text-neutral-800 rounded-xl py-4 ${locale === 'ar' ? 'pe-5 ps-12' : 'ps-12 pe-5'} focus:outline-none focus:ring-2 focus:ring-white/50`}
                autoComplete="off"
              />
            </div>
          </form>
        </div>
      </div>

      <section className="section-padding bg-neutral-50 min-h-screen">
        <div className="container-wide">
          {!query && (
            <div className="text-center py-16 text-neutral-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg">{locale === 'ar' ? 'ابدأ بكتابة كلمة البحث' : 'Start typing to search'}</p>
            </div>
          )}

          {query && query.length < 2 && (
            <div className="text-center py-16 text-neutral-400">
              <p>{locale === 'ar' ? 'يرجى إدخال حرفين على الأقل' : 'Please enter at least 2 characters'}</p>
            </div>
          )}

          {results && totalResults === 0 && (
            <div className="text-center py-16 text-neutral-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-semibold mb-2">
                {locale === 'ar' ? `لا نتائج لـ "${query}"` : `No results for "${query}"`}
              </p>
              <p className="text-sm">{locale === 'ar' ? 'جرب كلمات مختلفة' : 'Try different keywords'}</p>
            </div>
          )}

          {results && totalResults > 0 && (
            <>
              <p className="text-neutral-500 mb-8">
                {locale === 'ar'
                  ? `${totalResults} نتيجة لـ "${query}"`
                  : `${totalResults} results for "${query}"`}
              </p>

              <div className="space-y-10">
                {sections.filter(s => s.items.length > 0).map(section => (
                  <div key={section.key}>
                    <h2 className="flex items-center gap-2 text-lg font-black text-primary-500 mb-4">
                      {section.icon}
                      {section.label}
                      <span className="text-neutral-400 font-normal text-sm">({section.items.length})</span>
                    </h2>
                    <div className="space-y-3">
                      {section.items.map(result => (
                        <Link
                          key={result.id}
                          href={section.href(result.slug)}
                          className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow hover:border-primary-100 border border-transparent"
                        >
                          <div className="flex items-start gap-4">
                            {result.image && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-neutral-800 mb-1 truncate">{result.title}</h3>
                              <p className="text-neutral-500 text-sm line-clamp-2">{result.excerpt}</p>
                              {'date' in result && result.date && <p className="text-xs text-neutral-400 mt-1">{result.date}</p>}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
