import { ServiceData, FAQData } from '../types';

export const DEFAULT_SERVICES: ServiceData[] = [
  {
    id: 'dry-cupping-targeted',
    title: { en: 'Dry Cupping (Targeted)', fr: 'Ventouses Sèches (Ciblées)', ar: 'الحجامة الجافة (موضعية)', es: 'Ventosas Secas (Localizada)' },
    description: {
      en: 'Non-invasive suction therapy for circulation, pain relief & relaxation.',
      fr: 'Thérapie non invasive pour la circulation, le soulagement de la douleur et la détente.',
      ar: 'علاج بالشفط غير جراحي لتشيط الدورة الدموية وتخفيف الألم والاسترخاء.',
      es: 'Terapia de succión no invasiva para la circulación, el alivio del dolor y la relajación.'
    },
    price: '$75',
    duration: '30 Mins',
    benefits: {
      en: ['Circulation', 'Pain Relief'],
      fr: ['Circulation', 'Soulagement'],
      ar: ['دورة دموية', 'تخفيف الألم'],
      es: ['Circulación', 'Alivio']
    }
  },
  {
    id: 'dry-cupping-full',
    title: { en: 'Dry Cupping (Full)', fr: 'Ventouses Sèches (Complète)', ar: 'الحجامة الجافة (كاملة)', es: 'Ventosas Secas (Completa)' },
    description: {
      en: 'Full session. Non-invasive suction therapy for circulation, pain relief & relaxation.',
      fr: 'Séance complète. Thérapie non invasive pour la circulation, le soulagement de la douleur et la détente.',
      ar: 'جلسة كاملة. علاج بالشفط لتنشيط الدورة الدموية وتخفيف الألم.',
      es: 'Sesión completa. Terapia de succión no invasiva.'
    },
    price: '$95',
    duration: '45-60 Mins',
    benefits: {
      en: ['Relaxation', 'Full Body'],
      fr: ['Détente', 'Corps Complet'],
      ar: ['استرخاء', 'الجسم كامل'],
      es: ['Relajación', 'Cuerpo Completo']
    }
  },
  {
    id: 'wet-cupping-standard',
    title: { en: 'Wet Cupping (Standard)', fr: 'Hijama (Standard)', ar: 'الحجامة الرطبة (قياسية)', es: 'Hijama (Estándar)' },
    description: {
      en: 'Traditional detoxification therapy performed with sterile technique.',
      fr: 'Thérapie traditionnelle de détoxification avec technique stérile.',
      ar: 'علاج تقليدي للتخلص من السموم يتم بتقنية معقمة.',
      es: 'Terapia de desintoxicación tradicional realizada con técnica estéril.'
    },
    price: '$130',
    duration: '45-60 Mins',
    recommended: true,
    benefits: {
      en: ['Detox', 'Sterile'],
      fr: ['Détox', 'Stérile'],
      ar: ['تخلص من السموم', 'معقم'],
      es: ['Desintoxicación', 'Estéril']
    }
  },
  {
    id: 'wet-cupping-extended',
    title: { en: 'Wet Cupping (Extended)', fr: 'Hijama (Complète)', ar: 'الحجامة الرطبة (مكثفة)', es: 'Hijama (Extendida)' },
    description: {
      en: 'Extended session for comprehensive care and detoxification.',
      fr: 'Séance prolongée pour des soins complets et une détoxification.',
      ar: 'جلسة مطولة لرعاية شاملة وتخلص من السموم.',
      es: 'Sesión extendida para cuidado integral y desintoxicación.'
    },
    price: '$155',
    duration: '60-75 Mins',
    benefits: {
      en: ['Deep Cleanse', 'Comprehensive'],
      fr: ['Nettoyage Profond', 'Complet'],
      ar: ['تنظيف عميق', 'شامل'],
      es: ['Limpieza Profunda', 'Integral']
    }
  },
  {
    id: 'cupping-massage-45',
    title: { en: 'Cupping Massage (45m)', fr: 'Massage avec Ventouses (45m)', ar: 'تدليك الحجامة (٤٥د)', es: 'Masaje con Ventosas (45m)' },
    description: {
      en: 'Massage combined with moving cups.',
      fr: 'Massage combiné avec ventouses mobiles.',
      ar: 'تدليك مدمج مع كؤوس متحركة.',
      es: 'Masaje combinado con copas móviles.'
    },
    price: '$105',
    duration: '45 Mins',
    benefits: {
      en: ['Circulation', 'Muscle Relief'],
      fr: ['Circulation', 'Soulagement'],
      ar: ['دورة دموية', 'راحة العضلات'],
      es: ['Circulación', 'Alivio Muscular']
    }
  },
  {
    id: 'cupping-massage-60',
    title: { en: 'Cupping Massage (60m)', fr: 'Massage avec Ventouses (60m)', ar: 'تدليك الحجامة (٦٠د)', es: 'Masaje con Ventosas (60m)' },
    description: {
      en: 'Extended massage combined with moving cups.',
      fr: 'Massage prolongé combiné avec ventouses mobiles.',
      ar: 'تدليك مطول مدمج مع كؤوس متحركة.',
      es: 'Masaje extendido combinado con copas móviles.'
    },
    price: '$135',
    duration: '60 Mins',
    benefits: {
      en: ['Deep Tissue', 'Relaxation'],
      fr: ['Tissus Profonds', 'Détente'],
      ar: ['أنسجة عميقة', 'استرخاء'],
      es: ['Tejido Profundo', 'Relajación']
    }
  },
  {
    id: 'sunnah-cupping',
    title: { en: 'Sunnah Cupping', fr: 'Hijama selon la Sunnah', ar: 'حجامة السنة', es: 'Hijama Sunnah' },
    description: {
      en: 'Performed according to prophetic tradition (dates & points).',
      fr: 'Effectuée selon la tradition prophétique (jours & points).',
      ar: 'تُجرى وفقاً للتقاليد النبوية (الأيام والنقاط).',
      es: 'Realizada según la tradición profética (días y puntos).'
    },
    price: '$135',
    duration: '60 Mins',
    benefits: {
      en: ['Prophetic', 'Spiritual'],
      fr: ['Prophétique', 'Spirituel'],
      ar: ['نبوي', 'روحي'],
      es: ['Profético', 'Espiritual']
    }
  },
  {
    id: 'sports-cupping',
    title: { en: 'Sports Cupping', fr: 'Ventouses Sportives', ar: 'حجامة الرياضيين', es: 'Ventosas Deportivas' },
    description: {
      en: 'For athletes, recovery & performance.',
      fr: 'Pour les athlètes, la récupération et la performance.',
      ar: 'للرياضيين، للتعافي والأداء.',
      es: 'Para atletas, recuperación y rendimiento.'
    },
    price: '$115',
    duration: '45-60 Mins',
    benefits: {
      en: ['Recovery', 'Performance'],
      fr: ['Récupération', 'Performance'],
      ar: ['تعافي', 'أداء'],
      es: ['Recuperación', 'Rendimiento']
    }
  },
  {
    id: 'new-muslim-cupping',
    title: { en: 'New Muslim Cupping', fr: 'Hijama Nouveaux Musulmans', ar: 'حجامة المسلمين الجدد', es: 'Hijama Nuevos Musulmanes' },
    description: {
      en: 'Gentle introduction with explanation and care.',
      fr: 'Introduction douce avec explications et accompagnement.',
      ar: 'مقدمة لطيفة مع الشرح والرعاية.',
      es: 'Introducción suave con explicación y cuidado.'
    },
    price: '$95',
    duration: '45 Mins',
    benefits: {
      en: ['Educational', 'Welcoming'],
      fr: ['Éducatif', 'Accueillant'],
      ar: ['تعليمي', 'ترحيب'],
      es: ['Educativo', 'Acogedor']
    }
  },
  {
    id: 'therapeutic-cupping',
    title: { en: 'Therapeutic Cupping', fr: 'Ventouses Thérapeutiques', ar: 'الحجامة العلاجية', es: 'Ventosas Terapéuticas' },
    description: {
      en: 'Supportive, gentle, customized care for illness/chronic conditions.',
      fr: 'Soins doux, adaptés et de soutien pour maladies/conditions chroniques.',
      ar: 'رعاية داعمة ولطيفة ومخصصة للأمراض/الحالات المزمنة.',
      es: 'Cuidado de apoyo, suave y personalizado para enfermedades/condiciones crónicas.'
    },
    price: '$125',
    duration: '60 Mins',
    benefits: {
      en: ['Chronic Care', 'Gentle'],
      fr: ['Soins Chroniques', 'Doux'],
      ar: ['رعاية مزمنة', 'لطيف'],
      es: ['Cuidado Crónico', 'Suave']
    }
  },
  {
    id: 'couples-cupping',
    title: { en: 'Couples Cupping', fr: 'Hijama pour Couples', ar: 'حجامة الأزواج', es: 'Hijama para Parejas' },
    description: {
      en: 'Simultaneous sessions for two people in a private setting.',
      fr: 'Séances simultanées pour deux personnes dans un cadre privé.',
      ar: 'جلسات متزامنة لشخصين في مكان خاص.',
      es: 'Sesiones simultáneas para dos personas en un entorno privado.'
    },
    price: '$240',
    duration: '60 Mins',
    benefits: {
      en: ['Simultaneous', 'Discounted'],
      fr: ['Simultané', 'Réduit'],
      ar: ['متزامن', 'خصم'],
      es: ['Simultáneo', 'Descuento']
    }
  }
];

export const DEFAULT_FAQS: FAQData[] = [
  {
    id: '1',
    question: {
      en: "Is Hijama painful?",
      fr: "La Hijama est-elle douloureuse ?",
      ar: "هل الحجامة مؤلمة؟",
      es: "¿Es dolorosa la Hijama?"
    },
    answer: {
      en: "Most patients describe the sensation as a light scratching or pinching. The cups themselves feel like a tight massage.",
      fr: "La plupart décrivent une sensation de légère griffure. Les ventouses ressemblent à un massage ferme.",
      ar: "يصف معظم المرضى الإحساس بأنه خدش خفيف. الكؤوس نفسها تشبه التدليك القوي.",
      es: "La mayoría describe la sensación como un ligero rasguño. Las ventosas se sienten como un masaje firme."
    }
  },
  {
    id: '2',
    question: {
      en: "How long do the marks last?",
      fr: "Combien de temps durent les marques ?",
      ar: "كم تستمر العلامات؟",
      es: "¿Cuánto duran las marcas?"
    },
    answer: {
      en: "The circular marks typically fade within 3 to 10 days, depending on your body's circulation.",
      fr: "Les marques circulaires s'estompent généralement en 3 à 10 jours.",
      ar: "تتلاشى العلامات الدائرية عادةً خلال 3 إلى 10 أيام.",
      es: "Las marcas circulares generalmente desaparecen en 3 a 10 días."
    }
  },
  {
    id: '3',
    question: {
      en: "Can I eat before the session?",
      fr: "Puis-je manger avant ?",
      ar: "هل يمكنني الأكل قبل الجلسة؟",
      es: "¿Puedo comer antes?"
    },
    answer: {
      en: "It is Sunnah and medically recommended to have an empty stomach for at least 2-3 hours before Hijama.",
      fr: "Il est recommandé (Sunnah) d'être à jeun depuis au moins 2-3 heures.",
      ar: "من السنة ويوصى طبياً بأن تكون المعدة فارغة لمدة 2-3 ساعات على الأقل.",
      es: "Es Sunnah y médicamente recomendable tener el estómago vacío por al menos 2-3 horas."
    }
  },
  {
    id: '4',
    question: {
      en: "Is it safe?",
      fr: "Est-ce sûr ?",
      ar: "هل هي آمنة؟",
      es: "¿Es seguro?"
    },
    answer: {
      en: "Yes. We strictly follow a single-use policy for all cups and blades. Our practitioners are certified.",
      fr: "Oui. Nous suivons strictement une politique à usage unique pour tout le matériel.",
      ar: "نعم. نتبع سياسة الاستخدام الواحد بصرامة لجميع الكؤوس والشفرات.",
      es: "Sí. Seguimos estrictamente una política de un solo uso para todo el equipo."
    }
  }
];