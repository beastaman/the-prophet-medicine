import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Calendar, Clock, User, Check, Feather, Loader2 } from 'lucide-react';
import { ServiceItem, Language } from '../types';
import { saveBooking } from '../services/firebase';

interface BookingWizardProps {
  services: ServiceItem[];
  language: Language;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const TEXTS = {
  en: {
    steps: ["Select the Treatment", "Mark the Time", "Inscribe Details", "Seal the Appointment"],
    patientRegistry: "The Patient Registry",
    dateOfVisit: "The Date of Visit",
    onThe: "On the",
    dayOf: "day of",
    inTheYear: "in the year",
    theHour: "The Hour",
    hour: "Hour",
    minute: "Minute",
    name: "Name",
    email: "Email",
    phone: "Phone",
    attest: "I attest the information above is true.",
    confirmation: "Appointment Confirmation",
    heldAt: "To be held at The Prophet's Medicine",
    certifies: "This document certifies that",
    honoredGuest: "Honored Guest",
    reserved: "has reserved a session for",
    at: "at",
    official: "Official",
    confirmed: "Confirmed",
    dispatched: "A copy has been dispatched to",
    previous: "Previous",
    next: "Next",
    affix: "Affix Seal",
    processing: "Processing..."
  },
  fr: {
    steps: ["Choisir le Traitement", "Marquer l'Heure", "Inscrire les Détails", "Sceller le Rendez-vous"],
    patientRegistry: "Le Registre des Patients",
    dateOfVisit: "La Date de Visite",
    onThe: "Le",
    dayOf: "jour de",
    inTheYear: "de l'année",
    theHour: "L'Heure",
    hour: "Heure",
    minute: "Minute",
    name: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    attest: "J'atteste que les informations ci-dessus sont vraies.",
    confirmation: "Confirmation de Rendez-vous",
    heldAt: "À tenir à La Médecine Prophétique",
    certifies: "Ce document certifie que",
    honoredGuest: "Invité d'Honneur",
    reserved: "a réservé une séance pour",
    at: "à",
    official: "Officiel",
    confirmed: "Confirmé",
    dispatched: "Une copie a été envoyée à",
    previous: "Précédent",
    next: "Suivant",
    affix: "Apposer le Sceau",
    processing: "Traitement..."
  },
  ar: {
    steps: ["اختر العلاج", "حدد الوقت", "سجل التفاصيل", "اختم الموعد"],
    patientRegistry: "سجل المرضى",
    dateOfVisit: "تاريخ الزيارة",
    onThe: "في",
    dayOf: "من شهر",
    inTheYear: "من عام",
    theHour: "الساعة",
    hour: "ساعة",
    minute: "دقيقة",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    attest: "أشهد أن المعلومات أعلاه صحيحة.",
    confirmation: "تأكيد الموعد",
    heldAt: "سيعقد في الطب النبوي",
    certifies: "تشهد هذه الوثيقة أن",
    honoredGuest: "ضيفنا الكريم",
    reserved: "قد حجز جلسة لـ",
    at: "في تمام",
    official: "رسمي",
    confirmed: "مؤكد",
    dispatched: "تم إرسال نسخة إلى",
    previous: "السابق",
    next: "التالي",
    affix: "ختم الموعد",
    processing: "جار المعالجة..."
  },
  es: {
    steps: ["Seleccionar Tratamiento", "Marcar la Hora", "Inscribir Detalles", "Sellar Cita"],
    patientRegistry: "El Registro de Pacientes",
    dateOfVisit: "La Fecha de Visita",
    onThe: "El",
    dayOf: "día de",
    inTheYear: "del año",
    theHour: "La Hora",
    hour: "Hora",
    minute: "Minuto",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    attest: "Atestiguo que la información anterior es verdadera.",
    confirmation: "Confirmación de Cita",
    heldAt: "A realizarse en La Medicina Profética",
    certifies: "Este documento certifica que",
    honoredGuest: "Huésped de Honor",
    reserved: "ha reservado una sesión para",
    at: "a las",
    official: "Oficial",
    confirmed: "Confirmado",
    dispatched: "Se ha enviado una copia a",
    previous: "Anterior",
    next: "Siguiente",
    affix: "Colocar Sello",
    processing: "Procesando..."
  }
};

const BookingWizard: React.FC<BookingWizardProps> = ({ services, language }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const t = TEXTS[language];
  
  const [day, setDay] = useState('');
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const currentYear = new Date().getFullYear();
  const [timeHour, setTimeHour] = useState('');
  const [timeMinute, setTimeMinute] = useState('');
  const [timePeriod, setTimePeriod] = useState('AM');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [finalDate, setFinalDate] = useState('');
  const [finalTime, setFinalTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (day && month) {
      setFinalDate(`${month} ${day}, ${currentYear}`);
    }
    if (timeHour && timeMinute) {
      const paddedMinute = timeMinute.length === 1 ? `0${timeMinute}` : timeMinute;
      setFinalTime(`${timeHour}:${paddedMinute} ${timePeriod}`);
    }
  }, [day, month, currentYear, timeHour, timeMinute, timePeriod]);

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  
  const handleSubmit = async () => {
    if (!selectedService) return;

    setIsSubmitting(true);
    const success = await saveBooking({
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      date: finalDate,
      time: finalTime,
      clientName: formData.name,
      clientEmail: formData.email,
      clientPhone: formData.phone
    });
    setIsSubmitting(false);

    if (success) {
      setStep(4);
    } else {
      alert("There was an error saving your booking. Please try again.");
    }
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '' || (parseInt(val) <= 31 && parseInt(val) > 0)) setDay(val);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '' || (parseInt(val) <= 12 && parseInt(val) > 0)) setTimeHour(val);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val === '' || (parseInt(val) < 60 && parseInt(val) >= 0)) setTimeMinute(val);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white border border-ink/10 shadow-[0_30px_60px_rgba(0,0,0,0.05)] relative">
      <div className="absolute -top-6 -right-6 w-24 h-24 border-4 border-seal rounded-full flex items-center justify-center rotate-12 pointer-events-none opacity-80 z-20 bg-white">
         <div className="absolute inset-1 border border-seal rounded-full opacity-50"></div>
         <span className="font-serif text-seal text-xs tracking-widest uppercase font-bold">{t.official}</span>
      </div>

      <div className="flex flex-col md:flex-row min-h-[600px]">
        <div className="md:w-24 bg-paper-dark border-r border-ink/5 flex flex-col items-center py-12 relative overflow-hidden">
          <div className="flex-1 flex flex-col gap-8 items-center relative z-10">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className={`relative w-4 h-4 flex items-center justify-center transition-all duration-700 ${step === i ? 'scale-125' : ''}`}>
                 <div className={`absolute inset-0 rounded-full border border-ink transition-all duration-500 ${step >= i ? 'bg-ink' : 'bg-transparent'}`}></div>
                 {step === i && <div className="absolute inset-[-4px] border border-seal rounded-full animate-pulse-slow"></div>}
               </div>
             ))}
             <div className="h-full w-[1px] bg-ink/20 mt-4"></div>
          </div>
          <div className="text-vertical font-serif text-seal text-xs tracking-[0.3em] uppercase mt-8 font-bold opacity-80">
            {t.patientRegistry}
          </div>
        </div>

        <div className="flex-1 p-8 md:p-16 relative">
          <div className="mb-12 text-center">
            <div className="overflow-hidden">
               <h2 key={step} className="font-serif text-4xl md:text-5xl text-ink mb-2 animate-slide-up-fade">
                 {t.steps[step - 1]}
               </h2>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-seal to-transparent mx-auto opacity-50"></div>
          </div>

          <div className="max-w-2xl mx-auto min-h-[400px]">
            {step === 1 && (
              <div className="space-y-4 animate-slide-up-fade">
                {services.map((service, idx) => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); nextStep(); }}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    className={`
                      w-full text-left p-6 border-b border-ink/10 transition-all duration-500 group relative overflow-hidden animate-slide-up-fade
                      ${selectedService?.id === service.id ? 'bg-ink text-white pl-8' : 'hover:bg-ink/5 hover:pl-8'}
                    `}
                  >
                    <div className="flex justify-between items-baseline mb-2 relative z-10">
                      <span className={`font-serif text-2xl transition-colors ${selectedService?.id === service.id ? 'text-white' : 'text-ink'}`}>{service.title}</span>
                      <span className={`font-sans text-sm font-bold tracking-widest ${selectedService?.id === service.id ? 'text-seal-light' : 'text-seal opacity-70'}`}>{service.price}</span>
                    </div>
                    <p className={`font-serif italic text-lg leading-relaxed relative z-10 transition-opacity ${selectedService?.id === service.id ? 'text-white/80' : 'text-ink/60 group-hover:text-ink'}`}>{service.description}</p>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-seal transition-all duration-300 ${selectedService?.id === service.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-16 animate-slide-up-fade">
                <div className="relative p-8 bg-paper-dark/30 border border-ink/5 rounded-sm shadow-sm hover:shadow-md transition-all duration-500">
                  <label className="block text-seal text-xs uppercase tracking-widest mb-8 font-bold flex items-center gap-2">
                    <Calendar size={14} /> {t.dateOfVisit}
                  </label>
                  <div className="flex flex-wrap items-baseline gap-4 font-serif text-3xl md:text-4xl text-ink leading-relaxed">
                    <span>{t.onThe}</span>
                    <div className="relative group w-20">
                      <input type="text" value={day} onChange={handleDayChange} placeholder="Day" className="w-full bg-transparent border-b-2 border-ink/20 text-center focus:outline-none focus:border-ink/0 placeholder-ink/20 text-seal" />
                       <div className="absolute bottom-0 left-0 h-[2px] bg-seal w-0 group-focus-within:w-full transition-all duration-700 ease-out"></div>
                    </div>
                    <span>{t.dayOf}</span>
                    <div className="relative group min-w-[150px] flex-1">
                      <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-full bg-transparent border-b-2 border-ink/20 text-center focus:outline-none focus:border-ink/0 cursor-pointer appearance-none text-seal hover:bg-ink/5 transition-colors">
                        {MONTHS.map(m => <option key={m} value={m} className="bg-white text-ink text-lg">{m}</option>)}
                      </select>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-seal w-0 group-focus-within:w-full transition-all duration-700 ease-out"></div>
                    </div>
                    <span className="w-full md:w-auto mt-2 md:mt-0">{t.inTheYear} <span className="text-seal font-bold border-b-2 border-seal/20 px-2">{currentYear}</span>.</span>
                  </div>
                </div>

                <div className="relative p-8 bg-paper-dark/30 border border-ink/5 rounded-sm shadow-sm hover:shadow-md transition-all duration-500 delay-100">
                  <label className="block text-seal text-xs uppercase tracking-widest mb-8 font-bold flex items-center gap-2">
                    <Clock size={14} /> {t.theHour}
                  </label>
                  <div className="flex flex-wrap items-end justify-center gap-4 md:gap-8">
                    <div className="relative w-32 group">
                      <input type="text" value={timeHour} onChange={handleHourChange} placeholder="00" className="w-full bg-transparent border-b-2 border-ink/10 py-2 text-5xl font-serif text-ink text-center focus:outline-none focus:border-ink/0 placeholder-ink/10 relative z-10" />
                      <span className="absolute -bottom-6 left-0 w-full text-center text-[10px] text-ink/40 uppercase tracking-widest">{t.hour}</span>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-seal w-0 group-focus-within:w-full transition-all duration-700 ease-out"></div>
                    </div>
                    <span className="text-4xl text-seal font-serif pb-4 opacity-50 animate-pulse-slow">:</span>
                    <div className="relative w-32 group">
                      <input type="text" value={timeMinute} onChange={handleMinuteChange} placeholder="00" className="w-full bg-transparent border-b-2 border-ink/10 py-2 text-5xl font-serif text-ink text-center focus:outline-none focus:border-ink/0 placeholder-ink/10 relative z-10" />
                      <span className="absolute -bottom-6 left-0 w-full text-center text-[10px] text-ink/40 uppercase tracking-widest">{t.minute}</span>
                      <div className="absolute bottom-0 left-0 h-[2px] bg-seal w-0 group-focus-within:w-full transition-all duration-700 ease-out"></div>
                    </div>
                    <div className="flex gap-4 pb-2 ml-4">
                      {['AM', 'PM'].map((p) => (
                        <button key={p} onClick={() => setTimePeriod(p)} className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center font-serif text-xl transition-all duration-500 ${timePeriod === p ? 'border-seal text-seal bg-white shadow-[0_0_20px_rgba(var(--color-seal),0.2)] scale-110 rotate-3 font-bold' : 'border-ink/20 text-ink/40 hover:border-seal/50 hover:text-seal hover:opacity-100'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 font-serif animate-slide-up-fade">
                {['name', 'email', 'phone'].map((field, i) => (
                  <div key={field} className="relative group" style={{ animationDelay: `${i * 150}ms` }}>
                    <input 
                      type={field === 'email' ? 'email' : 'text'}
                      value={(formData as any)[field]}
                      // @ts-ignore
                      onChange={e => setFormData({...formData, [field]: e.target.value})}
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-ink/10 py-4 text-2xl text-ink focus:outline-none focus:border-ink/0 transition-colors pt-8 relative z-10"
                    />
                    <label className="absolute left-0 top-8 text-seal/60 text-lg transition-all duration-500 peer-focus:-top-0 peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-focus:font-bold peer-focus:text-seal peer-not-placeholder-shown:-top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-seal peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:font-bold pointer-events-none">
                      {t[field as keyof typeof t]}
                    </label>
                    <div className="absolute bottom-0 left-0 h-[2px] bg-seal w-0 group-focus-within:w-full transition-all duration-1000 ease-in-out"></div>
                  </div>
                ))}
                <div className="pt-4 flex items-center gap-3 text-seal/80 italic text-sm animate-slide-up-fade" style={{ animationDelay: '600ms' }}>
                  <Feather size={14} /> <span>{t.attest}</span>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-paper-dark/30 p-12 shadow-inner border border-ink/10 relative overflow-hidden animate-slide-up-fade">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-seal to-transparent opacity-50"></div>
                <div className="text-center mb-10">
                  <div className="font-serif text-3xl italic text-ink mb-2">{t.confirmation}</div>
                  <div className="text-xs text-seal uppercase tracking-widest font-bold">{t.heldAt}</div>
                </div>
                <div className="space-y-6 text-xl text-ink font-serif text-center leading-loose">
                  <p>
                    {t.certifies} <br/>
                    <strong className="text-3xl text-ink border-b border-ink/20 px-4 pb-1 inline-block my-2">{formData.name || t.honoredGuest}</strong> 
                    <br/>{t.reserved} <strong className="text-seal">{selectedService?.title}</strong>.
                  </p>
                  <p className="flex justify-center items-center gap-4 mt-6">
                    <span className="border-b border-ink/20 px-4">{finalDate}</span>
                    <span className="text-seal italic font-bold">{t.at}</span>
                    <span className="border-b border-ink/20 px-4">{finalTime}</span>
                  </p>
                </div>
                <div className="mt-12 pt-8 border-t border-ink/10 flex flex-col items-center">
                  <div className="w-24 h-24 border-4 border-seal rounded-full flex items-center justify-center relative mb-4 opacity-0 animate-stamp-drop">
                    <div className="absolute inset-1 border border-seal rounded-full opacity-50"></div>
                    <div className="text-center transform">
                      <div className="text-seal text-[10px] uppercase font-bold tracking-widest mb-1">{t.official}</div>
                      <div className="text-seal text-lg font-bold uppercase tracking-wide">{t.confirmed}</div>
                      <div className="text-seal text-[8px] uppercase tracking-widest mt-1">PM-CLINIC</div>
                    </div>
                  </div>
                  <p className="text-xs text-ink/60 uppercase tracking-widest animate-fade-up-slow" style={{ animationDelay: '0.5s' }}>{t.dispatched} {formData.email}</p>
                </div>
              </div>
            )}

            {step !== 4 && (
              <div className="mt-16 flex justify-between items-center pt-8 border-t border-ink/5">
                <button 
                  onClick={prevStep}
                  disabled={step === 1 || isSubmitting}
                  className={`flex items-center gap-2 text-ink/60 hover:text-seal transition-colors font-serif italic text-lg group ${step === 1 ? 'opacity-0 cursor-default' : ''}`}
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.previous}
                </button>
                <button 
                  onClick={() => step === 3 ? handleSubmit() : nextStep()}
                  disabled={(step === 2 && (!day || !timeHour || !timeMinute)) || isSubmitting}
                  className="group px-10 py-4 bg-ink text-white font-serif text-xl italic hover:bg-seal transition-all duration-500 shadow-lg disabled:opacity-50 flex items-center gap-3 border border-ink overflow-hidden relative"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {step === 3 ? (
                      isSubmitting ? <><Loader2 className="animate-spin" size={18} /> {t.processing}</> : <>{t.affix} <Feather size={18} /></>
                    ) : (
                      <>{t.next} <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" /></>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWizard;