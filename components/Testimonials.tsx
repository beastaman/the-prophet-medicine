import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Testimonial } from '../types';
import FadeIn from './FadeIn';

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Omar Farooq",
    role: "Athlete",
    content: "I've tried cupping in many places, but the hygiene and professionalism here are unmatched. The practitioner has a truly calming presence.",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah Ahmed",
    role: "Mother of three",
    content: "I was nervous about my first session, but the environment was so peaceful. The pain in my shoulders disappeared after one session. Alhamdulillah.",
    rating: 5
  },
  {
    id: 3,
    name: "Dr. Bilal Khan",
    role: "Physiotherapist",
    content: "As a medical professional, I appreciate their adherence to strict sterilization protocols. It's the perfect blend of tradition and safety.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((t, idx) => (
        <FadeIn key={t.id} delay={idx * 200} direction="up">
          <div className="h-full bg-paper-light p-8 border border-ink/20 relative group hover:border-seal transition-all duration-500 hover:shadow-xl flex flex-col">
            
            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-transparent border-r-ink/5 group-hover:border-r-seal transition-colors duration-500"></div>
            
            <Quote className="text-ink/10 w-12 h-12 mb-6 group-hover:text-seal/20 transition-colors duration-500" />
            
            <p className="text-ink/80 font-serif italic text-lg mb-8 leading-relaxed flex-grow relative z-10">
              "{t.content}"
            </p>
            
            <div className="border-t border-ink/10 pt-6 flex items-center justify-between">
              <div>
                <h4 className="font-display text-xl text-ink mb-1 group-hover:text-seal transition-colors">{t.name}</h4>
                <p className="text-[10px] text-ink/50 uppercase tracking-widest font-bold">{t.role}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-seal text-seal" />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
};

export default Testimonials;