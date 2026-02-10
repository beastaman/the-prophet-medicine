import React from 'react';
import FadeIn from './FadeIn';
import { Language } from '../types';

const TEXTS = {
  en: {
    steps: [
      { kanji: "壱", title: "Diagnosis", desc: "A reading of the pulse and energetic pathways, identifying the unseen stagnation within." },
      { kanji: "弐", title: "Cupping", desc: "The application of vacuum vessels on sacred points, drawing out impurities like ink from water." },
      { kanji: "参", title: "Restoration", desc: "Anointing with black seed oil to seal the vitality and restore balance to the humors." }
    ]
  },
  fr: {
    steps: [
      { kanji: "壱", title: "Diagnostic", desc: "Une lecture du pouls et des voies énergétiques, identifiant la stagnation invisible." },
      { kanji: "弐", title: "Ventouses", desc: "L'application de vaisseaux sous vide sur les points sacrés, extrayant les impuretés comme l'encre de l'eau." },
      { kanji: "参", title: "Restauration", desc: "Onction à l'huile de nigelle pour sceller la vitalité et rétablir l'équilibre des humeurs." }
    ]
  },
  ar: {
    steps: [
      { kanji: "١", title: "التشخيص", desc: "قراءة النبض ومسارات الطاقة لتحديد الركود غير المرئي." },
      { kanji: "٢", title: "الحجامة", desc: "وضع الكؤوس على النقاط المقدسة لاستخراج الشوائب كما يستخرج الحبر من الماء." },
      { kanji: "٣", title: "الترميم", desc: "الدهن بزيت الحبة السوداء لختم الحيوية واستعادة توازن الأخلاط." }
    ]
  },
  es: {
    steps: [
      { kanji: "I", title: "Diagnóstico", desc: "Una lectura del pulso y las vías energéticas, identificando el estancamiento invisible." },
      { kanji: "II", title: "Ventosas", desc: "La aplicación de vasos de vacío en puntos sagrados, extrayendo impurezas." },
      { kanji: "III", title: "Restauración", desc: "Unción con aceite de semilla negra para sellar la vitalidad y restaurar el equilibrio." }
    ]
  }
};

const ProcessTimeline: React.FC<{ language: Language }> = ({ language }) => {
  const t = TEXTS[language];
  return (
    <div className="relative py-12">
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-ink/30 to-transparent -translate-x-1/2"></div>
      
      <div className="flex flex-col gap-24">
        {t.steps.map((step, idx) => (
          <FadeIn key={idx} delay={idx * 200} direction="up">
            <div className={`flex flex-col md:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`flex-1 text-center ${idx % 2 !== 0 ? (language === 'ar' ? 'md:text-right' : 'md:text-left') : (language === 'ar' ? 'md:text-left' : 'md:text-right')}`}>
                <h3 className="text-3xl font-serif text-ink mb-3 tracking-wide">{step.title}</h3>
                <p className="text-ink/80 font-serif italic leading-relaxed max-w-xs mx-auto md:mx-0 inline-block text-lg">
                  {step.desc}
                </p>
              </div>

              <div className="relative z-10">
                <div className="absolute inset-[-10px] bg-paper-light rounded-full blur-md"></div>
                <div className="relative w-16 h-16 rounded-full border-2 border-seal bg-paper flex items-center justify-center shadow-[0_5px_15px_rgba(139,30,30,0.15)] group transition-all duration-500 hover:scale-110 hover:shadow-[0_10px_25px_rgba(139,30,30,0.25)] cursor-default">
                  <div className="absolute inset-1 border border-seal rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110"></div>
                  <span className="font-serif text-2xl text-seal font-bold group-hover:text-ink transition-colors duration-500">
                    {step.kanji}
                  </span>
                </div>
              </div>

              <div className="flex-1"></div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default ProcessTimeline;