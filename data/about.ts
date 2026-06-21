import type { AboutSection } from '@/types'

export const aboutData: AboutSection = {
  intro: {
    ar: 'مركز We Rise للمواطنة والتنمية منظمة مدنية أردنية غير حكومية وغير ربحية، تأسست في مارس 2018 في عمّان. يعمل المركز على تعزيز المشاركة المدنية الفاعلة، ودعم قيم الديمقراطية وحقوق الإنسان في المجتمع الأردني، من خلال برامج التدريب والتوعية والمناصرة والأبحاث التطبيقية.',
    en: 'We Rise Center for Citizenship and Development is a Jordanian non-governmental, non-profit civil society organization, founded in March 2018 in Amman. The Center works to promote active civic participation, support democracy, and uphold human rights in Jordanian society through training, awareness, advocacy, and applied research programs.',
  },
  vision: {
    ar: 'نسعى إلى بناء دولة المواطنة الفاعلة القائمة على مبادئ الديمقراطية وسيادة القانون، وتعزيز مجتمعات متماسكة يتمتع فيها جميع الأفراد بالقدرة على المشاركة المؤثرة في الحياة العامة وصناعة القرار.',
    en: 'We seek to build an active citizenship state based on democracy and the rule of law, and to strengthen cohesive communities where all individuals can participate meaningfully in public life and decision-making.',
  },
  mission: {
    ar: 'يعمل مركز نحن ننهض على تمكين الشباب والنساء من قيادة التغيير المستدام، وتعزيز قدرتهم على التأثير في السياسات العامة وعمليات اتخاذ القرار، من خلال توفير مساحات آمنة وتشاركية تتيح لهم التعبير عن آرائهم، وتحديد احتياجاتهم، وتطوير حلول عملية للتحديات المجتمعية.',
    en: 'We Rise Center works to empower youth and women to lead sustainable change and influence public policy and decision-making, by providing safe and participatory spaces for expression, needs assessment, and practical solutions to community challenges.',
  },
  values: [
    {
      id: 'youth-leadership',
      title: { ar: 'قيادة الشباب', en: 'Youth Leadership' },
      description: { ar: 'نؤمن بأن الشباب ليسوا مجرد فئة مستهدفة، بل قوة فاعلة في قيادة التغيير الاجتماعي، وصناعة الإصلاح، ودفع مسارات التنمية في مجتمعاتهم.', en: 'We believe youth are not merely a target group, but an active force leading social change, reform, and development pathways in their communities.' },
      icon: 'users',
    },
    {
      id: 'women-empowerment',
      title: { ar: 'تمكين المرأة والمجتمع', en: 'Women & Community Empowerment' },
      description: { ar: 'نؤمن بأهمية العمل مع مختلف مكونات المجتمع، وتعزيز مشاركة النساء والفئات المجتمعية في أدوات المساءلة وصنع القرار، بما يضمن شمولية التغيير وعدالته.', en: 'We work with all community components and strengthen women and social groups\' participation in accountability and decision-making tools, ensuring inclusive and fair change.' },
      icon: 'heart',
    },
    {
      id: 'effective-dialogue',
      title: { ar: 'الحوار الفعّال', en: 'Effective Dialogue' },
      description: { ar: 'نؤمن بأن الديمقراطية تُبنى من خلال الحوار القائم على الفهم المتبادل، والمشاركة الإيجابية، والثقة، والاحترام، باعتبارها أساساً لأي عملية تغيير مستدام.', en: 'We believe democracy is built through dialogue based on mutual understanding, positive participation, trust, and respect as the foundation of sustainable change.' },
      icon: 'handshake',
    },
    {
      id: 'responsible-citizenship',
      title: { ar: 'المواطنة المسؤولة', en: 'Responsible Citizenship' },
      description: { ar: 'نؤمن بأن التغيير الاجتماعي يبدأ من الفرد، ويصبح أكثر استدامة عندما يتحول إلى مسؤولية جماعية تُسهم في تشكيل مستقبل مشترك يقوم على العدالة والمساواة.', en: 'We believe social change begins with the individual and becomes more sustainable when it transforms into collective responsibility shaping a shared future of justice and equality.' },
      icon: 'shield',
    },
    {
      id: 'inclusion-access',
      title: { ar: 'الشمول وإتاحة الفرص', en: 'Inclusion & Equal Access' },
      description: { ar: 'نؤمن بحق جميع الأفراد، بما في ذلك الأشخاص ذوي الإعاقة، في المشاركة الكاملة والعادلة في الحياة العامة، ونلتزم بتعزيز بيئات دامجة تضمن الوصول المتكافئ إلى الفرص والموارد وعمليات صنع القرار دون تمييز.', en: 'We believe all individuals, including persons with disabilities, have the right to full and fair participation in public life, and we commit to inclusive environments with equal access to opportunities, resources, and decision-making.' },
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
