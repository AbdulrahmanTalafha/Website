// Core Locale type
export type Locale = 'ar' | 'en'
export type Dir = 'rtl' | 'ltr'

// ─── Navigation ────────────────────────────────────────────────────────────────
export interface NavItem {
  label: Record<Locale, string>
  href: string
  description?: Record<Locale, string>
  children?: NavItem[]
}

// ─── Site Metadata ──────────────────────────────────────────────────────────────
export interface SiteInfo {
  name: Record<Locale, string>
  tagline: Record<Locale, string>
  description: Record<Locale, string>
  url: string
  email: string
  phone: string
  address: Record<Locale, string>
  social: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  }
}

// ─── Hero / Home ────────────────────────────────────────────────────────────────
export interface HeroData {
  title: Record<Locale, string>
  subtitle: Record<Locale, string>
  ctaPrimary: Record<Locale, string>
  ctaSecondary: Record<Locale, string>
  imagePlaceholder: string
}

export interface StatItem {
  id: string
  value: number
  suffix?: string
  label: Record<Locale, string>
  icon?: string
}

// ─── About ──────────────────────────────────────────────────────────────────────
export interface AboutSection {
  intro: Record<Locale, string>
  vision: Record<Locale, string>
  mission: Record<Locale, string>
  values: Array<{
    id: string
    title: Record<Locale, string>
    description: Record<Locale, string>
    icon: string
  }>
  workAreas: Array<{
    id: string
    title: Record<Locale, string>
    description: Record<Locale, string>
    icon: string
  }>
  history: Array<{
    year: string
    event: Record<Locale, string>
  }>
  achievements: Array<{
    id: string
    title: Record<Locale, string>
    value: string
  }>
}

// ─── Team ───────────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string
  slug: string
  name: Record<Locale, string>
  position: Record<Locale, string>
  department: Record<Locale, string>
  bio: Record<Locale, string>
  email: string
  linkedin?: string
  photo: string
  order: number
}

export interface GovernanceBody {
  id: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  members: string[] // TeamMember ids
}

// ─── Programs & Projects ────────────────────────────────────────────────────────
export interface Project {
  id: string
  slug: string
  title: Record<Locale, string>
  shortDescription: Record<Locale, string>
  fullDescription: Record<Locale, string>
  donor: Record<Locale, string>
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'upcoming'
  sector: Record<Locale, string>
  sectorKey: string
  geographicLevel?: 'local' | 'national'
  geographicLevelLabel?: string
  directBeneficiaries?: number
  indirectBeneficiaries?: number
  partnerId?: string
  governorateKeys?: string[]
  ageGroupKeys?: string[]
  targetGenderLabels?: string[]
  targetGroup: Record<Locale, string>
  genderClassification: 'mixed' | 'female' | 'male' | 'youth'
  targetGenders?: ('male' | 'female')[]
  ageGroups: string[]
  governorates: string[]
  keyResults: Array<Record<Locale, string>>
  images: string[]
  relatedNews?: string[] // NewsItem ids
  relatedPublications?: string[] // Publication ids
  featuredImage: string
}

// ─── Initiatives & Campaigns ────────────────────────────────────────────────────
export type InitiativeCategory =
  | 'initiative'
  | 'digital-campaign'
  | 'advocacy-campaign'
  | 'awareness-campaign'

export interface Initiative {
  id: string
  slug: string
  title: Record<Locale, string>
  shortDescription: Record<Locale, string>
  description: Record<Locale, string>
  objective: Record<Locale, string>
  outputs: Array<Record<Locale, string>>
  category: InitiativeCategory
  reachValue?: number
  reachSuffix?: Record<Locale, string>
  images: string[]
  videos?: string[] // YouTube embed URLs or direct mp4 URLs
  relatedProject?: string // Project id
  startDate: string
  endDate?: string
  featuredImage: string
}

// ─── Publications & Reports ─────────────────────────────────────────────────────
export type PublicationType =
  | 'report'
  | 'study'
  | 'policy-paper'
  | 'guide'
  | 'brief'

