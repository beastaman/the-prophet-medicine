import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Droplet, Feather, HeartHandshake, Star, Activity, Users, Smile, Percent, ChevronDown
} from 'lucide-react';
import { db, collection, onSnapshot } from '../services/firebase';
import { ServiceData, FAQData, Language, ServiceItem } from '../types';
import { DEFAULT_SERVICES, DEFAULT_FAQS } from '../data/defaults';
import FadeIn from './FadeIn';
import BookingWizard from './BookingWizard';
import InkPattern from './InkPattern';
import ScrollProgress from './ScrollProgress';
import SunnahPoints from './SunnahPoints';
import ProcessTimeline from './ProcessTimeline';
import ClinicalStandards from './ClinicalStandards';
import WelcomeScreen from './WelcomeScreen';
import SunnahCalendar from './SunnahCalendar';
import FAQ from './FAQ';
import InkCursor from './InkCursor';

// --- Read More Component ---
const ReadMore: React.FC<{
  children: React.ReactNode;
  preview: React.ReactNode;
  language: Language;
}> = ({ children, preview, language }) => {
  const [expanded, setExpanded] = useState(false);
  const label = {
    en: expanded ? 'Read Less' : 'Read More',
    fr: expanded ? 'Lire Moins' : 'Lire Plus',
    ar: expanded ? 'أقل' : 'اقرأ المزيد',
    es: expanded ? 'Leer Menos' : 'Leer Más',
  }[language];

  return (
    <div>
      {preview}
      <div
        className={`overflow-hidden transition-all duration-700 ease-in-out ${
          expanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-6 inline-flex items-center gap-2 text-seal font-sans text-xs uppercase tracking-[0.2em] font-bold border border-seal/30 px-5 py-2 hover:bg-seal hover:text-paper transition-all duration-300 group"
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
    </div>
  );
};

// Translations for UI Structure (Static)
const TRANSLATIONS = {
  en: {
    heroTitle: "We treat, Allah heals",
    heroSubtitle: "You Revive The Sunnah",
    heroHadith: "Indeed, the best of remedies you have is Hijama (cupping).",
    heroHadithSource: "Prophet Muhammad ﷺ (Sahih al-Bukhari 5696, Sahih Muslim 2205)",
    nav: { 
      philosophy: "The Sickness", 
      treatments: "The Treatment", 
      benefits: "Seek Knowledge",
      book: "Book Now", 
      donate: "Donate",
      wisdom: "The Benefits" 
    },
    logo: "The Prophet's Medicine",
    chapters: { i: "Chapter I", ii: "Chapter II", iii: "Chapter III", iv: "Chapter IV" },
    titles: { 
      sickness: "The Sickness",
      treatment: "The Treatment", 
      benefits: "The Benefits",
      services: "Our Services",
      path: "The Path of Treatment",
      covenant: "Our Covenant", 
      knowledge: "Seek Knowledge", 
      booking: "Write Your Name" 
    },
    subtitles: {
      covenant: "Our commitment to excellence in prophetic medicine",
      knowledge: "Seek knowledge from the cradle to the grave",
      booking: "Begin your journey to wellness"
    },
    sicknessContent: {
      intro: "We live in a world where; the air we breathe, the water we drink and the food we eat are laced with chemicals, toxins and heavy metals, the stresses of life and the pace that never lets the body rest—each leaves a mark.",
      pollution: "Harmful substances slip in quietly through the lungs, the gut, and the skin, until the body's natural filters are overwhelmed and the bloodstream becomes a polluted river carrying a whole bunch of what doesn't belong. Energy fades, balance is lost, and inflammation quietly grows.",
      buildup: "Illness doesn't arrive all at once—it builds, moment by moment, until the body finally shows what the environment has been whispering all along.",
      meridians: "The body's meridians, which transport vital energy and blood flow to organs and tissues become blocked. When meridians are blocked, circulation slows and energy stagnates.",
      symptoms: "Patients start to experience pain, stiffness, fatigue, digestive issues, mental issues, weakened immunity, skin problems or a wide range of other sickness or dis-ease in the body.",
      pharma: "Then comes the doctor focusing on treating symptoms with pharmaceuticals, masking discomfort without addressing the underlying cause, which usually leads to misdiagnosis, and prolonged illness instead of true healing.",
      difference: "Pharmaceuticals to us are part of the sickness, they often mute pain and lower symptoms, yes. But add new chemicals to the body in order to synthetically keep the system quiet. Relief may come, but the root remains untouched. While hijama seeks to clear at the source; the other manages the symptoms. And in that difference lies two very different philosophies of treatment."
    },
    treatmentContent: {
      whatIs: "What Is Hijama? Hijama moves like the wind of an ancient healing method, through the body, lifting the surface of the skin to release what has been trapped beneath it; stagnation.",
      listens: "Hijama does not silence the body's signals; it listens to them, drawing out what no longer belongs so flow and balance can return.",
      prophetic: "Also known as wet cupping therapy, Hijama cupping is a powerful form of prophetic medicine first practiced by the Prophet Adam and later by the Prophet Muhammad ﷺ.",
      authentic: "Authentic hadith from Sahih al-Bukhari and Sahih Muslim confirm that Prophet ﷺ listed Hijama among the best natural remedies known to mankind.",
      continues: "Today, Islamic Sunnah Hijama therapy continues to be used for detoxification, pain relief, and overall wellness. Hijama has been used for thousands of years to restore balance, detoxify, and awaken the body's natural ability to heal itself.",
      worship: "Hijama is more than a treatment; it is an act of ibadah i.e Worship.",
      howWorks: "How Hijama Works:",
      process1: "During a Hijama session, specialized cups are placed on targeted areas gently creating suction on specific points of the body,",
      process2: "next, small and superficial incisions are made allowing harmful substances trapped on the surface of the blood to be released.",
      process3: "This process detoxifies the blood, stimulates circulation, supports the immune system, and helps the body reset on a deep, cellular level.",
      results: "The result? Many people report improved sleep, mental clarity, and an overall sense of emotional release instantly after treatment."
    },
    whiteDaysDiscount: "Save 10% on White Days",
    whiteDaysHadith: "Whoever performs Hijama on the 17th, 19th, or 21st (of the lunar month), it will be a cure for every disease.",
    whiteDaysSource: "(Sunan Abu Dawud 3861 – Hasan)",
    benefitsContent: {
      intro: "Hijama is like a silent reset for the body and soul. Gentle cups draw out stagnant blood and toxins, clearing the hidden blockages that weigh you down, restoring the flow that gives life and energy.",
      physical: "Pain eases, circulation awakens, and the body breathes again. Beyond the physical, it reconnects you to a timeless Sunnah, a practice that cleanses both mind, body and spirit, leaving a renewed sense of balance, clarity, and vitality that you can feel from the inside out.",
      wellness: "Hijama is widely used for both physical and spiritual wellness and mental wellness, and is said by the prophet ﷺ to help with 70 plus diseases including:",
      conditions: [
        "Chronic pain and muscle tension",
        "Migraines and headaches",
        "Stress, anxiety, and fatigue",
        "Mental difficulty/weakness",
        "Poor circulation and inflammation",
        "Detoxification and immune support",
        "Hormonal and digestive imbalances",
        "Removes jinn & sihr",
        "And Many More"
      ]
    },
    processSteps: {
      diagnosis: {
        title: "Diagnosis",
        desc: "Let us mindfully evaluate your body's signals, discover contradictions to treatment and uncover hidden imbalances, clearing and preparing the path."
      },
      cupping: {
        title: "Cupping",
        desc: "The body is gently prepared, then guided through a precise cupping process where toxins and tension is released and circulation is awakened."
      },
      restoration: {
        title: "Restoration",
        desc: "A recovery-focused phase that promotes relaxation, nutrition, balance, and long-term wellness following your Hijama session."
      }
    },
    seeMore: "See More Services",
    seeLess: "Show Less",
    pendingApproval: "Pending Approval",
    pricing: {
      taxNote: "Prices include GST & QST",
      discountsTitle: "Discounts - 20% Off",
      seniors: "Seniors, Children, Sick, Needy",
      children: "Children under 12",
      hardship: "Financial hardship cases",
      mobileTitle: "Mobile Service",
      camel: "🐪",
      travel: "Travel & setup: +$20–30",
      extra: "Evenings / weekends: +$15"
    },
    footerHadith: "Indeed, the best of remedies you have is Hijama (cupping).",
    footerHadithSource: "Prophet Muhammad ﷺ (Sahih al-Bukhari 5696)",
    footer: { healing: "Healing Body, Mind & Soul", rights: "All rights reserved." }
  },
  fr: {
    heroTitle: "Nous soignons, Allah guérit",
    heroSubtitle: "Vous Ravivez La Sunnah",
    heroHadith: "En vérité, le meilleur des remèdes que vous avez est la Hijama (ventouses).",
    heroHadithSource: "Prophète Muhammad ﷺ (Sahih al-Bukhari 5696, Sahih Muslim 2205)",
    nav: { 
      philosophy: "La Maladie", 
      treatments: "Le Traitement", 
      benefits: "Les Bienfaits",
      book: "Réserver Maintenant", 
      donate: "Faire un don",
      wisdom: "Chercher le Savoir"
    },
    logo: "La Médecine du Prophète",
    chapters: { i: "Chapitre I", ii: "Chapitre II", iii: "Chapitre III", iv: "Chapitre IV" },
    titles: { 
      sickness: "La Maladie",
      treatment: "Le Traitement", 
      benefits: "Les Bienfaits",
      services: "Nos Services",
      path: "Le Chemin du Traitement",
      covenant: "Notre Pacte", 
      knowledge: "Chercher le Savoir", 
      booking: "Inscrivez Votre Nom" 
    },
    subtitles: {
      covenant: "Notre engagement envers l'excellence en médecine prophétique",
      knowledge: "Cherchez le savoir du berceau au tombeau",
      booking: "Commencez votre voyage vers le bien-être"
    },
    sicknessContent: {
      intro: "We live in a world where; the air we breathe, the water we drink and the food we eat are laced with chemicals, toxins and heavy metals, the stresses of life and the pace that never lets the body rest—each leaves a mark.",
      pollution: "Harmful substances slip in quietly through the lungs, the gut, and the skin, until the body's natural filters are overwhelmed and the bloodstream becomes a polluted river carrying a whole bunch of what doesn't belong. Energy fades, balance is lost, and inflammation quietly grows.",
      buildup: "Illness doesn't arrive all at once—it builds, moment by moment, until the body finally shows what the environment has been whispering all along.",
      meridians: "The body's meridians, which transport vital energy and blood flow to organs and tissues become blocked. When meridians are blocked, circulation slows and energy stagnates.",
      symptoms: "Patients start to experience pain, stiffness, fatigue, digestive issues, mental issues, weakened immunity, skin problems or a wide range of other sickness or dis-ease in the body.",
      pharma: "Then comes the doctor focusing on treating symptoms with pharmaceuticals, masking discomfort without addressing the underlying cause, which usually leads to misdiagnosis, and prolonged illness instead of true healing.",
      difference: "Pharmaceuticals to us are part of the sickness, they often mute pain and lower symptoms, yes. But add new chemicals to the body in order to synthetically keep the system quiet. Relief may come, but the root remains untouched. While hijama seeks to clear at the source; the other manages the symptoms. And in that difference lies two very different philosophies of treatment."
    },
    treatmentContent: {
      whatIs: "What Is Hijama? Hijama moves like the wind of an ancient healing method, through the body, lifting the surface of the skin to release what has been trapped beneath it; stagnation.",
      listens: "Hijama does not silence the body's signals; it listens to them, drawing out what no longer belongs so flow and balance can return.",
      prophetic: "Also known as wet cupping therapy, Hijama cupping is a powerful form of prophetic medicine first practiced by the Prophet Adam and later by the Prophet Muhammad ﷺ.",
      authentic: "Authentic hadith from Sahih al-Bukhari and Sahih Muslim confirm that Prophet ﷺ listed Hijama among the best natural remedies known to mankind.",
      continues: "Today, Islamic Sunnah Hijama therapy continues to be used for detoxification, pain relief, and overall wellness. Hijama has been used for thousands of years to restore balance, detoxify, and awaken the body's natural ability to heal itself.",
      worship: "Hijama is more than a treatment; it is an act of ibadah i.e Worship.",
      howWorks: "How Hijama Works:",
      process1: "During a Hijama session, specialized cups are placed on targeted areas gently creating suction on specific points of the body,",
      process2: "next, small and superficial incisions are made allowing harmful substances trapped on the surface of the blood to be released.",
      process3: "This process detoxifies the blood, stimulates circulation, supports the immune system, and helps the body reset on a deep, cellular level.",
      results: "The result? Many people report improved sleep, mental clarity, and an overall sense of emotional release instantly after treatment."
    },
    whiteDaysDiscount: "Save 10% on White Days",
    whiteDaysHadith: "Whoever performs Hijama on the 17th, 19th, or 21st (of the lunar month), it will be a cure for every disease.",
    whiteDaysSource: "(Sunan Abu Dawud 3861 – Hasan)",
    benefitsContent: {
      intro: "Hijama is like a silent reset for the body and soul. Gentle cups draw out stagnant blood and toxins, clearing the hidden blockages that weigh you down, restoring the flow that gives life and energy.",
      physical: "Pain eases, circulation awakens, and the body breathes again. Beyond the physical, it reconnects you to a timeless Sunnah, a practice that cleanses both mind, body and spirit, leaving a renewed sense of balance, clarity, and vitality that you can feel from the inside out.",
      wellness: "Hijama is widely used for both physical and spiritual wellness and mental wellness, and is said by the prophet ﷺ to help with 70 plus diseases including:",
      conditions: [
        "Chronic pain and muscle tension",
        "Migraines and headaches",
        "Stress, anxiety, and fatigue",
        "Mental difficulty/weakness",
        "Poor circulation and inflammation",
        "Detoxification and immune support",
        "Hormonal and digestive imbalances",
        "Removes jinn & sihr",
        "And Many More"
      ]
    },
    processSteps: {
      diagnosis: {
        title: "Diagnosis",
        desc: "Let us mindfully evaluate your body's signals, discover contradictions to treatment and uncover hidden imbalances, clearing and preparing the path."
      },
      cupping: {
        title: "Cupping",
        desc: "The body is gently prepared, then guided through a precise cupping process where toxins and tension is released and circulation is awakened."
      },
      restoration: {
        title: "Restoration",
        desc: "A recovery-focused phase that promotes relaxation, nutrition, balance, and long-term wellness following your Hijama session."
      }
    },
    seeMore: "Voir Plus de Services",
    seeLess: "Voir Moins",
    pendingApproval: "En attente d'approbation",
    pricing: {
      taxNote: "Prices include GST & QST",
      discountsTitle: "Discounts - 20% Off",
      seniors: "Seniors, Children, Sick, Needy",
      children: "Children under 12",
      hardship: "Financial hardship cases",
      mobileTitle: "Mobile Service",
      camel: "🐪",
      travel: "Travel & setup: +$20–30",
      extra: "Evenings / weekends: +$15"
    },
    footerHadith: "Indeed, the best of remedies you have is Hijama (cupping).",
    footerHadithSource: "Prophet Muhammad ﷺ (Sahih al-Bukhari 5696)",
    footer: { healing: "Healing Body, Mind & Soul", rights: "All rights reserved." }
  },
  ar: {
    heroTitle: "نحن نعالج، والله الشافي",
    heroSubtitle: "أنت تحيي السنة",
    heroHadith: "إن خير ما تداويتم به الحجامة",
    heroHadithSource: "النبي محمد ﷺ (صحيح البخاري ٥٦٩٦، صحيح مسلم ٢٢٠٥)",
    nav: { 
      philosophy: "المرض", 
      treatments: "العلاج", 
      benefits: "الفوائد",
      book: "احجز الآن", 
      donate: "تبرع",
      wisdom: "طلب العلم"
    },
    logo: "طب النبي",
    chapters: { i: "الفصل الأول", ii: "الفصل الثاني", iii: "الفصل الثالث", iv: "الفصل الرابع" },
    titles: { 
      sickness: "المرض",
      treatment: "العلاج", 
      benefits: "الفوائد",
      services: "أعمالنا",
      path: "الطريق للعلاج",
      covenant: "عهدنا", 
      knowledge: "طلب العلم", 
      booking: "سجل اسمك" 
    },
    subtitles: {
      covenant: "التزامنا بالتميز في الطب النبوي",
      knowledge: "اطلبوا العلم من المهد إلى اللحد",
      booking: "ابدأ رحلتك نحو العافية"
    },
    sicknessContent: {
      intro: "We live in a world where; the air we breathe, the water we drink and the food we eat are laced with chemicals, toxins and heavy metals, the stresses of life and the pace that never lets the body rest—each leaves a mark.",
      pollution: "Harmful substances slip in quietly through the lungs, the gut, and the skin, until the body's natural filters are overwhelmed and the bloodstream becomes a polluted river carrying a whole bunch of what doesn't belong. Energy fades, balance is lost, and inflammation quietly grows.",
      buildup: "Illness doesn't arrive all at once—it builds, moment by moment, until the body finally shows what the environment has been whispering all along.",
      meridians: "The body's meridians, which transport vital energy and blood flow to organs and tissues become blocked. When meridians are blocked, circulation slows and energy stagnates.",
      symptoms: "Patients start to experience pain, stiffness, fatigue, digestive issues, mental issues, weakened immunity, skin problems or a wide range of other sickness or dis-ease in the body.",
      pharma: "Then comes the doctor focusing on treating symptoms with pharmaceuticals, masking discomfort without addressing the underlying cause, which usually leads to misdiagnosis, and prolonged illness instead of true healing.",
      difference: "Pharmaceuticals to us are part of the sickness, they often mute pain and lower symptoms, yes. But add new chemicals to the body in order to synthetically keep the system quiet. Relief may come, but the root remains untouched. While hijama seeks to clear at the source; the other manages the symptoms. And in that difference lies two very different philosophies of treatment."
    },
    treatmentContent: {
      whatIs: "What Is Hijama? Hijama moves like the wind of an ancient healing method, through the body, lifting the surface of the skin to release what has been trapped beneath it; stagnation.",
      listens: "Hijama does not silence the body's signals; it listens to them, drawing out what no longer belongs so flow and balance can return.",
      prophetic: "Also known as wet cupping therapy, Hijama cupping is a powerful form of prophetic medicine first practiced by the Prophet Adam and later by the Prophet Muhammad ﷺ.",
      authentic: "Authentic hadith from Sahih al-Bukhari and Sahih Muslim confirm that Prophet ﷺ listed Hijama among the best natural remedies known to mankind.",
      continues: "Today, Islamic Sunnah Hijama therapy continues to be used for detoxification, pain relief, and overall wellness. Hijama has been used for thousands of years to restore balance, detoxify, and awaken the body's natural ability to heal itself.",
      worship: "Hijama is more than a treatment; it is an act of ibadah i.e Worship.",
      howWorks: "How Hijama Works:",
      process1: "During a Hijama session, specialized cups are placed on targeted areas gently creating suction on specific points of the body,",
      process2: "next, small and superficial incisions are made allowing harmful substances trapped on the surface of the blood to be released.",
      process3: "This process detoxifies the blood, stimulates circulation, supports the immune system, and helps the body reset on a deep, cellular level.",
      results: "The result? Many people report improved sleep, mental clarity, and an overall sense of emotional release instantly after treatment."
    },
    whiteDaysDiscount: "Save 10% on White Days",
    whiteDaysHadith: "Whoever performs Hijama on the 17th, 19th, or 21st (of the lunar month), it will be a cure for every disease.",
    whiteDaysSource: "(Sunan Abu Dawud 3861 – Hasan)",
    benefitsContent: {
      intro: "Hijama is like a silent reset for the body and soul. Gentle cups draw out stagnant blood and toxins, clearing the hidden blockages that weigh you down, restoring the flow that gives life and energy.",
      physical: "Pain eases, circulation awakens, and the body breathes again. Beyond the physical, it reconnects you to a timeless Sunnah, a practice that cleanses both mind, body and spirit, leaving a renewed sense of balance, clarity, and vitality that you can feel from the inside out.",
      wellness: "Hijama is widely used for both physical and spiritual wellness and mental wellness, and is said by the prophet ﷺ to help with 70 plus diseases including:",
      conditions: [
        "Chronic pain and muscle tension",
        "Migraines and headaches",
        "Stress, anxiety, and fatigue",
        "Mental difficulty/weakness",
        "Poor circulation and inflammation",
        "Detoxification and immune support",
        "Hormonal and digestive imbalances",
        "Removes jinn & sihr",
        "And Many More"
      ]
    },
    processSteps: {
      diagnosis: {
        title: "Diagnosis",
        desc: "Let us mindfully evaluate your body's signals, discover contradictions to treatment and uncover hidden imbalances, clearing and preparing the path."
      },
      cupping: {
        title: "Cupping",
        desc: "The body is gently prepared, then guided through a precise cupping process where toxins and tension is released and circulation is awakened."
      },
      restoration: {
        title: "Restoration",
        desc: "A recovery-focused phase that promotes relaxation, nutrition, balance, and long-term wellness following your Hijama session."
      }
    },
    seeMore: "عرض المزيد",
    seeLess: "عرض أقل",
    pendingApproval: "في انتظار الموافقة",
    pricing: {
      taxNote: "Prices include GST & QST",
      discountsTitle: "Discounts - 20% Off",
      seniors: "Seniors, Children, Sick, Needy",
      children: "Children under 12",
      hardship: "Financial hardship cases",
      mobileTitle: "Mobile Service",
      camel: "🐪",
      travel: "Travel & setup: +$20–30",
      extra: "Evenings / weekends: +$15"
    },
    footerHadith: "Indeed, the best of remedies you have is Hijama (cupping).",
    footerHadithSource: "Prophet Muhammad ﷺ (Sahih al-Bukhari 5696)",
    footer: { healing: "Healing Body, Mind & Soul", rights: "All rights reserved." }
  },
  es: {
    heroTitle: "Nosotros tratamos, Allah cura",
    heroSubtitle: "Tú Revives La Sunnah",
    heroHadith: "En verdad, el mejor de los remedios que tienen es la Hijama (ventosas).",
    heroHadithSource: "Profeta Muhammad ﷺ (Sahih al-Bukhari 5696, Sahih Muslim 2205)",
    nav: { 
      philosophy: "La Enfermedad", 
      treatments: "El Tratamiento", 
      benefits: "Los Beneficios",
      book: "Reservar Ahora", 
      donate: "Donar",
      wisdom: "Buscar el Conocimiento"
    },
    logo: "La Medicina del Profeta",
    chapters: { i: "Capítulo I", ii: "Capítulo II", iii: "Capítulo III", iv: "Capítulo IV" },
    titles: { 
      sickness: "La Enfermedad",
      treatment: "El Tratamiento", 
      benefits: "Los Beneficios",
      services: "Nuestros Servicios",
      path: "El Camino del Tratamiento",
      covenant: "Nuestro Pacto", 
      knowledge: "Buscar el Conocimiento", 
      booking: "Escribe Tu Nombre" 
    },
    subtitles: {
      covenant: "Nuestro compromiso con la excelencia en medicina profética",
      knowledge: "Busca el conocimiento desde la cuna hasta la tumba",
      booking: "Comienza tu viaje hacia el bienestar"
    },
    sicknessContent: {
      intro: "We live in a world where; the air we breathe, the water we drink and the food we eat are laced with chemicals, toxins and heavy metals, the stresses of life and the pace that never lets the body rest—each leaves a mark.",
      pollution: "Harmful substances slip in quietly through the lungs, the gut, and the skin, until the body's natural filters are overwhelmed and the bloodstream becomes a polluted river carrying a whole bunch of what doesn't belong. Energy fades, balance is lost, and inflammation quietly grows.",
      buildup: "Illness doesn't arrive all at once—it builds, moment by moment, until the body finally shows what the environment has been whispering all along.",
      meridians: "The body's meridians, which transport vital energy and blood flow to organs and tissues become blocked. When meridians are blocked, circulation slows and energy stagnates.",
      symptoms: "Patients start to experience pain, stiffness, fatigue, digestive issues, mental issues, weakened immunity, skin problems or a wide range of other sickness or dis-ease in the body.",
      pharma: "Then comes the doctor focusing on treating symptoms with pharmaceuticals, masking discomfort without addressing the underlying cause, which usually leads to misdiagnosis, and prolonged illness instead of true healing.",
      difference: "Pharmaceuticals to us are part of the sickness, they often mute pain and lower symptoms, yes. But add new chemicals to the body in order to synthetically keep the system quiet. Relief may come, but the root remains untouched. While hijama seeks to clear at the source; the other manages the symptoms. And in that difference lies two very different philosophies of treatment."
    },
    treatmentContent: {
      whatIs: "What Is Hijama? Hijama moves like the wind of an ancient healing method, through the body, lifting the surface of the skin to release what has been trapped beneath it; stagnation.",
      listens: "Hijama does not silence the body's signals; it listens to them, drawing out what no longer belongs so flow and balance can return.",
      prophetic: "Also known as wet cupping therapy, Hijama cupping is a powerful form of prophetic medicine first practiced by the Prophet Adam and later by the Prophet Muhammad ﷺ.",
      authentic: "Authentic hadith from Sahih al-Bukhari and Sahih Muslim confirm that Prophet ﷺ listed Hijama among the best natural remedies known to mankind.",
      continues: "Today, Islamic Sunnah Hijama therapy continues to be used for detoxification, pain relief, and overall wellness. Hijama has been used for thousands of years to restore balance, detoxify, and awaken the body's natural ability to heal itself.",
      worship: "Hijama is more than a treatment; it is an act of ibadah i.e Worship.",
      howWorks: "How Hijama Works:",
      process1: "During a Hijama session, specialized cups are placed on targeted areas gently creating suction on specific points of the body,",
      process2: "next, small and superficial incisions are made allowing harmful substances trapped on the surface of the blood to be released.",
      process3: "This process detoxifies the blood, stimulates circulation, supports the immune system, and helps the body reset on a deep, cellular level.",
      results: "The result? Many people report improved sleep, mental clarity, and an overall sense of emotional release instantly after treatment."
    },
    whiteDaysDiscount: "Save 10% on White Days",
    whiteDaysHadith: "Whoever performs Hijama on the 17th, 19th, or 21st (of the lunar month), it will be a cure for every disease.",
    whiteDaysSource: "(Sunan Abu Dawud 3861 – Hasan)",
    benefitsContent: {
      intro: "Hijama is like a silent reset for the body and soul. Gentle cups draw out stagnant blood and toxins, clearing the hidden blockages that weigh you down, restoring the flow that gives life and energy.",
      physical: "Pain eases, circulation awakens, and the body breathes again. Beyond the physical, it reconnects you to a timeless Sunnah, a practice that cleanses both mind, body and spirit, leaving a renewed sense of balance, clarity, and vitality that you can feel from the inside out.",
      wellness: "Hijama is widely used for both physical and spiritual wellness and mental wellness, and is said by the prophet ﷺ to help with 70 plus diseases including:",
      conditions: [
        "Chronic pain and muscle tension",
        "Migraines and headaches",
        "Stress, anxiety, and fatigue",
        "Mental difficulty/weakness",
        "Poor circulation and inflammation",
        "Detoxification and immune support",
        "Hormonal and digestive imbalances",
        "Removes jinn & sihr",
        "And Many More"
      ]
    },
    processSteps: {
      diagnosis: {
        title: "Diagnosis",
        desc: "Let us mindfully evaluate your body's signals, discover contradictions to treatment and uncover hidden imbalances, clearing and preparing the path."
      },
      cupping: {
        title: "Cupping",
        desc: "The body is gently prepared, then guided through a precise cupping process where toxins and tension is released and circulation is awakened."
      },
      restoration: {
        title: "Restoration",
        desc: "A recovery-focused phase that promotes relaxation, nutrition, balance, and long-term wellness following your Hijama session."
      }
    },
    seeMore: "Ver Más Servicios",
    seeLess: "Ver Menos",
    pendingApproval: "Aprobación pendiente",
    pricing: {
      taxNote: "Prices include GST & QST",
      discountsTitle: "Discounts - 20% Off",
      seniors: "Seniors, Children, Sick, Needy",
      children: "Children under 12",
      hardship: "Financial hardship cases",
      mobileTitle: "Mobile Service",
      camel: "🐪",
      travel: "Travel & setup: +$20–30",
      extra: "Evenings / weekends: +$15"
    },
    footerHadith: "Indeed, the best of remedies you have is Hijama (cupping).",
    footerHadithSource: "Prophet Muhammad ﷺ (Sahih al-Bukhari 5696)",
    footer: { healing: "Healing Body, Mind & Soul", rights: "All rights reserved." }
  }
};

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [appReady, setAppReady] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false);

  // Data State
  const [servicesData, setServicesData] = useState<ServiceData[]>([]);
  const [faqsData, setFaqsData] = useState<FAQData[]>([]);
  
  const t = TRANSLATIONS[language];

  // Fetch Data from Firestore
  useEffect(() => {
    const unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceData));
      setServicesData(data.length > 0 ? data : DEFAULT_SERVICES);
    }, (error) => {
        console.error("Using default services due to:", error);
        setServicesData(DEFAULT_SERVICES);
    });

    const unsubFaqs = onSnapshot(collection(db, 'faqs'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FAQData));
      setFaqsData(data.length > 0 ? data : DEFAULT_FAQS);
    }, (error) => {
        console.error("Using default FAQs due to:", error);
        setFaqsData(DEFAULT_FAQS);
    });

    return () => {
      unsubServices();
      unsubFaqs();
    };
  }, []);

  // Map Data to UI
  const getDisplayServices = (): ServiceItem[] => {
    return servicesData.map(s => ({
      id: s.id,
      title: s.title[language],
      description: s.description[language],
      price: s.price,
      duration: s.duration,
      benefits: s.benefits[language] || [],
      recommended: s.recommended,
      genderSpecific: s.genderSpecific
    }));
  };

  const allVisibleServices = getDisplayServices().filter(s => !s.genderSpecific || s.genderSpecific === gender);
  // Show only first 6 unless expanded
  const visibleServices = showAllServices ? allVisibleServices : allVisibleServices.slice(0, 6);

  const getServiceIcon = (id: string) => {
    if (id.includes('dry-cupping')) return <Feather size={32} strokeWidth={1} />;
    if (id.includes('wet-cupping')) return <Droplet size={32} strokeWidth={1} />;
    if (id.includes('cupping-massage')) return <Activity size={32} strokeWidth={1} />;
    if (id.includes('sunnah')) return <Star size={32} strokeWidth={1} />;
    if (id.includes('sports')) return <Activity size={32} strokeWidth={1} />;
    if (id.includes('new-muslim')) return <Smile size={32} strokeWidth={1} />;
    if (id.includes('therapeutic')) return <HeartHandshake size={32} strokeWidth={1} />;
    if (id.includes('couples')) return <Users size={32} strokeWidth={1} />;
    return <Droplet size={32} strokeWidth={1} />;
  };

  // Check if a service is sisters-only
  const isSistersOnly = (service: ServiceItem) => service.genderSpecific === 'female';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    setGender(selectedGender);
    window.scrollTo(0, 0);
    setTimeout(() => {
        window.scrollTo(0, 0);
        setAppReady(true);
    }, 50);
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!gender) {
    return (
      <WelcomeScreen 
        onSelect={handleGenderSelect} 
        currentLanguage={language}
        onLanguageSelect={setLanguage}
      />
    );
  }

  const Logo = ({ large = false }: { large?: boolean }) => {
    const getLogoSrc = () => {
      switch (language) {
        case 'ar': return '/assets/logo-ar.png';
        case 'fr': return '/assets/logo-fr.png';
        case 'es': return '/assets/logo-es.png';
        default: return '/assets/logo-en.png';
      }
    };

    return (
      <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        className={`block group ${large ? 'scale-110 md:scale-125' : ''}`}
      >
        <img 
          src={getLogoSrc()} 
          alt={t.logo}
          className={`${large ? 'h-12 md:h-16' : 'h-8 md:h-10 lg:h-12'} w-auto object-contain transition-all duration-300 group-hover:opacity-80`}
        />
      </a>
    );
  };

  return (
    <div className={`min-h-screen bg-paper text-ink font-serif selection:bg-seal selection:text-paper overflow-x-hidden no-scrollbar transition-opacity duration-1000 ${appReady ? 'opacity-100' : 'opacity-0'} ${gender === 'female' ? 'theme-female' : ''} ${language === 'ar' ? 'text-right' : 'text-left'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <ScrollProgress />
      <InkCursor />
      
      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[60] bg-paper transition-transform duration-700 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : (language === 'ar' ? '-translate-x-full' : 'translate-x-full')} md:hidden flex flex-col`}>
        <div className="p-6 flex justify-end">
          <button onClick={() => setMobileMenuOpen(false)} className="text-ink hover:text-seal transition-colors">
            <X size={32} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-12 p-6">
          <button onClick={() => scrollTo('about')} className="text-4xl font-display text-ink hover:text-seal transition-colors">{t.nav.philosophy}</button>
          <button onClick={() => scrollTo('services')} className="text-4xl font-display text-ink hover:text-seal transition-colors">{t.nav.treatments}</button>
          <button onClick={() => scrollTo('knowledge')} className="text-4xl font-display text-ink hover:text-seal transition-colors">{t.nav.wisdom}</button>
          <div className="flex flex-col gap-4 w-full px-8">
            <button onClick={() => scrollTo('booking')} className="w-full py-3 border-2 border-ink text-ink font-sans uppercase tracking-widest font-bold hover:bg-ink hover:text-paper transition-all">
              {t.nav.book}
            </button>
            <a 
              href="https://paypal.me/saromacouture" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 flex items-center justify-center gap-2 border-2 border-seal text-seal font-sans uppercase tracking-widest font-bold hover:bg-seal hover:text-paper transition-all"
            >
              <HeartHandshake size={18} /> {t.nav.donate}
            </a>
          </div>
           
          <div className="flex gap-4 mt-4">
            {(['en', 'fr', 'ar', 'es'] as Language[]).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={`text-sm uppercase tracking-widest ${language === lang ? 'text-seal font-bold border-b border-seal' : 'text-ink/60'}`}>
                {lang}
              </button>
            ))}
          </div>
        </div>
        <div className="p-8 text-center">
          <Logo large />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-1000 ${isScrolled ? 'bg-paper/95 backdrop-blur-sm py-2 border-b border-ink shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12 rtl:space-x-reverse">
            <button onClick={() => scrollTo('about')} className="text-ink hover:text-seal transition-colors italic text-lg font-medium relative group">
              {t.nav.philosophy}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollTo('services')} className="text-ink hover:text-seal transition-colors italic text-lg font-medium relative group">
              {t.nav.treatments}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollTo('knowledge')} className="text-ink hover:text-seal transition-colors italic text-lg font-medium relative group">
              {t.nav.wisdom}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            
            <div className="flex items-center gap-3 text-xs font-sans font-bold uppercase tracking-widest text-ink/50 border-l border-ink/20 pl-6 rtl:border-l-0 rtl:border-r rtl:pl-0 rtl:pr-6">
              {['en', 'fr', 'ar', 'es'].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang as Language)} 
                  className={`hover:text-seal transition-colors ${language === lang ? 'text-seal' : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <a 
                href="https://paypal.me/saromacouture" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 text-seal border border-seal rounded-full hover:bg-seal hover:text-paper transition-all"
                title={t.nav.donate}
              >
                <HeartHandshake size={18} />
              </a>

              <button onClick={() => scrollTo('booking')} className="px-6 py-2 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-500 font-sans text-xs uppercase tracking-widest font-bold">
                {t.nav.book}
              </button>
            </div>
          </div>

          <button className="md:hidden text-ink hover:text-seal transition-colors z-[70]" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={32} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-paper">
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <InkPattern opacity={0.15} />
        </div>

        {/* Hero Hijama Illustration — mirrored on both sides */}
        <div className="absolute bottom-0 left-0 w-48 md:w-72 opacity-[0.06] pointer-events-none select-none">
          <img src="/assets/hijama.jpeg" alt="" className="w-full h-auto" />
        </div>
        <div className="absolute bottom-0 right-0 w-48 md:w-72 opacity-[0.06] pointer-events-none select-none" style={{ transform: 'scaleX(-1)' }}>
          <img src="/assets/hijama.jpeg" alt="" className="w-full h-auto" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-12" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <FadeIn direction="up">
            <div className="flex flex-col items-center mb-10">
              <div className="border border-seal px-4 py-1 rounded-full bg-paper animate-pulse-slow shadow-sm">
                <span className="text-xs uppercase tracking-[0.3em] text-seal font-sans font-bold">
                  {t.heroSubtitle}
                </span>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={200} direction="up">
            <h1 className={`font-display text-5xl md:text-8xl text-ink mb-8 leading-[1.1] tracking-tight ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'en' && (
                <>
                  We treat, <span className="text-sacred">Allah</span> <span className="text-xs align-super font-arabic">ﷻ</span> heals
                </>
              )}
              {language === 'fr' && (
                <>
                  Nous soignons, <span className="text-sacred">Allah</span> <span className="text-xs align-super font-arabic">ﷻ</span> guérit
                </>
              )}
              {language === 'ar' && (
                <>
                  نحن نعالج، و<span className="text-sacred">الله</span> <span className="text-xs font-arabic">ﷻ</span> الشافي
                </>
              )}
              {language === 'es' && (
                <>
                  Nosotros tratamos, <span className="text-sacred">Allah</span> <span className="text-xs align-super font-arabic">ﷻ</span> cura
                </>
              )}
            </h1>
          </FadeIn>
          
          {/* Hadith Section */}
          <FadeIn delay={400} direction="up">
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-paper-light border-2 border-seal/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-paper px-4">
                <span className="text-seal text-xs uppercase tracking-widest font-sans font-bold">Hadith</span>
              </div>
              <p className="font-serif text-2xl md:text-3xl text-ink mb-6 leading-relaxed italic">
                "{t.heroHadith}"
              </p>
              <p className="text-seal font-sans text-sm tracking-wide">
                {t.heroHadithSource}
              </p>
            </div>
          </FadeIn>
        </div>
      </header>

      {/* About */}
      <section id="about" className="py-32 px-6 bg-paper-light relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <FadeIn direction={language === 'ar' ? 'left' : 'right'}>
              <div>
                <div className="text-seal font-bold uppercase tracking-[0.2em] text-xs mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-seal"></span> {t.chapters.i}
                </div>
                <h2 className="font-display text-5xl text-ink mb-8">{t.titles.sickness}</h2>
                <div className="space-y-6 text-ink text-xl font-serif leading-relaxed">
                  <p>{t.sicknessContent.intro}</p>
                </div>
                <div className="mt-12"><SunnahCalendar language={language} /></div>
              </div>
            </FadeIn>
            <FadeIn direction={language === 'ar' ? 'right' : 'left'} delay={300}>
               <SunnahPoints />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Chapter I: The Sickness — with Read More */}
      <section id="sickness" className="py-32 px-6 bg-paper relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="text-seal font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4">
                {t.chapters.i}
              </div>
              <h2 className="font-display text-6xl md:text-7xl text-ink mb-6">
                {t.titles.sickness}
              </h2>
              <div className="w-24 h-1 bg-seal mx-auto"></div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-16 items-start mt-20">
            <FadeIn direction={language === 'ar' ? 'left' : 'right'} delay={200}>
              <ReadMore
                language={language}
                preview={
                  <div className="space-y-6 text-lg leading-relaxed">
                    <p className="font-serif text-ink/90 first-letter:text-5xl first-letter:font-display first-letter:text-sacred first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                      {t.sicknessContent.intro}
                    </p>
                    <p className="font-serif text-ink/90">
                      {t.sicknessContent.pollution}
                    </p>
                  </div>
                }
              >
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="font-serif text-ink/90">
                    {t.sicknessContent.buildup}
                  </p>
                  <p className="font-serif text-ink/90">
                    The body's <span className="text-sacred font-bold">meridians</span>, which transport vital energy and <span className="text-sacred font-bold">blood flow</span> to organs and tissues become blocked. When meridians are blocked, <span className="text-sacred font-bold">circulation</span> slows and energy stagnates.
                  </p>
                  <p className="font-serif text-ink/90">
                    {t.sicknessContent.symptoms}
                  </p>
                  <p className="font-serif text-ink/90">
                    {t.sicknessContent.pharma}
                  </p>
                  <p className="font-serif text-ink/90 italic border-l-4 border-sacred pl-6">
                    {t.sicknessContent.difference}
                  </p>
                </div>
              </ReadMore>
            </FadeIn>

            <FadeIn direction={language === 'ar' ? 'right' : 'left'} delay={400}>
              <div className="relative">
                <SunnahPoints />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Chapter II: The Treatment — with Read More + Hijama Image */}
      <section id="treatment" className="py-32 px-6 bg-paper-light relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="text-seal font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4">
                {t.chapters.ii}
              </div>
              <h2 className="font-display text-6xl md:text-7xl text-ink mb-6">
                {t.titles.treatment}
              </h2>
              <div className="w-24 h-1 bg-seal mx-auto"></div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-16 items-start mt-20">
            <FadeIn direction={language === 'ar' ? 'left' : 'right'} delay={200}>
              <ReadMore
                language={language}
                preview={
                  <div className="space-y-6 text-lg leading-relaxed">
                    <p className="font-serif text-ink/90 first-letter:text-5xl first-letter:font-display first-letter:text-sacred first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                      {t.treatmentContent.whatIs}
                    </p>
                    <p className="font-serif text-ink/90">
                      {t.treatmentContent.listens}
                    </p>
                  </div>
                }
              >
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="font-serif text-ink/90">
                    Also known as <span className="text-sacred font-bold">wet cupping therapy</span>, Hijama cupping is a powerful form of <span className="text-sacred font-bold">prophetic medicine</span> first practiced by the Prophet Adam <span className="font-arabic">عليه السلام</span> and later by the Prophet Muhammad <span className="font-arabic">ﷺ</span>.
                  </p>
                  <p className="font-serif text-ink/90">
                    {t.treatmentContent.authentic}
                  </p>
                  <p className="font-serif text-ink/90">
                    {t.treatmentContent.continues}
                  </p>
                  <p className="font-serif text-ink/90 italic border-l-4 border-sacred pl-6 text-sacred">
                    {t.treatmentContent.worship}
                  </p>
                  
                  <h4 className="font-display text-2xl text-ink mt-8">{t.treatmentContent.howWorks}</h4>
                  <p className="font-serif text-ink/90">{t.treatmentContent.process1}</p>
                  <p className="font-serif text-ink/90">{t.treatmentContent.process2}</p>
                  <p className="font-serif text-ink/90">{t.treatmentContent.process3}</p>
                  <p className="font-serif text-ink/90 font-bold">{t.treatmentContent.results}</p>
                </div>
              </ReadMore>
            </FadeIn>

            {/* Hijama Illustration */}
            <FadeIn direction={language === 'ar' ? 'right' : 'left'} delay={400}>
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/assets/hijama.jpeg" 
                    alt="Traditional Hijama Cupping Therapy" 
                    className="w-full max-w-md mx-auto rounded-sm shadow-2xl border-4 border-double border-ink/10"
                  />
                  {/* Pending Approval Stamp */}
                  <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-paper border-2 border-seal rounded-full w-24 h-24 md:w-28 md:h-28 flex items-center justify-center transform rotate-12 shadow-lg">
                    <div className="text-center">
                      <div className="text-seal font-sans text-[8px] md:text-[9px] uppercase tracking-widest font-bold leading-tight">
                        {t.pendingApproval}
                      </div>
                      <div className="w-8 h-[1px] bg-seal mx-auto my-1"></div>
                      <div className="text-seal/60 text-[7px] font-sans">2026</div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Chapter III: The Benefits — with Read More */}
      <section id="benefits" className="py-32 px-6 bg-paper relative">
        <div className="container mx-auto max-w-6xl relative z-10">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="text-seal font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4">
                {t.chapters.iii}
              </div>
              <h2 className="font-display text-6xl md:text-7xl text-ink mb-6">
                {t.titles.benefits}
              </h2>
              <div className="w-24 h-1 bg-seal mx-auto"></div>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto mt-20">
            <FadeIn direction="up" delay={200}>
              <ReadMore
                language={language}
                preview={
                  <div className="space-y-6 text-lg leading-relaxed text-center">
                    <p className="font-serif text-ink/90 text-xl italic">
                      {t.benefitsContent.intro}
                    </p>
                  </div>
                }
              >
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="font-serif text-ink/90">
                    {t.benefitsContent.physical}
                  </p>
                  <p className="font-serif text-ink/90">
                    Hijama is widely used for both <span className="text-sacred font-bold">physical</span> and <span className="text-sacred font-bold">spiritual wellness</span> and <span className="text-sacred font-bold">mental wellness</span>, and is said by the prophet <span className="font-arabic">ﷺ</span> to help with <span className="text-sacred font-bold">70 plus diseases</span> including:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-8">
                    {t.benefitsContent.conditions.map((condition, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-paper-light border border-ink/10 hover:border-seal/30 transition-colors">
                        <Star size={12} className="fill-seal text-seal flex-shrink-0" />
                        <span className="font-serif text-ink/80">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ReadMore>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services — Show 6 + See More */}
      <section id="services" className="py-32 bg-paper-light relative overflow-hidden">
        <InkPattern className="transform rotate-180 opacity-5" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <div className="text-seal font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.chapters.ii}</div>
              <h2 className="font-display text-5xl text-ink">{t.titles.services}</h2>
              <div className="w-12 h-1 bg-ink mx-auto mt-6"></div>
              <p className="mt-6 text-ink/60 font-serif italic">{t.pricing.taxNote}</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12">
            {visibleServices.map((service, idx) => (
              <FadeIn key={service.id} delay={idx * 50} direction="up">
                <div className={`
                  relative h-full flex flex-col p-10 transition-all duration-700 group cursor-default
                  bg-paper-light border-2 hover:-translate-y-2
                  ${isSistersOnly(service) 
                    ? 'border-pink hover:border-pink' 
                    : service.recommended 
                      ? 'border-seal/50' 
                      : 'border-ink/10 hover:border-seal/30'
                  }
                  hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]
                `}>
                  {/* Sisters-only badge */}
                  {isSistersOnly(service) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink text-paper px-6 py-1 text-xs font-serif italic tracking-widest shadow-md z-20">
                      {language === 'ar' ? 'للأخوات فقط' : 'Sisters Only'}
                    </div>
                  )}

                  {/* Recommended Ribbon */}
                  {service.recommended && !isSistersOnly(service) && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-seal text-paper px-6 py-1 text-xs font-serif italic tracking-widest shadow-md z-20">
                       {language === 'ar' ? 'الأكثر طلباً' : 'Most Requested'}
                    </div>
                  )}

                  {/* Header */}
                  <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mb-6 transition-all duration-700 relative overflow-hidden bg-paper ${
                      isSistersOnly(service)
                        ? 'border-pink text-pink'
                        : service.recommended 
                          ? 'border-seal text-seal' 
                          : 'border-ink/20 text-ink/60 group-hover:border-seal group-hover:text-seal'
                    }`}>
                      <div className="group-hover:scale-110 transition-transform duration-500 group-hover:drop-shadow-lg">{getServiceIcon(service.id)}</div>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl text-center text-ink mb-2 group-hover:text-seal transition-colors duration-500">{service.title}</h3>
                    <div className="h-[1px] w-12 bg-seal/50 my-2 group-hover:w-24 transition-all duration-500"></div>
                  </div>

                  {/* Pricing */}
                  <div className="flex justify-center gap-4 text-xs font-sans font-bold uppercase tracking-widest text-seal/80 mb-8 relative z-10">
                    <span className="border border-seal/20 px-3 py-1 bg-paper group-hover:border-seal transition-colors duration-500">{service.duration}</span>
                    <span className="border border-seal/20 px-3 py-1 bg-paper group-hover:border-seal transition-colors duration-500">{service.price}</span>
                  </div>

                  {/* Desc */}
                  <p className="text-center text-ink/80 font-serif italic text-lg leading-relaxed mb-8 flex-grow relative z-10 group-hover:text-ink transition-colors duration-500">
                    {service.description}
                  </p>

                  {/* Benefits */}
                  <div className="overflow-hidden max-h-0 group-hover:max-h-48 transition-all duration-700 ease-in-out mb-2 relative z-10">
                    <div className="flex flex-wrap justify-center gap-2 text-xs font-serif text-ink/70 pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 delay-100">
                       {service.benefits.map((b, i) => (
                         <span key={i} className="bg-paper-light px-3 py-1 border border-ink/10 text-ink shadow-sm flex items-center gap-1">
                           <Star size={8} className="fill-seal text-seal" /> {b}
                         </span>
                       ))}
                    </div>
                  </div>

                  <button onClick={() => scrollTo('booking')} className={`w-full py-4 font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 relative z-10 border overflow-hidden group/btn ${
                    isSistersOnly(service)
                      ? 'bg-pink text-paper border-pink hover:opacity-90'
                      : service.recommended 
                        ? 'bg-seal text-paper border-seal hover:bg-seal-dark' 
                        : 'bg-transparent text-ink border-ink/20 hover:border-seal hover:text-seal hover:bg-paper'
                  }`}>
                    <span className="relative z-10 group-hover/btn:translate-x-1 inline-block transition-transform duration-300">
                      {language === 'ar' ? 'اختر العلاج' : (language === 'fr' ? 'Choisir' : (language === 'es' ? 'Seleccionar' : 'Select Treatment'))}
                    </span>
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* See More / Show Less Button */}
          {allVisibleServices.length > 6 && (
            <div className="text-center mt-16">
              <button
                onClick={() => setShowAllServices(!showAllServices)}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-ink text-ink font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-ink hover:text-paper transition-all duration-500"
              >
                {showAllServices ? t.seeLess : t.seeMore}
                <ChevronDown size={16} className={`transition-transform duration-300 ${showAllServices ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}

          {/* Pricing Info & Discounts Section */}
          <div className="mt-24 grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <FadeIn direction="up" delay={200}>
               <div className="bg-paper-light border border-ink/10 p-8 relative overflow-hidden group hover:border-seal/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Percent size={64} className="text-seal" />
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-seal"></span> {t.pricing.discountsTitle}
                  </h3>
                  <ul className="space-y-4 font-serif text-lg text-ink/80 italic">
                    <li className="flex items-start gap-3">
                      <span className="text-seal mt-1.5"><Star size={10} fill="currentColor" /></span>
                      {t.pricing.seniors}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-seal mt-1.5"><Star size={10} fill="currentColor" /></span>
                      {t.pricing.children}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-seal mt-1.5"><Star size={10} fill="currentColor" /></span>
                      {t.pricing.hardship}
                    </li>
                  </ul>
               </div>
            </FadeIn>

            <FadeIn direction="up" delay={400}>
               <div className="bg-paper-light border border-ink/10 p-8 relative overflow-hidden group hover:border-seal/30 transition-colors">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl">🐪</span>
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-6 flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-seal"></span> {t.pricing.mobileTitle}
                  </h3>
                  <ul className="space-y-4 font-serif text-lg text-ink/80 italic">
                    <li className="flex items-start gap-3">
                      <span className="text-seal mt-1.5"><Star size={10} fill="currentColor" /></span>
                      {t.pricing.travel}
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-seal mt-1.5"><Star size={10} fill="currentColor" /></span>
                      {t.pricing.extra}
                    </li>
                  </ul>
               </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-32 bg-paper relative">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
           <FadeIn direction="up">
             <div className="text-center mb-16">
               <div className="text-seal font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.chapters.iii}</div>
               <h2 className="font-display text-5xl text-ink">{t.titles.path}</h2>
             </div>
           </FadeIn>
           <ProcessTimeline language={language} />
        </div>
      </section>

      {/* Standards */}
      <section id="standards" className="py-32 bg-paper-light relative">
         <div className="container mx-auto px-6 max-w-6xl relative z-10">
           <div className="flex flex-col items-center text-center mb-20">
              <FadeIn direction="up">
                <h2 className="font-display text-5xl mb-8 text-ink">{t.titles.covenant}</h2>
                <p className="text-ink text-xl font-serif italic max-w-2xl mx-auto">{t.subtitles.covenant}</p>
              </FadeIn>
           </div>
           <ClinicalStandards language={language} />
         </div>
      </section>

      {/* Knowledge */}
      <section id="knowledge" className="py-32 bg-paper relative">
        <InkPattern opacity={0.1} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
             <FadeIn direction="up">
               <div className="mb-12 text-center">
                 <div className="text-seal font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.chapters.iv}</div>
                 <h2 className="font-display text-5xl text-ink mb-6">{t.titles.knowledge}</h2>
                 <p className="text-ink font-serif italic text-xl mb-8">
                   {t.subtitles.knowledge} <br/>
                   <span className="text-sm opacity-60">- Sunan Ibn Majah</span>
                 </p>
                 <FAQ language={language} />
               </div>
             </FadeIn>
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="py-32 bg-paper-light relative border-t border-ink/10">
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn direction="up">
             <div className="text-center mb-16">
               <h2 className="font-display text-6xl text-ink mb-6">{t.titles.booking}</h2>
               <p className="text-seal font-serif italic text-xl">{t.subtitles.booking}</p>
             </div>
             <BookingWizard services={allVisibleServices} language={language} />
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-paper border-t border-ink pt-24 pb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-seal to-transparent opacity-20"></div>
        
        {/* Footer Illustration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.04] pointer-events-none select-none">
          <img src="/assets/hijama.jpeg" alt="" className="w-96 h-auto" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="mx-auto mb-4 flex justify-center"><Logo large /></div>
          
          {/* Footer Hadith */}
          <div className="max-w-xl mx-auto mb-8 p-6 border border-seal/10 relative">
            <p className="font-serif italic text-ink/70 text-lg leading-relaxed">
              "{t.footerHadith}"
            </p>
            <p className="text-seal/60 font-sans text-xs mt-3 tracking-wide">
              {t.footerHadithSource}
            </p>
          </div>

          <p className="font-serif italic text-ink mb-12 text-lg">{t.footer.healing}</p>
          <div className="flex justify-center gap-12 text-sm text-ink font-sans tracking-widest uppercase mb-16 font-bold flex-wrap">
            <button onClick={() => scrollTo('about')} className="hover:text-seal transition-colors relative group">
              {t.nav.philosophy}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollTo('services')} className="hover:text-seal transition-colors relative group">
              {t.nav.treatments}
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollTo('knowledge')} className="hover:text-seal transition-colors relative group">
              {t.nav.wisdom}
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollTo('booking')} className="hover:text-seal transition-colors relative group">
              {t.nav.book}
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </button>
            <a href="https://paypal.me/saromacouture" target="_blank" rel="noopener noreferrer" className="hover:text-seal transition-colors relative group">
              {t.nav.donate}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-seal transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          <div className="text-seal text-xs font-serif italic opacity-60">
            &copy; {new Date().getFullYear()} The Prophet's Medicine. {t.footer.rights}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;