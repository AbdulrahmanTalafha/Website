import type { Locale } from '@/types'
import type { Project } from '@/types'
import SectionHeader from '@/components/common/SectionHeader'
import ProjectCard from '@/components/projects/ProjectCard'
import Button from '@/components/common/Button'
import { ArrowRight, ArrowLeft } from 'lucide-react'

interface FeaturedProjectsProps {
  locale: Locale
  projects: Project[]
}

export default function FeaturedProjects({ locale, projects }: FeaturedProjectsProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="section-padding bg-neutral-50">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <SectionHeader
            title={locale === 'ar' ? 'برامجنا ومشاريعنا' : 'Our Programs & Projects'}
            subtitle={locale === 'ar'
              ? 'مشاريع متنوعة تخدم المجتمع الأردني في مجالات المواطنة والحقوق والديمقراطية'
              : 'Diverse projects serving Jordanian society in citizenship, rights, and democracy fields'
            }
          />
          <Button
            href={`/${locale}/programs-projects`}
            variant="outline"
            size="sm"
            icon={<ArrowIcon className="w-4 h-4" />}
            className="shrink-0 self-start sm:self-end mb-10"
          >
            {locale === 'ar' ? 'عرض الكل' : 'View All'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-reveal-stagger>
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
