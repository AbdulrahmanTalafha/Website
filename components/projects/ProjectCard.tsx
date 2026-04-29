import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/types'
import type { Project } from '@/types'
import { Calendar, MapPin, Users, ArrowRight, ArrowLeft } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  locale: Locale
  featured?: boolean
}

export default function ProjectCard({ project, locale, featured = false }: ProjectCardProps) {
  const isRTL = locale === 'ar'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const statusColors = {
    active: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
    completed: { bg: 'bg-neutral-50', text: 'text-neutral-600', dot: 'bg-neutral-400' },
    upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  }
  const statusLabels = {
    active: { ar: 'جاري التنفيذ', en: 'Active' },
    completed: { ar: 'مكتمل', en: 'Completed' },
    upcoming: { ar: 'قادم', en: 'Upcoming' },
  }
  const statusColor = statusColors[project.status]

  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden border border-neutral-100 card-hover group ${
        featured ? 'lg:grid lg:grid-cols-2' : 'flex flex-col'
      }`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-full min-h-[240px]' : 'h-52'}`}>
        <Image
          src={project.featuredImage}
          alt={project.title[locale]}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Status badge */}
        <div className={`absolute top-3 start-3 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor.bg} ${statusColor.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot} ${project.status === 'active' ? 'animate-pulse' : ''}`} />
          {statusLabels[project.status][locale]}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Sector tag */}
        <div className="inline-flex mb-3">
          <span className="text-xs text-secondary-600 font-semibold bg-secondary-50 px-2.5 py-1 rounded-full">
            {project.sector[locale]}
          </span>
        </div>

        <h3 className="font-bold text-lg text-primary-500 mb-2 leading-snug group-hover:text-secondary-500 transition-colors line-clamp-2">
          {project.title[locale]}
        </h3>

        <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.shortDescription[locale]}
        </p>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary-300" />
            <span>{project.donor[locale]}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-300" />
            <span dir="ltr">{project.startDate.slice(0, 4)} — {project.endDate.slice(0, 4)}</span>
          </div>
          {project.governorates.length > 0 && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-300" />
              <span>{project.governorates.slice(0, 3).join(', ')}{project.governorates.length > 3 ? ` +${project.governorates.length - 3}` : ''}</span>
            </div>
          )}
        </div>

        <Link
          href={`/${locale}/programs-projects/${project.slug}`}
          className="flex items-center gap-1.5 text-sm font-semibold text-secondary-500 hover:text-secondary-600 transition-colors mt-auto"
          aria-label={`${locale === 'ar' ? 'اقرأ المزيد عن' : 'Read more about'} ${project.title[locale]}`}
        >
          {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
          <ArrowIcon className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )
}
