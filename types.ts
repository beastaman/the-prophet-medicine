import { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'fr' | 'ar' | 'es';

export interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
  es: string;
}

export interface ServiceData {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  price: string;
  duration: string;
  benefits: {
    en: string[];
    fr: string[];
    ar: string[];
    es: string[];
  };
  recommended?: boolean;
  genderSpecific?: 'male' | 'female';
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  benefits: string[];
  recommended?: boolean;
  genderSpecific?: 'male' | 'female';
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface FAQData {
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
}

export interface FAQItem {
  question: string;
  answer: string;
}