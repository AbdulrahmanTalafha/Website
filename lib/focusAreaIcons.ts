import {
  Vote,
  Eye,
  BookOpen,
  Users,
  Briefcase,
  Monitor,
  type LucideIcon,
} from 'lucide-react'

export const focusAreaIconMap = {
  vote: Vote,
  eye: Eye,
  'book-open': BookOpen,
  'political-empowerment': Users,
  'economic-empowerment': Briefcase,
  'digital-media': Monitor,
} as const

export type FocusAreaIconKey = keyof typeof focusAreaIconMap

export function getFocusAreaIcon(icon: string): LucideIcon {
  return focusAreaIconMap[icon as FocusAreaIconKey] ?? Vote
}
