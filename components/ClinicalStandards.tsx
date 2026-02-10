import React from 'react';
import { Shield, Lock, Award, Briefcase } from 'lucide-react';
import FadeIn from './FadeIn';
import { Language } from '../types';

const TEXTS = {
  en: [
    { title: "Mastery", text: "Practitioners trained in the lineage of healing, holding modern board certifications." },
    { title: "Purity", text: "A strict vow of sterility. Every instrument is single-use, as pure as the intention behind it." },
    { title: "Sanctuary", text: "Private chambers where silence is honored and privacy is absolute." },
    { title: "Order", text: "Seamless scheduling that respects your time, flowing like water." }
  ],
  fr: [
    { title: "Maîtrise", text: "Praticiens formés dans la lignée de la guérison, certifiés par des conseils modernes." },
    { title: "Pureté", text: "Vœu strict de stérilité. Chaque instrument est à usage unique." },
    { title: "Sanctuaire", text: "Chambres privées où le silence est honoré et l'intimité absolue." },
    { title: "Ordre", text: "Planification fluide qui respecte votre temps." }
  ],
  ar: [
    { title: "الإتقان", text: "ممارسون مدربون في سلالة الشفاء، يحملون شهادات حديثة." },
    { title: "النقاء", text: "عهد صارم بالعقامة. كل أداة تستخدم لمرة واحدة." },
    { title: "الملاذ", text: "غرف خاصة حيث يُحترم الصمت وتكون الخصوصية مطلقة." },
    { title: "النظام", text: "جدولة سلسة تحترم وقتك، تتدفق كالماء." }
  ],
  es: [
    { title: "Maestría", text: "Profesionales capacitados en el linaje de curación, con certificaciones modernas." },
    { title: "Pureza", text: "Voto estricto de esterilidad. Cada instrumento es de un solo uso." },
    { title: "Santuario", text: "Cámaras privadas donde se honra el silencio y la privacidad es absoluta." },
    { title: "Orden", text: "Programación perfecta que respeta su tiempo." }
  ]
};

const StandardCard: React.FC<{ icon: React.ReactNode, title: string, text: string, delay: number }> = ({ icon, title, text, delay }) => (
  <FadeIn delay={delay} direction="up">
    <div className="h-full flex flex-col items-center text-center group">
      <div className="w-20 h-20 mb-6 relative flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-seal rounded-lg transform rotate-45 group-hover:rotate-0 transition-transform duration-700 bg-paper"></div>
        <div className="absolute inset-2 border border-seal rounded-lg transform -rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
        <div className="relative z-10 text-seal group-hover:text-ink transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-serif text-ink mb-3 tracking-wide font-bold">{title}</h3>
      <div className="w-8 h-[2px] bg-seal mb-4 mx-auto"></div>
      <p className="text-ink text-sm font-serif leading-relaxed max-w-xs font-medium">
        {text}
      </p>
    </div>
  </FadeIn>
);

const ClinicalStandards: React.FC<{ language: Language }> = ({ language }) => {
  const content = TEXTS[language];
  const icons = [
    <Award strokeWidth={1.5} size={32} />,
    <Shield strokeWidth={1.5} size={32} />,
    <Lock strokeWidth={1.5} size={32} />,
    <Briefcase strokeWidth={1.5} size={32} />
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
      {content.map((item, idx) => (
        <StandardCard 
          key={idx}
          delay={idx * 150}
          icon={icons[idx]}
          title={item.title}
          text={item.text}
        />
      ))}
    </div>
  );
};

export default ClinicalStandards;