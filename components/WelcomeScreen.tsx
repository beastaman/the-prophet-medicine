import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { Language } from '../types';
import InkCursor from './InkCursor';

interface WelcomeScreenProps {
  onSelect: (gender: 'male' | 'female') => void;
  currentLanguage: Language;
  onLanguageSelect: (lang: Language) => void;
}

const TEXTS = {
  en: {
    question: "Whom are we serving today?",
    brother: "Brother",
    sister: "Sister",
    brotherSub: "Traditional Healing",
    sisterSub: "Gentle Care",
    footer: "Select your path to enter the sanctuary"
  },
  fr: {
    question: "Qui servons-nous aujourd'hui ?",
    brother: "Frère",
    sister: "Sœur",
    brotherSub: "Guérison Traditionnelle",
    sisterSub: "Soins Doux",
    footer: "Choisissez votre voie pour entrer dans le sanctuaire"
  },
  ar: {
    question: "من نخدم اليوم؟",
    brother: "أخ",
    sister: "أخت",
    brotherSub: "العلاج التقليدي",
    sisterSub: "رعاية لطيفة",
    footer: "اختر طريقك لدخول الملاذ"
  },
  es: {
    question: "¿A quién servimos hoy?",
    brother: "Hermano",
    sister: "Hermana",
    brotherSub: "Curación Tradicional",
    sisterSub: "Cuidado Suave",
    footer: "Selecciona tu camino para entrar al santuario"
  }
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelect, currentLanguage, onLanguageSelect }) => {
  const [isExiting, setIsExiting] = useState(false);
  const t = TEXTS[currentLanguage];

  const handleSelect = (gender: 'male' | 'female') => {
    setIsExiting(true);
    setTimeout(() => {
      onSelect(gender);
    }, 900);
  };

  const LangButton = ({ lang, label }: { lang: Language, label: string }) => (
    <button
      onClick={() => onLanguageSelect(lang)}
      className={`px-4 py-2 text-sm font-sans uppercase tracking-widest transition-all duration-300 ${
        currentLanguage === lang 
          ? 'text-ink border-b-2 border-ink font-bold' 
          : 'text-ink/40 hover:text-ink/80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className={`fixed inset-0 z-[100] bg-paper flex flex-col items-center justify-center p-6 transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <InkCursor />
      
      {/* Language Selector */}
      <div className="absolute top-8 right-8 flex gap-2 z-50 flex-wrap justify-end">
        <LangButton lang="en" label="English" />
        <LangButton lang="fr" label="Français" />
        <div className="w-[1px] h-4 bg-ink/20 mx-2 self-center hidden md:block"></div>
        <LangButton lang="ar" label="العربية" />
        <LangButton lang="es" label="Español" />
      </div>

      <div className="max-w-4xl w-full text-center">
        
        <FadeIn direction="up" delay={100}>
          <div className="mb-12">
            {/* Logo Image Removed, text only */}
            <h1 className="font-display text-5xl md:text-7xl text-ink mb-6">The Prophet's Medicine</h1>
            <p className={`font-serif italic text-2xl text-ink ${currentLanguage === 'ar' ? 'font-serif' : ''}`}>{t.question}</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-2xl mx-auto">
          
          <FadeIn direction={currentLanguage === 'ar' ? 'left' : 'right'} delay={300}>
            <button 
              onClick={() => handleSelect('male')}
              className="w-full group relative h-[300px] border-2 border-[#8B1E1E] flex flex-col items-center justify-center overflow-hidden hover:bg-[#8B1E1E]/5 transition-all duration-700"
            >
              <div className="w-24 h-24 border-2 border-[#8B1E1E] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 bg-paper relative z-10">
                <span className="font-serif text-3xl text-[#8B1E1E]">M</span>
              </div>
              <h3 className="font-display text-3xl text-ink mb-2 group-hover:text-[#8B1E1E] transition-colors relative z-10">{t.brother}</h3>
              <p className="font-serif italic text-[#8B1E1E] text-sm font-bold relative z-10">{t.brotherSub}</p>
              <div className="absolute inset-0 bg-[#8B1E1E] opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
            </button>
          </FadeIn>

          <FadeIn direction={currentLanguage === 'ar' ? 'right' : 'left'} delay={500}>
            <button 
              onClick={() => handleSelect('female')}
              className="w-full group relative h-[300px] border-2 border-[#B04A6A] flex flex-col items-center justify-center overflow-hidden hover:bg-[#B04A6A]/5 transition-all duration-700"
            >
              <div className="w-24 h-24 border-2 border-[#B04A6A] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-700 bg-paper relative z-10">
                <span className="font-serif text-3xl text-[#B04A6A]">F</span>
              </div>
              <h3 className="font-display text-3xl text-ink mb-2 group-hover:text-[#B04A6A] transition-colors relative z-10">{t.sister}</h3>
              <p className="font-serif italic text-[#B04A6A] text-sm font-bold relative z-10">{t.sisterSub}</p>
              <div className="absolute inset-0 bg-[#B04A6A] opacity-0 group-hover:opacity-5 transition-opacity duration-700"></div>
            </button>
          </FadeIn>

        </div>

        <FadeIn delay={900}>
          <div className="mt-16 text-ink font-serif text-sm opacity-60">
            {t.footer}
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default WelcomeScreen;