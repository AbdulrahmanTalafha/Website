import type { Locale, TeamMember } from '@/types'
import { resolveCmsMediaUrl } from '@/lib/cmsMedia'
import { placeholderPhotoUrl } from '@/lib/placeholderImages'
import type { CmsTeamMemberRecord } from '@/lib/cms'

export function mapCmsTeamMemberToTeamMember(record: CmsTeamMemberRecord): TeamMember {
  return {
    id: String(record.id),
    slug: record.slug,
    name: { en: record.name_en, ar: record.name_ar },
    position: { en: record.position_en, ar: record.position_ar },
    department: {
      en: record.department_en ?? '',
      ar: record.department_ar ?? '',
    },
    bio: {
      en: record.bio_en ?? '',
      ar: record.bio_ar ?? '',
    },
    email: record.email ?? '',
    linkedin: record.linkedin ?? undefined,
    photo: resolveCmsMediaUrl(
      record.photo,
      undefined,
      placeholderPhotoUrl(`team-${record.slug}`, 400, 400),
    ),
    order: record.sort_order ?? 0,
  }
}
