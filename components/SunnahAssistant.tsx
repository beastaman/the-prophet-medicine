import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, ScrollText } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

const TEXTS = {
  en: {
    suggestions: ["Best days for Hijama?", "Does it hurt?", "Preparation?", "Benefits?"],
    welcome: "As-salamu alaykum. I am your wellness guide. How may I assist you with the tradition of Hijama today?",
    placeholder: "Inquire here...",
    consulting: "Consulting the texts...",
    title: "The Knowledge Base",
    subtitle: "AI Powered Wisdom"
  },
  fr: {
    suggestions: ["Meilleurs jours?", "Est-ce douloureux?", "Préparation?", "Bienfaits?"],
    welcome: "As-salamu alaykum. Je suis votre guide bien-être. Comment puis-je vous aider avec la tradition de la Hijama aujourd'hui ?",
    placeholder: "Posez votre question...",
    consulting: "Consultation des textes...",
    title: "La Base de Connaissances",
    subtitle: "Sagesse par IA"
  },
  ar: {
    suggestions: ["أفضل الأيام؟", "هل هي مؤلمة؟", "التحضير؟", "الفوائد؟"],
    welcome: "السلام عليكم. أنا دليلك الصحي. كيف يمكنني مساعدتك في سنة الحجامة اليوم؟",
    placeholder: "اكتب استفسارك هنا...",
    consulting: "مراجعة النصوص...",
    title: "قاعدة المعرفة",
    subtitle: "حكمة مدعومة بالذكاء الاصطناعي"
  },
  es: {
    suggestions: ["¿Mejores días?", "¿Duele?", "¿Preparación?", "¿Beneficios?"],
    welcome: "As-salamu alaykum. Soy tu guía de bienestar. ¿Cómo puedo ayudarte con la tradición de Hijama hoy?",
    placeholder: "Consulta aquí...",
    consulting: "Consultando los textos...",
    title: "Base de Conocimiento",
    subtitle: "Sabiduría por IA"
  }
};

const SunnahAssistant: React.FC<{ language: Language }> = ({ language }) => {
  const [input, setInput] = useState('');
  const t = TEXTS[language];
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: t.welcome }
  ]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Reset chat on language change
  useEffect(() => {
    setMessages([{ role: 'model', text: TEXTS[language].welcome }]);
  }, [language]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Contextualize the prompt for language
    const langPrompt = `(Please reply in ${language === 'ar' ? 'Arabic' : (language === 'fr' ? 'French' : (language === 'es' ? 'Spanish' : 'English'))}) ${text}`;
    
    const responseText = await getGeminiResponse(langPrompt);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-2 border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[600px] relative">
      
      <div className="bg-ink p-5 flex items-center justify-between relative z-10 text-white border-b-4 border-seal">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-full border border-white/20">
            <ScrollText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-white tracking-wide">{t.title}</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">{t.subtitle}</p>
          </div>
        </div>
        <div className="flex gap-2 items-center px-3 py-1 bg-white/10 rounded-full border border-white/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Active</span>
        </div>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-paper-dark no-scrollbar relative z-10 scroll-smooth">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 animate-fade-up-slow ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`} style={{ animationDuration: '0.5s' }}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 shadow-sm ${
              msg.role === 'user' ? 'bg-seal border-seal text-white' : 'bg-white border-ink text-ink'
            }`}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div className={`max-w-[80%] p-6 text-lg font-serif leading-relaxed shadow-sm relative transition-all hover:shadow-md ${
              msg.role === 'user' 
                ? 'bg-ink text-white rounded-2xl rounded-tr-none' 
                : 'bg-white border border-ink/10 text-ink rounded-2xl rounded-tl-none'
            }`}>
              {msg.text}
              <div className={`absolute top-0 w-4 h-4 ${
                 msg.role === 'user' ? '-right-2 bg-ink [clip-path:polygon(0_0,100%_0,0_100%)]' : '-left-2 bg-white border-t border-l border-ink/10 [clip-path:polygon(0_0,100%_0,100%_100%)]'
              }`}></div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4 animate-pulse">
             <div className="w-10 h-10 rounded-full bg-white border-2 border-ink text-ink flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-ink/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin text-seal" />
              <span className="text-xs text-ink/50 uppercase tracking-wider font-bold">{t.consulting}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t-2 border-ink relative z-10">
        {messages.length < 3 && (
           <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
             {t.suggestions.map((s, i) => (
               <button 
                 key={i}
                 onClick={() => handleSend(s)}
                 className="whitespace-nowrap px-4 py-2 bg-paper-dark border border-ink/20 text-ink/70 text-xs hover:border-seal hover:text-seal transition-colors font-serif italic"
               >
                 {s}
               </button>
             ))}
           </div>
        )}
        
        <div className="flex gap-3 relative bg-paper-dark border-2 border-ink/20 p-1 focus-within:border-seal transition-colors duration-300">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent px-4 py-3 text-lg text-ink focus:outline-none font-serif placeholder-ink/30"
          />
          <button 
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-6 bg-ink text-white hover:bg-seal transition-colors duration-300 disabled:opacity-50 disabled:bg-gray-400 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SunnahAssistant;