import Button from '@/components/common/Button'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import type { Locale } from '@/types'
import { Home, Search } from 'lucide-react'

export default function NotFoundContent({ locale }: { locale: Locale }) {
  const isRTL = locale === 'ar'

  return (
    <>
      <div className="bg-primary-500 text-white py-14 md:py-16">
        <div className="container-wide">
          <Breadcrumbs
            locale={locale}
            items={[{ label: isRTL ? 'الصفحة غير موجودة' : 'Page not found' }]}
            light
          />
          <p className="text-secondary-300 font-bold text-sm mt-4 tracking-wide">404</p>
          <h1 className="text-3xl md:text-4xl font-black mt-2">
            {isRTL ? 'الصفحة غير موجودة' : 'Page not found'}
          </h1>
          <p className="text-white/75 mt-3 max-w-xl text-sm md:text-base">
            {isRTL
              ? 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.'
              : 'The page you are looking for does not exist or has moved.'}
          </p>
        </div>
      </div>

      <section className="section-padding bg-neutral-50 flex-1 flex items-center">
        <div className="container-wide max-w-lg mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-50 text-primary-500 mb-6">
            <Search className="w-10 h-10" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="text-neutral-600 mb-8">
            {isRTL
              ? 'تحقق من الرابط أو ارجع إلى الصفحة الرئيسية.'
              : 'Check the URL or return to the homepage.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href={`/${locale}`} variant="primary" size="lg" icon={<Home className="w-4 h-4" />}>
              {isRTL ? 'الصفحة الرئيسية' : 'Go to homepage'}
            </Button>
            <Button href={`/${locale}/search`} variant="outline" size="lg">
              {isRTL ? 'البحث في الموقع' : 'Search the site'}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
