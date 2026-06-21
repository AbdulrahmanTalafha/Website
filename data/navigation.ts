import type { NavItem } from '@/types'

export const navigationItems: NavItem[] = [
  {
    label: { ar: 'الرئيسية', en: 'Home' },
    href: '/',
    description: { ar: 'الصفحة الرئيسية لمركز We Rise', en: 'Welcome to We Rise Center' },
  },
  {
    label: { ar: 'عن المركز', en: 'About the Center' },
    href: '/about',
    description: { ar: 'تعرّف على رؤيتنا ورسالتنا وفريقنا وحوكمتنا وشركائنا', en: 'Learn about our vision, mission, team, governance and partners' },
    children: [
      {
        label: { ar: 'من نحن (الرؤية، الرسالة، القيم)', en: 'Who We Are (Vision, Mission, Values)' },
        href: '/about#who-we-are',
        description: { ar: 'هويتنا ورؤيتنا ورسالتنا وقيمنا الأساسية', en: 'Our identity, vision, mission and core values' },
      },
      {
        label: { ar: 'فريق العمل', en: 'Our Team' },
        href: '/team-governance#team',
        description: { ar: 'تعرّف على فريق مركز We Rise', en: 'Meet the We Rise team' },
      },
      {
        label: { ar: 'الحوكمة والشفافية', en: 'Governance & Transparency' },
        href: '/team-governance#governance',
        description: { ar: 'هياكل الحوكمة والالتزام بالشفافية', en: 'Governance structures and transparency commitments' },
      },
      {
        label: { ar: 'الشركاء والداعمون', en: 'Partners & Supporters' },
        href: '/partners-supporters',
        description: { ar: 'شركاؤنا المحليون والدوليون', en: 'Our local and international partners' },
      },
    ],
  },
  {
    label: { ar: 'البرامج', en: 'Programs' },
    href: '/programs-projects',
    description: { ar: 'برامجنا ومشاريعنا ومبادراتنا', en: 'Our programs, projects and initiatives' },
    children: [
      {
        label: { ar: 'البرامج والمشاريع', en: 'Programs & Projects' },
        href: '/programs-projects',
        description: { ar: 'مشاريعنا الميدانية في مجالات المواطنة والديمقراطية وحقوق الإنسان', en: 'Field projects in citizenship, democracy and human rights' },
      },
      {
        label: { ar: 'المبادرات والحملات', en: 'Initiatives & Campaigns' },
        href: '/initiatives-campaigns',
        description: { ar: 'مبادراتنا الوطنية وحملاتنا الرقمية للتوعية والمناصرة', en: 'National initiatives and digital advocacy campaigns' },
      },
    ],
  },
  {
    label: { ar: 'المرصد الرقمي', en: 'Digital Observatory' },
    href: '/digital-observatory',
    description: { ar: 'رصد وتوثيق خطاب الكراهية والعنف الرقمي عبر الإنترنت', en: 'Monitoring hate speech and digital violence online' },
    children: [
      {
        label: { ar: 'عن المرصد', en: 'About the Observatory' },
        href: '/digital-observatory#about',
        description: { ar: 'أهداف المرصد ودوره ومنهجيته', en: 'Goals, role and methodology of the observatory' },
      },
      {
        label: { ar: 'التقارير الدورية', en: 'Periodic Reports' },
        href: '/digital-observatory#reports',
        description: { ar: 'تقارير المرصد وتحليلاته المنشورة', en: 'Published observatory reports and analyses' },
      },
      {
        label: { ar: 'لوحات البيانات', en: 'Dashboards' },
        href: '/digital-observatory#dashboards',
        description: { ar: 'لوحات بيانات تفاعلية ورسوم بيانية', en: 'Interactive data dashboards and visualizations' },
      },
      {
        label: { ar: 'أدوات ومنهجيات الرصد', en: 'Monitoring Tools & Methodology' },
        href: '/digital-observatory#methodology',
        description: { ar: 'أدوات ومنهجيات رصد المحتوى الرقمي', en: 'Tools and methodologies for digital monitoring' },
      },
    ],
  },
  {
    label: { ar: 'منصة الانتخابات', en: 'Election Platform' },
    href: '/e-election-platform',
    description: { ar: 'انتخابات إلكترونية شفافة وآمنة', en: 'Transparent and secure electronic elections' },
    children: [
      {
        label: { ar: 'عن المنصة', en: 'About the Platform' },
        href: '/e-election-platform#about',
        description: { ar: 'كيف تعمل منصة الانتخابات', en: 'How the election platform works' },
      },
      {
        label: { ar: 'الترشح والتصويت', en: 'Nominations & Voting' },
        href: '/e-election-platform#voting',
        description: { ar: 'الانتخابات الجارية والتصويت', en: 'Active elections and voting' },
      },
      {
        label: { ar: 'النتائج', en: 'Results' },
        href: '/e-election-platform#results',
        description: { ar: 'نتائج الانتخابات المكتملة', en: 'Completed election results' },
      },
      {
        label: { ar: 'الأسئلة الشائعة', en: 'FAQ' },
        href: '/e-election-platform#faq',
        description: { ar: 'الأسئلة الشائعة حول المنصة', en: 'Frequently asked questions' },
      },
    ],
  },
  {
    label: { ar: 'المزيد', en: 'More' },
    href: '/publications-reports',
    description: { ar: 'الإصدارات والموارد الإعلامية', en: 'Publications and media resources' },
    children: [
      {
        label: { ar: 'الإصدارات', en: 'Publications' },
        href: '/publications-reports',
        description: { ar: 'تقارير وأبحاث وأوراق سياسات', en: 'Reports, research and policy papers' },
      },
      {
        label: { ar: 'المركز الإعلامي', en: 'Media Center' },
        href: '/media-center',
        description: { ar: 'أخبارنا وبياناتنا الصحفية وتغطياتنا', en: 'News, press releases and event coverage' },
      },
    ],
  },
  {
    label: { ar: 'تواصل معنا', en: 'Contact Us' },
    href: '/contact',
    description: { ar: 'تواصل معنا لأي استفسار أو شراكة أو دعم', en: 'Reach out for inquiries, partnerships or support' },
  },
]

export const footerLinks = {
  about: {
    label: { ar: 'عن المركز', en: 'About Center' },
    items: [
      { label: { ar: 'من نحن', en: 'Who We Are' }, href: '/about#who-we-are' },
      { label: { ar: 'فريق العمل', en: 'Our Team' }, href: '/team-governance#team' },
      { label: { ar: 'الحوكمة والشفافية', en: 'Governance' }, href: '/team-governance#governance' },
      { label: { ar: 'الشركاء والداعمون', en: 'Partners' }, href: '/partners-supporters' },
    ],
  },
  programs: {
    label: { ar: 'البرامج', en: 'Programs' },
    items: [
      { label: { ar: 'البرامج والمشاريع', en: 'Programs & Projects' }, href: '/programs-projects' },
      { label: { ar: 'المبادرات والحملات', en: 'Initiatives' }, href: '/initiatives-campaigns' },
      { label: { ar: 'المرصد الرقمي', en: 'Digital Observatory' }, href: '/digital-observatory' },
      { label: { ar: 'منصة الانتخابات', en: 'Election Platform' }, href: '/e-election-platform' },
    ],
  },
  resources: {
    label: { ar: 'الموارد', en: 'Resources' },
    items: [
      { label: { ar: 'الإصدارات', en: 'Publications' }, href: '/publications-reports' },
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
