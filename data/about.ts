import type { AboutSection } from '@/types'

export const aboutData: AboutSection = {
  intro: {
    ar: 'مركز We Rise للمواطنة والتنمية منظمة مدنية أردنية غير حكومية وغير ربحية، تأسست في مارس 2018 في عمّان. يعمل المركز على تعزيز المشاركة المدنية الفاعلة، ودعم قيم الديمقراطية وحقوق الإنسان في المجتمع الأردني، من خلال برامج التدريب والتوعية والمناصرة والأبحاث التطبيقية.',
    en: 'We Rise Center for Citizenship and Development is a Jordanian non-governmental, non-profit civil society organization, founded in March 2018 in Amman. The Center works to promote active civic participation, support democracy, and uphold human rights in Jordanian society through training, awareness, advocacy, and applied research programs.',
  },
  vision: {
    ar: 'مجتمع أردني يتمتع بمواطنة فاعلة، ديمقراطية راسخة، وحقوق إنسان مصونة.',
    en: 'A Jordanian society with active citizenship, rooted democracy, and protected human rights.',
  },
  mission: {
    ar: 'توفير بيئة داعمة لتطوير قدرات المجتمع المدني والمواطنين، وتعزيز ثقافة المشاركة الديمقراطية والمساءلة، ومناهضة خطاب الكراهية والعنف الرقمي، وتمكين الفئات المهمشة للمساهمة الفاعلة في صناعة القرار.',
    en: 'To provide a supportive environment for developing civil society and citizen capacities, promote democratic participation and accountability culture, counter hate speech and digital violence, and empower marginalized groups for effective decision-making participation.',
  },
  values: [
    {
      id: 'citizenship',
      title: { ar: 'المواطنة الفاعلة', en: 'Active Citizenship' },
      description: { ar: 'نؤمن بحق كل مواطن في المشاركة الفاعلة في صنع القرار وبناء مجتمعه.', en: 'We believe in every citizen\'s right to actively participate in decision-making and community building.' },
      icon: 'users',
    },
    {
      id: 'integrity',
      title: { ar: 'النزاهة والشفافية', en: 'Integrity & Transparency' },
      description: { ar: 'نلتزم بأعلى معايير الشفافية والمساءلة في جميع أعمالنا وشراكاتنا.', en: 'We are committed to the highest standards of transparency and accountability in all our work and partnerships.' },
      icon: 'shield',
    },
    {
      id: 'inclusion',
      title: { ar: 'الشمول والتنوع', en: 'Inclusion & Diversity' },
      description: { ar: 'نحتفي بالتنوع ونسعى لضمان تمثيل جميع الفئات وإدماجها في برامجنا.', en: 'We celebrate diversity and strive to ensure representation of all groups in our programs.' },
      icon: 'heart',
    },
    {
      id: 'innovation',
      title: { ar: 'الابتكار', en: 'Innovation' },
      description: { ar: 'نبحث دائمًا عن حلول مبتكرة وأدوات رقمية حديثة لتحقيق أثر مستدام.', en: 'We always seek innovative solutions and modern digital tools to achieve sustainable impact.' },
      icon: 'lightbulb',
    },
    {
      id: 'partnership',
      title: { ar: 'الشراكة', en: 'Partnership' },
      description: { ar: 'نبني علاقات شراكة حقيقية وفاعلة مع المؤسسات المحلية والدولية.', en: 'We build genuine and effective partnerships with local and international institutions.' },
      icon: 'handshake',
    },
    {
      id: 'rights',
      title: { ar: 'حقوق الإنسان', en: 'Human Rights' },
      description: { ar: 'حقوق الإنسان هي المرجعية الأساسية لجميع أعمالنا وتدخلاتنا البرامجية.', en: 'Human rights are the fundamental reference for all our work and programmatic interventions.' },
      icon: 'scale',
    },
  ],
  workAreas: [
    {
      id: 'citizenship',
      title: { ar: 'المواطنة الفاعلة والديمقراطية', en: 'Active Citizenship & Democracy' },
      description: { ar: 'تعزيز المشاركة المدنية وثقافة الانتخابات والحوكمة الرشيدة.', en: 'Promoting civic participation, election culture, and good governance.' },
      icon: 'vote',
    },
    {
      id: 'human-rights',
      title: { ar: 'حقوق الإنسان', en: 'Human Rights' },
      description: { ar: 'الدفاع عن حقوق الإنسان ومناهضة التمييز وتقديم التقارير الرقابية.', en: 'Defending human rights, countering discrimination, and producing monitoring reports.' },
      icon: 'shield',
    },
    {
      id: 'digital-rights',
      title: { ar: 'الحقوق الرقمية', en: 'Digital Rights' },
      description: { ar: 'رصد خطاب الكراهية والعنف الرقمي وتعزيز حرية التعبير الرقمية.', en: 'Monitoring hate speech and digital violence while promoting digital freedom of expression.' },
      icon: 'monitor',
    },
    {
      id: 'gender',
      title: { ar: 'النوع الاجتماعي', en: 'Gender' },
      description: { ar: 'دمج منظور النوع الاجتماعي في جميع البرامج وتمكين المرأة سياسيًا واجتماعيًا.', en: 'Mainstreaming gender perspectives across all programs and empowering women politically and socially.' },
      icon: 'users',
    },
    {
      id: 'cohesion',
      title: { ar: 'التماسك الاجتماعي', en: 'Social Cohesion' },
      description: { ar: 'تعزيز قيم العيش المشترك والتسامح والانتماء الوطني بين مختلف فئات المجتمع.', en: 'Promoting coexistence, tolerance, and national belonging among diverse community groups.' },
      icon: 'heart',
    },
    {
      id: 'accountability',
      title: { ar: 'المساءلة والشفافية', en: 'Accountability & Transparency' },
      description: { ar: 'دعم آليات الرقابة المجتمعية ومساءلة المؤسسات العامة.', en: 'Supporting community oversight mechanisms and holding public institutions accountable.' },
      icon: 'eye',
    },
  ],
  history: [
    { year: '2018', event: { ar: 'تأسيس المركز في مارس 2018 في عمّان', en: 'Center founded in March 2018 in Amman' } },
    { year: '2019', event: { ar: 'إطلاق أول برنامج لمناهضة خطاب الكراهية الرقمي', en: 'Launch of first digital hate speech monitoring program' } },
    { year: '2020', event: { ar: 'توسيع العمل ليشمل 8 محافظات أردنية خلال جائحة كوفيد-19', en: 'Expanded operations to 8 governorates during COVID-19 pandemic' } },
    { year: '2021', event: { ar: 'إطلاق منصة الانتخابات الإلكترونية بالتزامن مع انتخابات مجالس المحافظات', en: 'Launch of e-election platform coinciding with governorate council elections' } },
    { year: '2022', event: { ar: 'تأسيس المرصد الرقمي لرصد خطاب الكراهية والعنف الرقمي', en: 'Establishment of Digital Observatory for hate speech and digital violence monitoring' } },
    { year: '2023', event: { ar: 'الوصول إلى أكثر من 50,000 مستفيد مباشر وشراكات مع 30 مؤسسة دولية', en: 'Reaching over 50,000 direct beneficiaries and partnerships with 30 international institutions' } },
    { year: '2024', event: { ar: 'إطلاق التقرير السنوي الشامل للحقوق الرقمية في الأردن', en: 'Launch of comprehensive annual digital rights report in Jordan' } },
    { year: '2025', event: { ar: 'التوسع في العمل الإقليمي وإطلاق شبكة منظمات المجتمع المدني العربي', en: 'Regional expansion and launch of Arab civil society network' } },
  ],
  achievements: [
    { id: '1', title: { ar: 'مشروع منفَّذ', en: 'Projects Implemented' }, value: '47+' },
    { id: '2', title: { ar: 'مستفيد مباشر', en: 'Direct Beneficiaries' }, value: '85,000+' },
    { id: '3', title: { ar: 'منشور وتقرير', en: 'Publications & Reports' }, value: '62+' },
    { id: '4', title: { ar: 'شريك محلي ودولي', en: 'Partners' }, value: '38+' },
    { id: '5', title: { ar: 'محافظة أردنية', en: 'Governorates Covered' }, value: '12' },
    { id: '6', title: { ar: 'برنامج تدريبي', en: 'Training Programs' }, value: '120+' },
  ],
}
