import type { Partner } from '@/types'
import { partnerStaticLogo } from '@/lib/partnerLogos'

export const partnersData: Partner[] = [
  {
    id: 'usaid',
    name: {
      en: 'The United States Agency for International Development (USAID)',
      ar: 'الوكالة الأمريكية للتنمية الدولية (USAID)',
    },
    description: {
      en: 'Strategic donor supporting governance, civil society, and sustainable development programs in Jordan.',
      ar: 'جهة مانحة استراتيجية تدعم برامج الحوكمة والمجتمع المدني والتنمية المستدامة في الأردن.',
    },
    logo: partnerStaticLogo('usaid'),
    website: 'https://www.usaid.gov',
    category: 'donor',
  },
  {
    id: 'european-union',
    name: {
      en: 'European Union',
      ar: 'الاتحاد الأوروبي',
    },
    description: {
      en: 'Key strategic partner supporting citizenship, democracy, and digital rights programs.',
      ar: 'شريك استراتيجي رئيسي في دعم برامج المواطنة والديمقراطية والحقوق الرقمية.',
    },
    logo: partnerStaticLogo('european-union'),
    website: 'https://eeas.europa.eu/delegations/jordan',
    category: 'international-partner',
  },
  {
    id: 'aecid',
    name: {
      en: 'Spanish Agency for International Development (AECID)',
      ar: 'الوكالة الإسبانية للتنمية الدولية (AECID)',
    },
    description: {
      en: 'International development partner supporting democratic governance and social inclusion initiatives.',
      ar: 'شريك تنمية دولي يدعم مبادرات الحوكمة الديمقراطية والشمول الاجتماعي.',
    },
    logo: partnerStaticLogo('aecid'),
    website: 'https://www.aecid.es',
    category: 'donor',
  },
  {
    id: 'international-republican-institute',
    name: {
      en: 'International Republican Institute',
      ar: 'المعهد الجمهوري الدولي',
    },
    description: {
      en: 'Partner in democracy, elections, and civic participation programs.',
      ar: 'شريك في برامج الديمقراطية والانتخابات والمشاركة المدنية.',
    },
    logo: partnerStaticLogo('international-republican-institute'),
    website: 'https://www.iri.org',
    category: 'international-partner',
  },
  {
    id: 'british-embassy-jordan',
    name: {
      en: 'The British Embassy in Jordan',
      ar: 'السفارة البريطانية في الأردن',
    },
    description: {
      en: 'Diplomatic partner supporting democratic values, human rights, and civil society in Jordan.',
      ar: 'شريك دبلوماسي يدعم قيم الديمقراطية وحقوق الإنسان والمجتمع المدني في الأردن.',
    },
    logo: partnerStaticLogo('british-embassy-jordan', 'svg'),
    website: 'https://www.gov.uk/world/organisations/british-embassy-amman',
    category: 'international-partner',
  },
  {
    id: 'mercy-corps-jordan',
    name: {
      en: 'Mercy Corps Jordan',
      ar: 'ميرسي كوربس الأردن',
    },
    description: {
      en: 'Partner in humanitarian response, youth empowerment, and community resilience programs.',
      ar: 'شريك في الاستجابة الإنسانية وتمكين الشباب وبرامج تماسك المجتمع.',
    },
    logo: partnerStaticLogo('mercy-corps-jordan'),
    website: 'https://www.mercycorps.org/countries/jordan',
    category: 'international-partner',
  },
  {
    id: 'swiss-embassy-jordan',
    name: {
      en: 'The Swiss Embassy in Jordan',
      ar: 'السفارة السويسرية في الأردن',
    },
    description: {
      en: 'Diplomatic partner supporting development cooperation and civic engagement.',
      ar: 'شريك دبلوماسي يدعم التعاون الإنمائي والمشاركة المدنية.',
    },
    logo: partnerStaticLogo('swiss-embassy-jordan', 'svg'),
    website: 'https://www.eda.admin.ch/amman',
    category: 'international-partner',
  },
  {
    id: 'kafd',
    name: {
      en: 'King Abdullah II Fund for Development (KAFD)',
      ar: 'صندوق الملك عبد الله الثاني للتنمية (KAFD)',
    },
    description: {
      en: 'National development fund supporting youth, innovation, and sustainable community projects.',
      ar: 'صندوق تنمية وطني يدعم الشباب والابتكار ومشاريع التنمية المجتمعية المستدامة.',
    },
    logo: partnerStaticLogo('kafd'),
    website: 'https://www.kafd.jo',
    category: 'donor',
  },
  {
    id: 'irex',
    name: {
      en: 'International Research and Exchanges Board (IREX)',
      ar: 'مجلس التبادل والبحوث الدولي (IREX)',
    },
    description: {
      en: 'Partner in media development, civic education, and digital inclusion programs.',
      ar: 'شريك في برامج تنمية الإعلام والتربية المدنية والشمول الرقمي.',
    },
    logo: partnerStaticLogo('irex', 'jpg'),
    website: 'https://www.irex.org',
    category: 'international-partner',
  },
]
