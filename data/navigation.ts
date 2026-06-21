import type { NavItem } from '@/types'

export const navigationItems: NavItem[] = [
  {
    label: { ar: 'الرئيسية', en: 'Home' },
    href: '/',
    description: { ar: 'الصفحة الرئيسية لمركز We Rise', en: 'Welcome to We Rise Center' },
  },
  {
    label: { ar: 'من نحن', en: 'About Us' },
    href: '/about',
    description: { ar: 'تعرّف على رؤيتنا ومهمتنا وقيمنا وفريق عملنا', en: 'Learn about our vision, mission, values and team' },
    children: [
      { label: { ar: 'التعريف والرؤية', en: 'Introduction & Vision' }, href: '/about', description: { ar: 'من نحن وما الذي نسعى إليه', en: 'Who we are and what we strive for' } },
      { label: { ar: 'الفريق والحوكمة', en: 'Team & Governance' }, href: '/team-governance', description: { ar: 'فريقنا وهياكل الحوكمة', en: 'Our team and governance structures' } },
    ],
  },
  {
    label: { ar: 'البرامج والمشاريع', en: 'Programs & Projects' },
    href: '/programs-projects',
    description: { ar: 'مشاريعنا الميدانية في مجالات المواطنة والديمقراطية وحقوق الإنسان', en: 'Field projects in citizenship, democracy and human rights' },
  },
  {
    label: { ar: 'المبادرات والحملات', en: 'Initiatives & Campaigns' },
    href: '/initiatives-campaigns',
    description: { ar: 'مبادراتنا الوطنية وحملاتنا الرقمية للتوعية والمناصرة', en: 'National initiatives and digital campaigns for awareness and advocacy' },
  },
  {
    label: { ar: 'المنشورات والتقارير', en: 'Publications & Reports' },
    href: '/publications-reports',
    description: { ar: 'تقارير وأبحاث وأوراق سياسات في مجالات عملنا', en: 'Reports, research and policy papers in our areas of work' },
  },
  {
    label: { ar: 'المرصد الرقمي', en: 'Digital Observatory' },
    href: '/digital-observatory',
    description: { ar: 'رصد وتوثيق خطاب الكراهية والعنف الرقمي عبر الإنترنت', en: 'Monitoring and documenting hate speech and digital violence online' },
  },
  {
    label: { ar: 'منصة الانتخابات', en: 'E-Election Platform' },
    href: '/e-election-platform',
    description: { ar: 'منصة رقمية لإجراء انتخابات شفافة وموثوقة', en: 'Digital platform for transparent and reliable elections' },
  },
  {
    label: { ar: 'المركز الإعلامي', en: 'Media Center' },
    href: '/media-center',
    description: { ar: 'آخر أخبارنا وبياناتنا الصحفية وتغطياتنا للفعاليات', en: 'Latest news, press releases and event coverage' },
  },
  {
    label: { ar: 'الشركاء والداعمون', en: 'Partners & Supporters' },
    href: '/partners-supporters',
    description: { ar: 'شركاؤنا المحليون والدوليون والجهات الداعمة لعملنا', en: 'Our local and international partners and supporting organizations' },
  },
  {
    label: { ar: 'انضم إلينا', en: 'Join Us' },
    href: '/join-us',
    description: { ar: 'قدّم طلبك للتطوع أو التدريب أو الشراكة مع مركز We Rise', en: 'Apply to volunteer, intern, or collaborate with We Rise Center' },
  },
  {
    label: { ar: 'اتصل بنا', en: 'Contact Us' },
    href: '/contact',
    description: { ar: 'تواصل معنا لأي استفسار أو شراكة أو دعم', en: 'Reach out for inquiries, partnerships or support' },
  },
]

export const footerLinks = {
  about: {
    label: { ar: 'عن المركز', en: 'About Center' },
    items: [
      { label: { ar: 'من نحن', en: 'About Us' }, href: '/about' },
      { label: { ar: 'رؤيتنا ورسالتنا', en: 'Vision & Mission' }, href: '/about#mission' },
      { label: { ar: 'الفريق والحوكمة', en: 'Team & Governance' }, href: '/team-governance' },
      { label: { ar: 'الشركاء والداعمون', en: 'Partners' }, href: '/partners-supporters' },
    ],
  },
  programs: {
    label: { ar: 'البرامج', en: 'Programs' },
    items: [
      { label: { ar: 'البرامج والمشاريع', en: 'Programs & Projects' }, href: '/programs-projects' },
      { label: { ar: 'المبادرات والحملات', en: 'Initiatives' }, href: '/initiatives-campaigns' },
      { label: { ar: 'المرصد الرقمي', en: 'Digital Observatory' }, href: '/digital-observatory' },
      { label: { ar: 'منصة الانتخابات', en: 'E-Elections' }, href: '/e-election-platform' },
    ],
  },
  resources: {
    label: { ar: 'الموارد', en: 'Resources' },
    items: [
      { label: { ar: 'المنشورات والتقارير', en: 'Publications' }, href: '/publications-reports' },
      { label: { ar: 'المركز الإعلامي', en: 'Media Center' }, href: '/media-center' },
      { label: { ar: 'البحث', en: 'Search' }, href: '/search' },
      { label: { ar: 'خريطة الموقع', en: 'Sitemap' }, href: '/sitemap.xml' },
    ],
  },
  contact: {
    label: { ar: 'تواصل معنا', en: 'Contact' },
    items: [
      { label: { ar: 'انضم إلينا', en: 'Join Us' }, href: '/join-us' },
      { label: { ar: 'اتصل بنا', en: 'Contact Us' }, href: '/contact' },
      { label: { ar: 'اشترك في النشرة', en: 'Newsletter' }, href: '/contact#newsletter' },
    ],
  },
}
