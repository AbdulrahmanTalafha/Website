import type { StatItem, HeroData } from '@/types'

/** Intentional static fallback when CMS/API is unavailable — used by Hero and HomeStats. */
export const heroData: HeroData = {
  title: {
    ar: 'نبني مجتمعات واعية ومنتِجة',
    en: 'Building Informed and Empowered Communities',
  },
  subtitle: {
    ar: 'نعمل من أجل مواطنة فاعلة، ديمقراطية راسخة، وحقوق إنسان لا تُنتهك في الأردن',
    en: 'We work for active citizenship, rooted democracy, and inviolable human rights in Jordan',
  },
  ctaPrimary: { ar: 'اكتشف برامجنا', en: 'Explore Our Programs' },
  ctaSecondary: { ar: 'اقرأ تقاريرنا', en: 'View Our Reports' },
  imagePlaceholder: 'https://picsum.photos/seed/werise-hero/1400/700',
}

export const statsData: StatItem[] = [
  {
    id: 'projects',
    value: 47,
    suffix: '+',
    label: { ar: 'مشروع منفَّذ', en: 'Projects Implemented' },
    icon: 'folder',
  },
  {
    id: 'beneficiaries',
    value: 85000,
    suffix: '+',
    label: { ar: 'مستفيد مباشر', en: 'Direct Beneficiaries' },
    icon: 'users',
  },
  {
    id: 'publications',
    value: 62,
    suffix: '+',
    label: { ar: 'منشور وتقرير', en: 'Publications & Reports' },
    icon: 'book-open',
  },
  {
    id: 'governorates',
    value: 12,
    label: { ar: 'محافظة أردنية', en: 'Jordanian Governorates' },
    icon: 'map-pin',
  },
  {
    id: 'years',
    value: 7,
    suffix: '+',
    label: { ar: 'سنوات من العمل', en: 'Years of Service' },
    icon: 'calendar',
  },
  {
    id: 'partners',
    value: 38,
    suffix: '+',
    label: { ar: 'شريك محلي ودولي', en: 'Local & International Partners' },
    icon: 'handshake',
  },
]

export const homeData = {
  hero: heroData,
  stats: statsData,
}
