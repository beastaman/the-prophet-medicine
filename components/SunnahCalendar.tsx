import React, { useMemo } from 'react';
import moment from 'moment-hijri';
import FadeIn from './FadeIn';
import { Language } from '../types';

// --- Configuration & Constants ---

const TEXTS = {
  en: {
    whiteDays: "The Sunnah Days",
    title: "Celestial Alignment",
    desc: "The Prophet ﷺ recommended performing Hijama on the 17th, 19th, and 21st of the lunar month, when the gravitational pull is balanced and the body's tides are primed for release.",
    lunar: "Hijri"
  },
  fr: {
    whiteDays: "Les Jours Sunna",
    title: "Alignement Céleste",
    desc: "Le Prophète ﷺ a recommandé la Hijama les 17ème, 19ème et 21ème jours du mois lunaire, lorsque l'attraction gravitationnelle est équilibrée.",
    lunar: "Hégire"
  },
  ar: {
    whiteDays: "أيام السنة",
    title: "التوافق السماوي",
    desc: "أوصى النبي ﷺ بالحجامة في الأيام 17 و 19 و 21 من الشهر القمري، حيث تكون قوى الجاذبية متوازنة وسوائل الجسم مهيأة للخروج.",
    lunar: "هجري"
  },
  es: {
    whiteDays: "Los Días Sunnah",
    title: "Alineación Celestial",
    desc: "El Profeta ﷺ recomendó realizar Hijama los días 17, 19 y 21 del mes lunar, cuando la atracción gravitacional está equilibrada.",
    lunar: "Hégira"
  }
};

// --- Helper Logic for Hijama Dates ---

interface HijamaDate {
  gregorian: string;
  hijri: string;
  hijriMonth: string;
  day: string;
}

const getUpcomingHijamaDates = (lang: string): HijamaDate[] => {
  // Set locale
  const localeMap: Record<string, string> = { en: 'en', fr: 'fr', ar: 'ar-sa', es: 'es' };
  moment.locale(localeMap[lang] || 'en');

  // Get current Hijri date info
  const now = moment();
  const currentHijriDay = parseInt(now.format('iD'), 10);
  const currentHijriMonth = parseInt(now.format('iM'), 10);
  const currentHijriYear = parseInt(now.format('iYYYY'), 10);

  // Always show the current Hijri month's sunnah dates
  const targetYear = currentHijriYear;
  const targetMonth = currentHijriMonth;

  const sunnahDays = [17, 19, 21];

  // Intl locale for Gregorian formatting
  const intlLocale = { en: 'en-US', fr: 'fr-FR', ar: 'ar-SA', es: 'es-ES' }[lang] || 'en-US';

  return sunnahDays.map(day => {
    // ✅ FIX: Parse a Hijri date string directly instead of mutating an existing moment
    const hijriMoment = moment(`${targetYear}/${targetMonth}/${day}`, 'iYYYY/iM/iD');

    const jsDate = hijriMoment.toDate();

    // Get the Hijri month name for display
    const hijriMonthName = hijriMoment.format('iMMMM');

    // Format Hijri day with proper suffix for English
    let hijriFormatted = `${day}`;
    if (lang === 'en') {
      if (day === 17 || day === 19) hijriFormatted = `${day}th`;
      else if (day === 21) hijriFormatted = `${day}st`;
    }

    return {
      gregorian: jsDate.toLocaleDateString(intlLocale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      hijri: hijriFormatted,
      hijriMonth: hijriMonthName,
      day: jsDate.toLocaleDateString(intlLocale, { weekday: 'long' }),
    };
  });
};

// --- Visual Component (Moon) ---

const RealisticMoon = () => (
  <div className="relative w-64 h-64 md:w-80 md:h-80 transition-transform duration-[20s] ease-linear hover:scale-105">
    {/* Glow */}
    <div className="absolute inset-0 rounded-full bg-white opacity-5 blur-3xl animate-pulse-slow"></div>

    {/* The Moon Body */}
    <div className="w-full h-full rounded-full bg-[#E6E6E6] relative overflow-hidden shadow-[inset_-20px_-10px_60px_rgba(0,0,0,0.9)]">
      {/* Textures / Craters */}
      <div className="absolute top-[20%] left-[30%] w-[15%] h-[15%] rounded-full bg-[#D1D1D1] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)] opacity-60"></div>
      <div className="absolute top-[50%] left-[60%] w-[25%] h-[25%] rounded-full bg-[#C4C4C4] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3)] opacity-50"></div>
      <div className="absolute bottom-[20%] left-[25%] w-[10%] h-[10%] rounded-full bg-[#D9D9D9] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.4)] opacity-70"></div>
      <div className="absolute top-[10%] left-[55%] w-[8%] h-[8%] rounded-full bg-[#CECECE] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)] opacity-60"></div>

      {/* Terminator / Shadow */}
      <div className="absolute top-0 right-0 w-full h-full rounded-full bg-black opacity-60 blur-xl transform translate-x-[40%]"></div>

      {/* Surface Noise */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  </div>
);

// --- Main Component ---

const SunnahCalendar: React.FC<{ language: Language }> = ({ language }) => {
  const t = TEXTS[language];

  // Recalculate dates when language changes
  const upcomingDays = useMemo(() => getUpcomingHijamaDates(language), [language]);

  // Get Hijri month name from first date for the header
  const hijriMonthName = upcomingDays[0]?.hijriMonth ?? '';

  return (
    <div className="w-full bg-[#0a0a0a] text-paper rounded-sm p-8 md:p-16 relative overflow-hidden shadow-2xl border-4 border-double border-white/5 group">
      {/* Stars Background */}
      <div className="absolute inset-0 opacity-40">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-24">
        {/* Text Content */}
        <FadeIn
          direction={language === 'ar' ? 'left' : 'right'}
          className={`flex-1 ${language === 'ar' ? 'lg:text-right' : 'lg:text-left'} text-center`}
        >
          <div
            className={`flex items-center gap-3 mb-6 justify-center ${
              language === 'ar' ? 'lg:justify-end' : 'lg:justify-start'
            }`}
          >
            <div className="w-8 h-[1px] bg-seal"></div>
            <span className="text-seal text-xs uppercase tracking-[0.25em] font-bold">
              {t.whiteDays}
            </span>
          </div>

          <h3 className="font-display text-5xl md:text-6xl text-white mb-4 leading-tight">
            {t.title}
          </h3>

          {/* Show the current Hijri month name */}
          {hijriMonthName && (
            <p className="text-seal/80 text-sm font-serif italic mb-8 tracking-wide">
              {hijriMonthName}
            </p>
          )}

          <p className="text-white/60 font-serif italic text-xl max-w-lg leading-loose mb-12 mx-auto lg:mx-0">
            {t.desc}
          </p>

          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            {upcomingDays.map((date, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 text-center min-w-[110px] hover:border-seal transition-all duration-300 relative group/card rounded-sm"
              >
                <div className="absolute inset-0 bg-seal opacity-0 group-hover/card:opacity-5 transition-opacity duration-300"></div>

                {/* Day Name */}
                <div className="text-seal text-[9px] uppercase mb-2 font-bold tracking-widest">
                  {date.day}
                </div>

                {/* Gregorian Date */}
                <div className="font-display text-2xl text-white mb-1">{date.gregorian}</div>

                {/* Hijri Date */}
                <div className="text-[10px] text-white/40 font-serif italic">
                  {t.lunar} {date.hijri}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Visual Content */}
        <FadeIn delay={200} className="relative">
          <RealisticMoon />
        </FadeIn>
      </div>
    </div>
  );
};

export default SunnahCalendar;