export interface Publication {
  id: string
  slug: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  coverImage: string
  publishDate: string
  type: PublicationType
  tags: Array<Record<Locale, string>>
  pdfUrl: string
  relatedMaterials?: string[]
  authors?: Array<Record<Locale, string>>
  pages?: number
}

// ─── Digital Observatory ────────────────────────────────────────────────────────
export interface ObservatoryCase {
  id: string
  date: string
  platform: string
  incidentType: Record<Locale, string>
  gender: 'male' | 'female' | 'other' | 'unknown'
  governorate: string
  description: Record<Locale, string>
  severity: 'low' | 'medium' | 'high'
}

export interface ObservatoryTrend {
  month: string
  cases: number
  hateSpeech: number
  digitalViolence: number
}

export interface ObservatoryStats {
  totalCases: number
  hateSpeeachCases: number
  digitalViolenceCases: number
  platformDistribution: Array<{ platform: string; count: number }>
  genderDistribution: Array<{ gender: string; count: number; label: Record<Locale, string> }>
  governorateDistribution: Array<{ governorate: string; count: number; label: Record<Locale, string> }>
  monthlyTrend: ObservatoryTrend[]
}

export interface ObservatoryReport {
  id: string
  slug: string
  title: Record<Locale, string>
  summary: Record<Locale, string>
  publishDate: string
  coverImage: string
  pdfUrl: string
}

// ─── E-Election Platform ────────────────────────────────────────────────────────
export type ElectionStatus = 'active' | 'upcoming' | 'completed'

export interface Election {
  id: string
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  startDate: string
  endDate: string
  status: ElectionStatus
  totalVoters?: number
  totalCandidates?: number
  organization: Record<Locale, string>
  type: Record<Locale, string>
  image: string
}

// ─── Media Center ───────────────────────────────────────────────────────────────
export type MediaCategory = 'news' | 'activity' | 'press-release' | 'media-coverage' | 'tv-appearance' | 'multimedia' | 'announcement'

export interface NewsItem {
  id: string
  slug: string
  title: Record<Locale, string>
  excerpt: Record<Locale, string>
  content: Record<Locale, string>
  date: string
  image: string
  category: MediaCategory
  author?: Record<Locale, string>
  source?: Record<Locale, string>       // for media-coverage: which outlet
  sourceUrl?: string                    // external article link
  embedUrl?: string                     // YouTube / FB / IG embed URL
  embedType?: 'youtube' | 'facebook' | 'instagram' | 'twitter'
  videoUrl?: string                     // direct mp4 for tv-appearance
  duration?: string                     // e.g. '12:34'
  channel?: Record<Locale, string>      // TV channel name
  relatedProject?: string
  relatedPublication?: string
  tags?: Array<Record<Locale, string>>
  featured?: boolean
}

export interface GalleryItem {
  id: string
  type: 'photo' | 'video'
  title: Record<Locale, string>
  url: string
  thumbnail: string
  date: string
  relatedEvent?: string
}

// ─── Partners ───────────────────────────────────────────────────────────────────
export type PartnerCategory =
  | 'local-partner'
  | 'international-partner'
  | 'donor'

export interface Partner {
  id: string
  name: Record<Locale, string>
  description?: Record<Locale, string>
  logo: string
  website?: string
  category: PartnerCategory
}

// ─── Search ──────────────────────────────────────────────────────────────────────
export type SearchResultType =
  | 'project'
  | 'publication'
  | 'news'
  | 'initiative'
  | 'campaign'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  excerpt: string
  slug: string
  date?: string
  image?: string
}

export interface GroupedSearchResults {
  projects: SearchResult[]
  publications: SearchResult[]
  news: SearchResult[]
  initiatives: SearchResult[]
}

// ─── Page metadata ──────────────────────────────────────────────────────────────
export interface PageMeta {
  title: string
  description: string
  ogImage?: string
  canonicalPath: string
  alternates?: {
    ar: string
    en: string
  }
}

// ─── API Response wrapper ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  meta?: {
    total?: number
    page?: number
    perPage?: number
  }
  error?: string
}
