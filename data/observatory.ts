import type { ObservatoryStats, ObservatoryReport } from '@/types'

export const observatoryStats: ObservatoryStats = {
  totalCases: 5847,
  hateSpeeachCases: 3621,
  digitalViolenceCases: 2226,
  platformDistribution: [
    { platform: 'Facebook', count: 2410 },
    { platform: 'X (Twitter)', count: 1520 },
    { platform: 'Instagram', count: 890 },
    { platform: 'TikTok', count: 640 },
    { platform: 'YouTube', count: 387 },
  ],
  genderDistribution: [
    { gender: 'female', count: 3204, label: { ar: 'إناث', en: 'Female' } },
    { gender: 'male', count: 1890, label: { ar: 'ذكور', en: 'Male' } },
    { gender: 'other', count: 753, label: { ar: 'أخرى', en: 'Other' } },
  ],
  governorateDistribution: [
    { governorate: 'Amman', count: 2100, label: { ar: 'عمّان', en: 'Amman' } },
    { governorate: 'Irbid', count: 980, label: { ar: 'إربد', en: 'Irbid' } },
    { governorate: 'Zarqa', count: 820, label: { ar: 'الزرقاء', en: 'Zarqa' } },
    { governorate: 'Aqaba', count: 450, label: { ar: 'العقبة', en: 'Aqaba' } },
    { governorate: 'Mafraq', count: 380, label: { ar: 'المفرق', en: 'Mafraq' } },
    { governorate: 'Other', count: 1117, label: { ar: 'أخرى', en: 'Other' } },
  ],
  monthlyTrend: [
    { month: '2024-01', cases: 380, hateSpeech: 230, digitalViolence: 150 },
    { month: '2024-02', cases: 420, hateSpeech: 260, digitalViolence: 160 },
    { month: '2024-03', cases: 510, hateSpeech: 310, digitalViolence: 200 },
    { month: '2024-04', cases: 490, hateSpeech: 300, digitalViolence: 190 },
    { month: '2024-05', cases: 550, hateSpeech: 340, digitalViolence: 210 },
    { month: '2024-06', cases: 480, hateSpeech: 290, digitalViolence: 190 },
    { month: '2024-07', cases: 520, hateSpeech: 320, digitalViolence: 200 },
    { month: '2024-08', cases: 460, hateSpeech: 280, digitalViolence: 180 },
    { month: '2024-09', cases: 530, hateSpeech: 330, digitalViolence: 200 },
    { month: '2024-10', cases: 570, hateSpeech: 350, digitalViolence: 220 },
    { month: '2024-11', cases: 610, hateSpeech: 380, digitalViolence: 230 },
    { month: '2024-12', cases: 590, hateSpeech: 365, digitalViolence: 225 },
  ],
}

export const observatoryReports: ObservatoryReport[] = [
  {
    id: 'or-1',
    slug: 'observatory-q4-2024',
    title: {
      ar: 'تقرير المرصد الرقمي - الربع الرابع 2024',
      en: 'Digital Observatory Report - Q4 2024',
    },
    summary: {
      ar: 'رصد وتوثيق حالات خطاب الكراهية والعنف الرقمي خلال الربع الأخير من عام 2024، مع تحليل الأنماط والتوجهات وأبرز التوصيات.',
      en: 'Monitoring and documenting hate speech and digital violence cases during Q4 2024, with trend analysis and key recommendations.',
    },
    publishDate: '2025-01-25',
    coverImage: 'https://picsum.photos/seed/or1/400/560',
    pdfUrl: '/pdfs/observatory-q4-2024.pdf',
  },
  {
    id: 'or-2',
    slug: 'observatory-q3-2024',
    title: {
      ar: 'تقرير المرصد الرقمي - الربع الثالث 2024',
      en: 'Digital Observatory Report - Q3 2024',
    },
    summary: {
      ar: 'تحليل شامل للفترة الممتدة من يوليو إلى سبتمبر 2024، يرصد أنماط خطاب الكراهية الرقمي وتوزيعها الجغرافي والنوعي.',
      en: 'Comprehensive analysis for July–September 2024, monitoring digital hate speech patterns and their geographic and gender distribution.',
    },
    publishDate: '2024-10-20',
    coverImage: 'https://picsum.photos/seed/or2/400/560',
    pdfUrl: '/pdfs/observatory-q3-2024.pdf',
  },
  {
    id: 'or-3',
    slug: 'observatory-annual-2023',
    title: {
      ar: 'التقرير السنوي للمرصد الرقمي 2023',
      en: 'Digital Observatory Annual Report 2023',
    },
    summary: {
      ar: 'التقرير السنوي الكامل للمرصد الرقمي لعام 2023 يغطي جميع حالات خطاب الكراهية والعنف الرقمي الموثقة مع تحليل متعمق للأسباب والتوصيات.',
      en: 'The complete annual report of the Digital Observatory for 2023, covering all documented hate speech and digital violence cases with in-depth cause analysis and recommendations.',
    },
    publishDate: '2024-01-30',
    coverImage: 'https://picsum.photos/seed/or3/400/560',
    pdfUrl: '/pdfs/observatory-annual-2023.pdf',
  },
]
