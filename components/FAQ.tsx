import React, { useState } from 'react';
import { ChevronDown, Plus, Minus, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { FAQItem, Language } from '../types';
import FadeIn from './FadeIn';
import { saveInquiry } from '../services/firebase';

const TEXTS = {
  en: [
    { q: "Is Hijama painful?", a: "Most patients describe the sensation as a light scratching or pinching. The cups themselves feel like a tight massage." },
    { q: "How long do the marks last?", a: "The circular marks typically fade within 3 to 10 days, depending on your body's circulation." },
    { q: "Can I eat before the session?", a: "It is Sunnah and medically recommended to have an empty stomach for at least 2-3 hours before Hijama." },
    { q: "Is it safe?", a: "Yes. We strictly follow a single-use policy for all cups and blades. Our practitioners are certified." }
  ],
  fr: [
    { q: "La Hijama est-elle douloureuse ?", a: "La plupart décrivent une sensation de légère griffure. Les ventouses ressemblent à un massage ferme." },
    { q: "Combien de temps durent les marques ?", a: "Les marques circulaires s'estompent généralement en 3 à 10 jours." },
    { q: "Puis-je manger avant ?", a: "Il est recommandé (Sunnah) d'être à jeun depuis au moins 2-3 heures." },
    { q: "Est-ce sûr ?", a: "Oui. Nous suivons strictement une politique à usage unique pour tout le matériel." }
  ],
  ar: [
    { q: "هل الحجامة مؤلمة؟", a: "يصف معظم المرضى الإحساس بأنه خدش خفيف. الكؤوس نفسها تشبه التدليك القوي." },
    { q: "كم تستمر العلامات؟", a: "تتلاشى العلامات الدائرية عادةً خلال 3 إلى 10 أيام." },
    { q: "هل يمكنني الأكل قبل الجلسة؟", a: "من السنة ويوصى طبياً بأن تكون المعدة فارغة لمدة 2-3 ساعات على الأقل." },
    { q: "هل هي آمنة؟", a: "نعم. نتبع سياسة الاستخدام الواحد بصرامة لجميع الكؤوس والشفرات." }
  ],
  es: [
    { q: "¿Es dolorosa la Hijama?", a: "La mayoría describe la sensación como un ligero rasguño. Las ventosas se sienten como un masaje firme." },
    { q: "¿Cuánto duran las marcas?", a: "Las marcas circulares generalmente desaparecen en 3 a 10 días." },
    { q: "¿Puedo comer antes?", a: "Es Sunnah y médicamente recomendable tener el estómago vacío por al menos 2-3 horas." },
    { q: "¿Es seguro?", a: "Sí. Seguimos estrictamente una política de un solo uso para todo el equipo." }
  ]
};

const TEXTS_FORM = {
  en: {
    title: "Still have questions?",
    subtitle: "Ask us directly, and we shall respond.",
    email: "Your Email",
    question: "Your Question",
    send: "Send Inquiry",
    success: "Your inquiry has been received. Peace be upon you."
  },
  fr: {
    title: "D'autres questions ?",
    subtitle: "Demandez-nous directement, et nous répondrons.",
    email: "Votre E-mail",
    question: "Votre Question",
    send: "Envoyer la demande",
    success: "Votre demande a été reçue. Que la paix soit sur vous."
  },
  ar: {
    title: "هل لديك أسئلة أخرى؟",
    subtitle: "اسألنا مباشرة وسنقوم بالرد.",
    email: "بريدك الإلكتروني",
    question: "سؤالك",
    send: "إرسال الاستفسار",
    success: "تم استلام استفسارك. عليكم السلام."
  },
  es: {
    title: "¿Más preguntas?",
    subtitle: "Pregúntanos directamente y responderemos.",
    email: "Tu Correo",
    question: "Tu Pregunta",
    send: "Enviar Consulta",
    success: "Su consulta ha sido recibida. La paz sea con usted."
  }
};

const FAQ: React.FC<{ language: Language }> = ({ language }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const faqs = TEXTS[language];
  const tForm = TEXTS_FORM[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && question) {
      setIsSending(true);
      const success = await saveInquiry({ email, question });
      setIsSending(false);
      
      if (success) {
        setSubmitted(true);
        setEmail('');
        setQuestion('');
      } else {
        alert("Failed to send inquiry. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-16">
      <div className="space-y-0">
        {faqs.map((faq, idx) => (
          <FadeIn key={idx} delay={idx * 100} direction="up">
            <div className="border-b border-ink/20 group">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none"
              >
                <span className={`font-display text-2xl transition-colors duration-300 ${openIndex === idx ? 'text-seal' : 'text-ink group-hover:text-seal'}`}>
                  {faq.q}
                </span>
                <div className={`p-2 rounded-full border transition-all duration-300 ${openIndex === idx ? 'border-seal text-seal rotate-180' : 'border-ink/20 text-ink group-hover:border-seal group-hover:text-seal'}`}>
                   {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === idx ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
              >
                <div className="text-ink/70 font-serif text-lg leading-relaxed pl-4 border-l-2 border-seal/30 italic">
                  {faq.a}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Contact Form */}
      <FadeIn delay={400} direction="up">
        <div className="bg-paper-light border border-ink/10 p-8 md:p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
             <Send size={120} />
          </div>
          
          <div className="relative z-10">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="mb-8">
                  <h3 className="font-display text-3xl text-ink mb-2">{tForm.title}</h3>
                  <p className="font-serif italic text-ink/60">{tForm.subtitle}</p>
                </div>
                
                <div className="space-y-6">
                  <div className="relative group">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder=" "
                      disabled={isSending}
                      className="peer w-full bg-transparent border-b-2 border-ink/10 py-3 text-lg text-ink focus:outline-none focus:border-seal transition-colors pt-6 disabled:opacity-50"
                    />
                    <label className="absolute left-0 top-6 text-ink/50 text-base transition-all duration-300 peer-focus:-top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold peer-focus:text-seal peer-not-placeholder-shown:-top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:font-bold pointer-events-none">
                      {tForm.email}
                    </label>
                  </div>
                  
                  <div className="relative group">
                    <textarea 
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                      rows={3}
                      placeholder=" "
                      disabled={isSending}
                      className="peer w-full bg-transparent border-b-2 border-ink/10 py-3 text-lg text-ink focus:outline-none focus:border-seal transition-colors pt-6 resize-none disabled:opacity-50"
                    />
                    <label className="absolute left-0 top-6 text-ink/50 text-base transition-all duration-300 peer-focus:-top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold peer-focus:text-seal peer-not-placeholder-shown:-top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:font-bold pointer-events-none">
                      {tForm.question}
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSending} className="px-8 py-3 bg-ink text-white font-serif italic text-lg hover:bg-seal transition-colors duration-300 shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait">
                    {isSending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        {tForm.send} <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-up-slow">
                <div className="w-16 h-16 rounded-full bg-seal/10 flex items-center justify-center mb-6 text-seal">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-display text-2xl text-ink mb-4">{tForm.success}</h3>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs uppercase tracking-widest text-ink/50 hover:text-seal underline mt-4"
                >
                  {language === 'ar' ? 'أرسل سؤالا آخر' : (language === 'fr' ? 'Poser une autre question' : (language === 'es' ? 'Hacer otra pregunta' : 'Ask another question'))}
                </button>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default FAQ;