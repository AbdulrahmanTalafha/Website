import type { Initiative } from '@/types'

export const initiativesData: Initiative[] = [
  {
    id: 'i-1',
    slug: 'digital-rights-are-rights',
    title: { ar: 'حقوقنا الرقمية حقوق إنسانية', en: 'Digital Rights Are Human Rights' },
    shortDescription: {
      ar: 'حملة رقمية لرفع الوعي بالحقوق الرقمية وخطاب الكراهية الإلكتروني في الأردن.',
      en: 'A digital campaign to raise awareness of digital rights and online hate speech in Jordan.',
    },
    description: {
      ar: 'في عصر تتشابك فيه الحياة الرقمية مع حقوق الإنسان، أطلقت منظمة نحن ننهض حملة "حقوقنا الرقمية حقوق إنسانية" لتسليط الضوء على الانتهاكات الرقمية المتصاعدة في الأردن. تستهدف الحملة الشباب والناشطين والصحفيين وعموم المواطنين، وتسعى إلى بناء وعي مجتمعي راسخ بالحقوق الرقمية المكفولة قانونًا، وتزويد الأفراد بأدوات فعلية لحماية أنفسهم في الفضاء الإلكتروني.',
      en: 'In an era where digital life intertwines with human rights, We Rise launched the "Digital Rights Are Human Rights" campaign to spotlight the rising digital violations in Jordan. The campaign targets youth, activists, journalists, and citizens at large, aiming to build a solid societal awareness of legally guaranteed digital rights and equip individuals with practical tools to protect themselves online.',
    },
    objective: {
      ar: 'تعزيز وعي المواطنين بحقوقهم الرقمية وكيفية الإبلاغ عن الانتهاكات الرقمية وحماية أنفسهم على الإنترنت.',
      en: 'To raise citizens\' awareness of their digital rights and how to report digital violations and protect themselves online.',
    },
    outputs: [
      { ar: 'إنتاج 20 مقطع توعوي تفاعلي للتوزيع على منصات التواصل', en: 'Producing 20 interactive awareness videos for distribution on social platforms' },
      { ar: 'إطلاق حشد رقمي بمشاركة أكثر من 50,000 متفاعل', en: 'Launching a digital mobilization with over 50,000 participants' },
      { ar: 'تنظيم 5 جلسات حوارية افتراضية مع خبراء', en: 'Organizing 5 virtual dialogue sessions with experts' },
    ],
    category: 'digital-campaign',
    images: ['https://picsum.photos/seed/i1a/800/500', 'https://picsum.photos/seed/i1b/800/500'],
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    featuredImage: 'https://picsum.photos/seed/i1-feat/800/500',
    relatedProject: 'p-2',
    startDate: '2024-03-01',
    endDate: '2024-05-31',
  },
  {
    id: 'i-2',
    slug: 'vote-your-right',
    title: { ar: 'صوِّت.. حقك', en: 'Vote.. It\'s Your Right' },
    shortDescription: {
      ar: 'حملة مناصرة لتشجيع المشاركة الانتخابية وتعزيز ثقافة التصويت الواعي في الانتخابات البلدية والبرلمانية.',
      en: 'An advocacy campaign to encourage electoral participation and promote a culture of informed voting in municipal and parliamentary elections.',
    },
    description: {
      ar: 'انطلقت حملة "صوِّت.. حقك" في سياق انتخابي بالغ الأهمية، إذ تشهد الأردن جملة من الإصلاحات السياسية والانتخابية. تعمل الحملة على تحفيز المواطنين—ولا سيما الشباب والمرأة—على المشاركة الفاعلة في العملية الديمقراطية، وتزويدهم بالمعلومات الكافية عن آليات التسجيل والاقتراع وتأثير أصواتهم على مسار القرار المحلي والوطني.',
      en: 'The "Vote.. It\'s Your Right" campaign launched in a critically important electoral context, as Jordan undergoes significant political and electoral reforms. The campaign motivates citizens—especially youth and women—to actively participate in the democratic process, providing them with sufficient information about registration and voting mechanisms, and the impact of their votes on local and national decision-making.',
    },
    objective: {
      ar: 'رفع نسبة المشاركة الانتخابية بين الشباب والمرأة وتعزيز وعيهم بأهمية التصويت وآليات الانتخابات.',
      en: 'To increase electoral participation rates among youth and women and raise their awareness of the importance of voting and election mechanisms.',
    },
    outputs: [
      { ar: 'تنظيم 50 جلسة توعوية في 12 محافظة', en: 'Organizing 50 awareness sessions in 12 governorates' },
      { ar: 'إنتاج مواد إعلامية متنوعة باللغتين العربية والإنجليزية', en: 'Producing diverse media materials in Arabic and English' },
      { ar: 'الوصول إلى 100,000 مواطن عبر المنصات الرقمية', en: 'Reaching 100,000 citizens through digital platforms' },
    ],
    category: 'advocacy-campaign',
    images: ['https://picsum.photos/seed/i2a/800/500', 'https://picsum.photos/seed/i2b/800/500'],
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    featuredImage: 'https://picsum.photos/seed/i2-feat/800/500',
    startDate: '2024-07-01',
    endDate: '2024-10-31',
  },
  {
    id: 'i-3',
    slug: 'youth-governance-initiative',
    title: { ar: 'مبادرة الشباب للحوكمة', en: 'Youth Governance Initiative' },
    shortDescription: {
      ar: 'مبادرة شبابية لبناء قدرات الشباب في مجال الحوكمة المحلية والمشاركة في مجالس البلديات والمحافظات.',
      en: 'A youth initiative to build capacities in local governance and participation in municipal and governorate councils.',
    },
    description: {
      ar: 'تنبع مبادرة الشباب للحوكمة من إيمان راسخ بأن الشباب ليسوا مستقبل التغيير فحسب، بل هم صانعوه الآن. تعمل المبادرة على سد الفجوة بين الشباب ومؤسسات الحكم المحلي من خلال برامج تدريبية متخصصة وشراكات فاعلة مع المجالس البلدية، بهدف خلق جيل قيادي قادر على تمثيل مجتمعاته والتأثير في قراراتها.',
      en: 'The Youth Governance Initiative stems from a firm belief that youth are not just the future of change—they are its makers today. The initiative works to bridge the gap between youth and local governance institutions through specialized training programs and active partnerships with municipal councils, aiming to create a leadership generation capable of representing their communities and influencing their decisions.',
    },
    objective: {
      ar: 'تأهيل كوادر شبابية لتولي أدوار قيادية في الحكم المحلي ومجالس البلديات والمجالس التشريعية.',
      en: 'To qualify youth cadres to assume leadership roles in local governance, municipal councils, and legislative councils.',
    },
    outputs: [
      { ar: 'تدريب 200 شاب وشابة على أسس الحوكمة المحلية', en: 'Training 200 young men and women on local governance foundations' },
      { ar: 'تأسيس 10 نوادٍ للمواطنة في الجامعات الأردنية', en: 'Establishing 10 citizenship clubs in Jordanian universities' },
      { ar: 'ترشيح 15 شابًا لمناصب في مجالس بلدية', en: 'Nominating 15 youth for positions in municipal councils' },
    ],
    category: 'initiative',
    images: ['https://picsum.photos/seed/i3a/800/500'],
    featuredImage: 'https://picsum.photos/seed/i3-feat/800/500',
    relatedProject: 'p-1',
    startDate: '2023-09-01',
  },
  {
    id: 'i-4',
    slug: 'stop-hate-speech-awareness',
    title: { ar: 'أوقفوا خطاب الكراهية', en: 'Stop Hate Speech' },
    shortDescription: {
      ar: 'حملة توعوية لمكافحة خطاب الكراهية والتنمر الإلكتروني وتعزيز ثقافة الاحترام والحوار على الإنترنت.',
      en: 'An awareness campaign to combat hate speech and cyberbullying and promote a culture of respect and dialogue online.',
    },
    description: {
      ar: 'تُعدّ ظاهرة خطاب الكراهية والتنمر الإلكتروني من أبرز التحديات التي تواجه المجتمعات الرقمية اليوم. جاءت حملة "أوقفوا خطاب الكراهية" ردًا مباشرًا على تصاعد هذه الظاهرة في الفضاء الرقمي الأردني، وتسعى إلى تغيير الأنماط السلوكية عبر الإنترنت، وتمكين الأفراد من التعرف على خطاب الكراهية والتصدي له، وبناء مجتمع رقمي قائم على الاحترام المتبادل والحوار البنّاء.',
      en: 'Hate speech and cyberbullying are among the most prominent challenges facing digital communities today. The "Stop Hate Speech" campaign came as a direct response to the escalation of this phenomenon in the Jordanian digital space. It seeks to change online behavioral patterns, empower individuals to recognize and counter hate speech, and build a digital community based on mutual respect and constructive dialogue.',
    },
    objective: {
      ar: 'نشر ثقافة الحوار الإيجابي على الإنترنت ومكافحة التنمر الإلكتروني وخطاب الكراهية بين مختلف فئات المجتمع.',
      en: 'To spread a culture of positive online dialogue and combat cyberbullying and hate speech among various community groups.',
    },
    outputs: [
      { ar: 'إنتاج 30 مواد توعوية إبداعية', en: 'Producing 30 creative awareness materials' },
      { ar: 'تنظيم مسابقة للطلاب حول مناهضة خطاب الكراهية', en: 'Organizing a student competition on countering hate speech' },
      { ar: 'الوصول إلى 200,000 شخص عبر وسائل التواصل الاجتماعي', en: 'Reaching 200,000 people via social media' },
    ],
    category: 'awareness-campaign',
    images: ['https://picsum.photos/seed/i4a/800/500'],
    featuredImage: 'https://picsum.photos/seed/i4-feat/800/500',
    relatedProject: 'p-2',
    startDate: '2024-11-01',
    endDate: '2025-01-31',
  },
]
