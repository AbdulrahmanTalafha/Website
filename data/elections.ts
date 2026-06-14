import type { Election } from '@/types'

export const electionsData: Election[] = [
  {
    id: 'el-1',
    slug: 'university-student-council-2025',
    title: {
      ar: 'انتخابات مجالس طلبة الجامعات الأردنية 2025',
      en: 'Jordanian University Student Councils Elections 2025',
    },
    description: {
      ar: 'انتخابات مجالس طلبة الجامعات الأردنية لعام 2025 عبر منصة We Rise الإلكترونية، تجربة انتخابية شفافة وموثوقة للطلاب في جميع أنحاء الأردن.',
      en: 'Jordanian university student council elections 2025 via the We Rise electronic platform, providing a transparent and reliable electoral experience for students across Jordan.',
    },
    startDate: '2025-04-20',
    endDate: '2025-04-25',
    status: 'completed',
    totalVoters: 85000,
    totalCandidates: 620,
    organization: { ar: 'وزارة التعليم العالي الأردنية', en: 'Jordanian Ministry of Higher Education' },
    type: { ar: 'انتخابات طلابية', en: 'Student Elections' },
    image: 'https://picsum.photos/seed/el1/800/500',
  },
  {
    id: 'el-2',
    slug: 'ngo-board-elections-2025',
    title: {
      ar: 'انتخابات مجالس إدارة المنظمات غير الحكومية 2025',
      en: 'NGO Board of Directors Elections 2025',
    },
    description: {
      ar: 'دعم وتسهيل انتخابات مجالس إدارة المنظمات المدنية الأردنية بشكل رقمي شفاف وآمن.',
      en: 'Supporting and facilitating Jordanian civil organizations\' board elections in a transparent and secure digital manner.',
    },
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    status: 'completed',
    totalCandidates: 145,
    organization: { ar: 'مجلس منظمات المجتمع المدني الأردني', en: 'Jordanian Civil Society Organizations Council' },
    type: { ar: 'انتخابات إدارية', en: 'Administrative Elections' },
    image: 'https://picsum.photos/seed/el2/800/500',
  },
  {
    id: 'el-3',
    slug: 'municipal-youth-representation-2024',
    title: {
      ar: 'مبادرة تمثيل الشباب في مجالس البلديات 2024',
      en: 'Youth Representation in Municipal Councils Initiative 2024',
    },
    description: {
      ar: 'انتخابات إلكترونية لاختيار ممثلين للشباب في مجالس بلديات المدن الأردنية الكبرى ضمن مبادرة تمكين الشباب.',
      en: 'Electronic elections to select youth representatives in major Jordanian city municipal councils under the youth empowerment initiative.',
    },
    startDate: '2024-09-15',
    endDate: '2024-09-20',
    status: 'completed',
    totalVoters: 42000,
    totalCandidates: 280,
    organization: { ar: 'وزارة الشؤون البلدية الأردنية', en: 'Jordanian Ministry of Municipal Affairs' },
    type: { ar: 'انتخابات بلدية', en: 'Municipal Elections' },
    image: 'https://picsum.photos/seed/el3/800/500',
  },
]
