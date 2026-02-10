import React, { useState, useEffect } from 'react';
import { db, collection, updateDoc, doc, deleteDoc, writeBatch, setDoc, onSnapshot } from '../services/firebase';
import { ServiceData, FAQData, LocalizedString } from '../types';
import { DEFAULT_SERVICES, DEFAULT_FAQS } from '../data/defaults';
import { Lock, LogIn, LayoutGrid, List, Calendar, Plus, Save, Loader2, RefreshCw, AlertTriangle, Mail, CheckCircle2, ArrowRight, X, ChevronRight, Search, Clock, User, Filter, Settings, Trash2 } from 'lucide-react';
import InkCursor from './InkCursor';
import InkPattern from './InkPattern';
import FadeIn from './FadeIn';

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'knowledge' | 'email'>('bookings');
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingSearch, setBookingSearch] = useState(''); // Search State
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [faqs, setFaqs] = useState<FAQData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Email State
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Shared State for promoting Inquiry to FAQ
  const [promoteData, setPromoteData] = useState<{q: string} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
        if (password === 'ProphetsAdmin2026!') {
            setIsAuthenticated(true);
            fetchData();
        } else {
            alert('Incorrect Password. Access Denied.');
            setIsLoggingIn(false);
        }
    }, 800);
  };

  const fetchData = async () => {
    setLoading(true);
    
    const unsubscribeBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      // Sort by timestamp desc if available, or just push
      setBookings(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0)));
    });

    const unsubscribeInquiries = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
      setInquiries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubscribeServices = onSnapshot(collection(db, 'services'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ServiceData));
      setServices(data.length > 0 ? data : []); 
    });

    const unsubscribeFaqs = onSnapshot(collection(db, 'faqs'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as FAQData));
      setFaqs(data.length > 0 ? data : []);
    });

    setLoading(false);
    return () => {
      unsubscribeBookings();
      unsubscribeInquiries();
      unsubscribeServices();
      unsubscribeFaqs();
    };
  };

  const seedDatabase = async () => {
    if (!confirm("Are you sure? This will overwrite existing Services and FAQs with defaults.")) return;
    setLoading(true);
    try {
      const batch = writeBatch(db);
      
      // Seed Services
      DEFAULT_SERVICES.forEach(service => {
        const ref = doc(db, 'services', service.id);
        batch.set(ref, service);
      });

      // Seed FAQs
      DEFAULT_FAQS.forEach(faq => {
        const ref = doc(db, 'faqs', faq.id);
        batch.set(ref, faq);
      });

      await batch.commit();
      alert("Database seeded successfully!");
    } catch (e) {
      console.error(e);
      alert("Error seeding database.");
    }
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'bookings', id), { status });
  };

  const handleDelete = async (collectionName: string, id: string) => {
    if (confirm("Are you sure you want to permanently delete this record?")) {
      await deleteDoc(doc(db, collectionName, id));
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!emailTo || !emailSubject || !emailBody) return;
    
    setSendingEmail(true);
    
    // Simulate Network Request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Success Logic
    setSendingEmail(false);
    setEmailStatus('success');
    
    // Reset after delay
    setTimeout(() => {
        setEmailStatus('idle');
        setEmailTo('');
        setEmailSubject('');
        setEmailBody('');
    }, 8080);
  };

  const openEmailToClient = (email: string) => {
      setEmailTo(email);
      setActiveTab('email');
  };

  // Filter Logic
  const filteredBookings = bookings.filter(b => 
    (b.clientName?.toLowerCase() || '').includes(bookingSearch.toLowerCase()) ||
    (b.clientEmail?.toLowerCase() || '').includes(bookingSearch.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center p-6 relative overflow-hidden">
        <InkCursor />
        <InkPattern opacity={0.1} />
        
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-paper via-transparent to-paper opacity-80 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 border border-ink/5 animate-fade-up-slow">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-seal to-transparent"></div>
          
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-24 h-24 bg-paper-dark border-2 border-ink/5 rounded-full flex items-center justify-center mb-6 text-seal relative group">
               <div className="absolute inset-2 border border-seal/20 rounded-full animate-pulse-slow"></div>
               <Lock size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <h2 className="text-4xl font-display text-ink mb-2">Admin Portal</h2>
            <div className="text-[10px] font-sans uppercase tracking-[0.3em] text-seal font-bold mb-8">The Prophet's Medicine</div>
            
            <div className="bg-seal/5 border border-seal/10 p-4 rounded-sm flex gap-3 text-left w-full">
              <AlertTriangle className="text-seal flex-shrink-0 mt-0.5" size={16} />
              <p className="text-ink/80 font-serif italic text-sm leading-snug">
                Authorized personnel only. <br/> Please identify yourself.
              </p>
            </div>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="relative group">
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-transparent border-b-2 border-ink/10 focus:border-seal outline-none transition-all font-serif text-2xl text-center tracking-widest text-ink placeholder-ink/20"
                placeholder="••••••••••••"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-seal group-focus-within:w-full transition-all duration-500"></div>
            </div>
            
            <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-ink text-white py-4 font-sans font-bold uppercase tracking-widest hover:bg-seal transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />} 
              {isLoggingIn ? 'Authenticating...' : 'Enter Sanctuary'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-[10px] font-sans uppercase tracking-widest text-ink/30 hover:text-seal transition-colors border-b border-transparent hover:border-seal pb-1">Return to Public Site</a>
          </div>
        </div>
      </div>
    );
  }

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button 
        onClick={() => setActiveTab(id)} 
        className={`w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-300 relative group overflow-hidden ${activeTab === id ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
    >
        {activeTab === id && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-seal animate-fade-up-slow"></div>
        )}
        <div className={`relative z-10 transition-transform duration-300 group-hover:translate-x-1 flex items-center gap-4`}>
            <Icon size={18} strokeWidth={1.5} className={activeTab === id ? 'text-seal' : ''} />
            <span className="font-sans text-xs uppercase tracking-widest font-bold">{label}</span>
        </div>
        {activeTab === id && (
            <div className="absolute inset-0 bg-gradient-to-r from-seal/10 to-transparent pointer-events-none"></div>
        )}
    </button>
  );

  return (
    <div className="min-h-screen bg-paper-dark font-sans text-ink cursor-default flex overflow-hidden">
      <InkCursor />
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#1a1a1a] text-white flex flex-col z-20 shadow-2xl relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="p-10 border-b border-white/5 bg-[#151515]">
          <h1 className="font-display text-2xl tracking-tight">The Prophet's Medicine</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-widest opacity-40 font-bold">System Online</p>
          </div>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <NavItem id="bookings" icon={Calendar} label="Bookings" />
          <NavItem id="services" icon={LayoutGrid} label="Services" />
          <NavItem id="knowledge" icon={List} label="Knowledge Base" />
          <NavItem id="email" icon={Mail} label="Broadcast" />
        </nav>
        
        <div className="p-6 border-t border-white/5 bg-[#151515]">
          <button onClick={seedDatabase} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-white/10 text-[10px] uppercase tracking-widest hover:bg-white/5 hover:border-seal hover:text-seal transition-all duration-300 group text-white/40">
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700" /> Reset Database
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative bg-[#F8F8F8] flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-ink/5 px-10 py-6 flex justify-between items-center shadow-sm z-10">
            <div>
                <h2 className="text-xl font-display text-ink capitalize">{activeTab.replace('-', ' ')}</h2>
                <p className="text-xs text-ink/40 font-serif italic mt-1">Manage your sanctuary settings</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded-full bg-paper-dark border border-ink/10 flex items-center justify-center text-ink/40">
                    <User size={16} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-ink/60">Admin</span>
            </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-10 relative">
          <InkPattern opacity={0.03} />
          
          {activeTab === 'bookings' && (
            <FadeIn className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-end">
                  {/* Expanded Search Bar */}
                  <div className="flex-1 max-w-md relative group">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30 group-focus-within:text-seal transition-colors" />
                      <input
                          type="text"
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          placeholder="Search client name or email..."
                          className="w-full bg-white pl-12 pr-4 py-3 border-b-2 border-ink/10 focus:border-seal outline-none transition-all font-serif text-lg placeholder-ink/20 text-ink"
                      />
                      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-seal group-focus-within:w-full transition-all duration-500"></div>
                  </div>
                  <div className="text-xs uppercase tracking-widest text-ink/40 font-bold mb-3">{filteredBookings.length} Records Found</div>
              </div>

              <div className="bg-white border border-ink/5 shadow-xl shadow-ink/5 rounded-sm overflow-hidden animate-fade-up-slow">
                <table className="w-full text-left">
                  <thead className="bg-[#FAFAFA] border-b border-ink/10">
                    <tr>
                      {['Date & Time', 'Client Details', 'Treatment', 'Status', 'Actions'].map((h, i) => (
                          <th key={i} className="p-6 text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {filteredBookings.map((b, idx) => (
                      <tr key={b.id} className="group hover:bg-[#FDFDFD] transition-colors duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                        <td className="p-6 align-top">
                          <div className="flex items-start gap-3">
                              <div className="bg-paper-dark p-2 rounded-sm border border-ink/5 text-ink/40 group-hover:text-seal group-hover:border-seal/20 transition-colors">
                                  <Clock size={16} />
                              </div>
                              <div>
                                <div className="font-bold text-ink font-serif text-lg">{b.date}</div>
                                <div className="text-xs uppercase tracking-widest text-ink/40 font-bold mt-1">{b.time}</div>
                              </div>
                          </div>
                        </td>
                        <td className="p-6 align-top">
                          <div className="font-bold text-ink text-base mb-1">{b.clientName}</div>
                          <div className="text-sm font-serif italic text-ink/60">{b.clientEmail}</div>
                          <div className="text-xs text-ink/40 mt-1 font-mono">{b.clientPhone}</div>
                        </td>
                        <td className="p-6 align-top">
                            <span className="font-serif text-lg text-ink/80 border-b border-ink/10 pb-1">{b.serviceTitle}</span>
                        </td>
                        <td className="p-6 align-top">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                              b.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' : 
                              b.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              b.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                                b.status === 'confirmed' ? 'bg-green-500' : 
                                b.status === 'completed' ? 'bg-blue-500' :
                                b.status === 'cancelled' ? 'bg-red-500' :
                                'bg-yellow-500'
                            }`}></div>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-6 align-top">
                          <div className="flex items-center gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                            <select 
                                value={b.status} 
                                onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                                className="bg-transparent border-b border-ink/20 text-xs py-1 focus:border-seal outline-none cursor-pointer hover:text-seal transition-colors font-bold uppercase"
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirm</option>
                                <option value="cancelled">Cancel</option>
                                <option value="completed">Complete</option>
                            </select>
                            <button onClick={() => openEmailToClient(b.clientEmail)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-seal hover:text-white transition-all text-ink/60" title="Email Client">
                                <Mail size={14} />
                            </button>
                            <button onClick={() => handleDelete('bookings', b.id)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-600 transition-all text-ink/60" title="Delete Booking">
                                <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredBookings.length === 0 && (
                        <tr><td colSpan={5} className="p-16 text-center opacity-40 font-serif italic text-xl">No bookings matches your search.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          )}

          {activeTab === 'services' && (
            <div className="animate-fade-up-slow max-w-7xl mx-auto">
               {services.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-[60vh] text-center border-2 border-dashed border-ink/10 rounded-sm">
                    <div className="w-20 h-20 bg-paper-dark rounded-full flex items-center justify-center mb-6">
                        <LayoutGrid size={32} className="text-ink/20" />
                    </div>
                    <h3 className="text-2xl font-display mb-2 text-ink">The Ledger is Empty</h3>
                    <p className="mb-8 opacity-60 max-w-md font-serif italic text-lg">Initialize the database with the default treatments to begin offering care.</p>
                    <button onClick={seedDatabase} className="bg-seal text-white px-8 py-4 font-bold uppercase tracking-widest hover:bg-seal-dark transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-xs">
                        Load Treatments
                    </button>
                 </div>
               ) : (
                 <ServiceEditor services={services} />
               )}
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="animate-fade-up-slow flex gap-8 h-full">
                {/* INCOMING INQUIRIES SECTION */}
                <div className="w-96 flex flex-col h-[calc(100vh-140px)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display text-ink">Inbox</h2>
                        <span className="bg-seal text-white text-[10px] font-bold rounded-full px-2 py-1 shadow-sm">{inquiries.length} New</span>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
                        {inquiries.length === 0 && (
                            <div className="text-center opacity-40 py-24 font-serif italic border-2 border-dashed border-ink/5 rounded-sm">No new inquiries</div>
                        )}
                        {inquiries.map((inq, idx) => (
                            <div key={inq.id} className="bg-white p-6 border border-ink/5 shadow-sm hover:shadow-md transition-all duration-300 relative group rounded-sm animate-fade-up-slow" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-seal opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-ink/50">{inq.email}</div>
                                    </div>
                                    <button onClick={() => handleDelete('inquiries', inq.id)} className="text-ink/10 hover:text-red-600 transition-colors">
                                        <X size={14} />
                                    </button>
                                </div>
                                <p className="font-serif italic text-lg leading-relaxed text-ink mb-6 line-clamp-3">"{inq.question}"</p>
                                <div className="flex gap-2 pt-4 border-t border-ink/5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => openEmailToClient(inq.email)}
                                        className="flex-1 py-2 text-[10px] uppercase font-bold text-ink hover:text-seal border border-transparent hover:border-ink/10 transition-all bg-paper-dark hover:bg-white"
                                    >
                                        Reply
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setPromoteData({ q: inq.question });
                                        }}
                                        className="flex-1 py-2 text-[10px] uppercase font-bold text-white bg-seal hover:bg-seal-dark transition-all flex items-center justify-center gap-1 shadow-sm"
                                    >
                                        Publish FAQ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ EDITOR SECTION */}
                <div className="flex-1 overflow-y-auto h-[calc(100vh-140px)] pl-8 border-l border-ink/5">
                     <FAQEditor faqs={faqs} promoteData={promoteData} clearPromote={() => setPromoteData(null)} />
                </div>
            </div>
          )}

          {activeTab === 'email' && (
              <div className="animate-fade-up-slow max-w-4xl mx-auto pb-20">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-4xl font-display text-ink">Broadcast Center</h2>
                    <div className="bg-white pl-3 pr-4 py-2 rounded-full border border-ink/10 text-xs font-bold text-ink/60 flex items-center gap-3 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-mono tracking-wide">prophetsmedicine.official@gmail.com</span>
                    </div>
                  </div>

                  <div className="bg-white p-12 shadow-2xl shadow-ink/5 relative border-t-4 border-seal">
                      {/* Paper texture overlay */}
                      <div className="absolute inset-0 bg-[#fffdf5] opacity-50 pointer-events-none mix-blend-multiply"></div>

                      {emailStatus === 'success' && (
                          <div className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center animate-fade-up-slow text-green-700 backdrop-blur-md">
                              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                                <CheckCircle2 size={40} />
                              </div>
                              <h3 className="text-4xl font-display mb-2 text-ink">Dispatched</h3>
                              <p className="opacity-60 font-serif italic text-xl">The message has been sent to {emailTo}</p>
                              <div className="mt-8 text-xs font-bold uppercase tracking-widest bg-green-100 text-green-900 px-4 py-2 rounded-sm border border-green-200">
                                  Transmission Confirmed
                              </div>
                          </div>
                      )}
                      
                      <form onSubmit={handleSendEmail} className="space-y-10 relative z-10">
                          <div className="grid grid-cols-1 gap-8">
                            <div className="relative group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink/30 mb-2 group-focus-within:text-seal transition-colors">To Recipient</label>
                                <input 
                                    type="email" 
                                    value={emailTo} 
                                    onChange={(e) => setEmailTo(e.target.value)} 
                                    placeholder="client@example.com"
                                    className="w-full border-b border-ink/10 py-3 text-3xl font-serif text-ink focus:outline-none focus:border-seal bg-transparent transition-colors placeholder-ink/10"
                                    required 
                                />
                            </div>
                            <div className="relative group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-ink/30 mb-2 group-focus-within:text-seal transition-colors">Subject Line</label>
                                <input 
                                    type="text" 
                                    value={emailSubject} 
                                    onChange={(e) => setEmailSubject(e.target.value)} 
                                    placeholder="Regarding your appointment..."
                                    className="w-full border-b border-ink/10 py-3 text-2xl font-serif text-ink focus:outline-none focus:border-seal bg-transparent transition-colors placeholder-ink/10"
                                    required
                                />
                            </div>
                          </div>
                          
                          <div className="relative group pt-4">
                              <label className="block text-xs font-bold uppercase tracking-widest text-ink/30 mb-4 group-focus-within:text-seal transition-colors">Message Body</label>
                              <div className="relative">
                                  <textarea 
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={12}
                                    placeholder="Write your message here..."
                                    className="w-full border border-ink/10 p-8 text-xl font-serif text-ink/80 focus:outline-none focus:border-seal bg-[#FAFAFA] resize-none leading-relaxed shadow-inner"
                                    required
                                  ></textarea>
                                  <div className="absolute bottom-4 right-6 text-[10px] uppercase tracking-widest opacity-30 pointer-events-none font-bold">Secure Transmission</div>
                              </div>
                          </div>

                          <div className="flex justify-end pt-8 border-t border-ink/5">
                              <button 
                                type="submit" 
                                disabled={sendingEmail}
                                className="bg-ink text-white px-12 py-5 font-bold uppercase tracking-widest hover:bg-seal transition-all duration-500 flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:-translate-y-1 text-sm group"
                              >
                                  {sendingEmail ? <Loader2 className="animate-spin" /> : <Mail size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />}
                                  {sendingEmail ? 'Dispatching...' : 'Send Message'}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Sub-component for editing Services
const ServiceEditor: React.FC<{ services: ServiceData[] }> = ({ services }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ServiceData | null>(null);

  const handleEdit = (service: ServiceData) => {
    setEditingId(service.id);
    setEditForm({ ...service });
  };

  const handleSave = async () => {
    if (editForm && editingId) {
      await setDoc(doc(db, 'services', editingId), editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const createNew = () => {
    const newId = prompt("Enter ID for new service (e.g., 'wet-cupping-plus')");
    if (!newId) return;
    const newService: ServiceData = {
      id: newId,
      title: { en: 'New Service', fr: 'Nouveau', ar: 'جديد', es: 'Nuevo' },
      description: { en: 'Description', fr: 'Description', ar: 'وصف', es: 'Descripción' },
      price: '$0',
      duration: '0 Mins',
      benefits: { en: [], fr: [], ar: [], es: [] }
    };
    setEditingId(newId);
    setEditForm(newService);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-display text-ink">Services Management</h2>
        <button onClick={createNew} className="bg-seal text-white px-6 py-3 flex items-center gap-2 hover:bg-seal-dark text-xs uppercase tracking-widest font-bold shadow-lg hover:-translate-y-1 transition-all">
          <Plus size={16} /> Add New Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
        {services.map((s, idx) => (
          <div key={s.id} className="bg-white border border-ink/5 p-8 shadow-sm hover:shadow-xl transition-all duration-500 relative group animate-fade-up-slow" style={{ animationDelay: `${idx * 50}ms` }}>
            {editingId === s.id && editForm ? (
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-ink/10 pb-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-seal">Editing Mode</span>
                    <button onClick={() => setEditingId(null)} className="text-ink/40 hover:text-ink"><X size={16} /></button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-ink/40">Price</label>
                      <input className="w-full border-b border-ink/20 py-2 font-serif text-lg focus:border-seal outline-none" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} placeholder="$0" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-ink/40">Duration</label>
                      <input className="w-full border-b border-ink/20 py-2 font-serif text-lg focus:border-seal outline-none" value={editForm.duration} onChange={e => setEditForm({...editForm, duration: e.target.value})} placeholder="0 Mins" />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {['en', 'fr', 'ar', 'es'].map(lang => (
                    <div key={lang} className="p-4 bg-paper-dark/50 border border-ink/5 relative group/lang transition-colors hover:bg-white hover:border-seal/20">
                      <div className="absolute top-2 right-2 text-[10px] font-bold uppercase opacity-30">{lang}</div>
                      <input 
                        className="w-full bg-transparent border-b border-transparent group-hover/lang:border-ink/10 py-1 mb-2 text-sm font-bold text-ink focus:border-seal outline-none transition-colors" 
                        value={(editForm.title as any)[lang]} 
                        onChange={e => setEditForm({...editForm, title: {...editForm.title, [lang]: e.target.value} as LocalizedString})} 
                        placeholder="Title" 
                      />
                      <textarea 
                        className="w-full bg-transparent border-b border-transparent group-hover/lang:border-ink/10 py-1 text-xs text-ink/70 resize-none focus:border-seal outline-none transition-colors" 
                        value={(editForm.description as any)[lang]} 
                        onChange={e => setEditForm({...editForm, description: {...editForm.description, [lang]: e.target.value} as LocalizedString})} 
                        placeholder="Description" 
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-ink/5">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-ink/60 hover:text-ink">Cancel</button>
                  <button onClick={handleSave} className="px-6 py-3 bg-seal text-white flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-seal-dark shadow-md"><Save size={14} /> Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display text-2xl text-ink group-hover:text-seal transition-colors">{s.title.en}</h3>
                    <div className="bg-paper-dark px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-ink/40 border border-ink/5 rounded-sm">{s.id}</div>
                </div>
                
                <p className="opacity-70 italic font-serif text-lg leading-relaxed mb-6 flex-grow">{s.description.en}</p>
                
                <div className="flex items-center gap-4 mb-8 pt-4 border-t border-ink/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-ink/30">Price</span>
                        <span className="font-sans font-bold text-seal">{s.price}</span>
                    </div>
                    <div className="w-[1px] h-8 bg-ink/10"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-ink/30">Duration</span>
                        <span className="font-sans font-bold text-ink/70">{s.duration}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                   <button onClick={() => handleEdit(s)} className="flex-1 py-2 border border-ink/10 hover:border-seal hover:text-seal font-bold text-[10px] uppercase tracking-widest transition-colors bg-white">Edit</button>
                   <button onClick={() => deleteDoc(doc(db, 'services', s.id))} className="flex-1 py-2 border border-ink/10 hover:border-red-600 hover:text-red-600 font-bold text-[10px] uppercase tracking-widest transition-colors bg-white">Delete</button>
                </div>
              </div>
            )}
            {/* Hover Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-seal to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sub-component for editing FAQs
const FAQEditor: React.FC<{ faqs: FAQData[], promoteData?: {q: string} | null, clearPromote?: () => void }> = ({ faqs, promoteData, clearPromote }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FAQData | null>(null);

  // Handle promotion from inquiry
  useEffect(() => {
      if (promoteData) {
          createNew(promoteData.q);
          if(clearPromote) clearPromote();
      }
  }, [promoteData]);

  const handleEdit = (faq: FAQData) => {
    setEditingId(faq.id);
    setEditForm({ ...faq });
  };

  const handleSave = async () => {
    if (editForm && editingId) {
      await setDoc(doc(db, 'faqs', editingId), editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const createNew = (initialQuestion?: string) => {
    const newId = Date.now().toString();
    const newFaq: FAQData = {
      id: newId,
      question: { en: initialQuestion || 'New Question', fr: initialQuestion || 'Question', ar: initialQuestion || 'سؤال', es: initialQuestion || 'Pregunta' },
      answer: { en: 'Answer', fr: 'Réponse', ar: 'إجابة', es: 'Respuesta' }
    };
    setEditingId(newId);
    setEditForm(newFaq);
  };

  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-display text-ink">Published FAQs</h2>
        <button onClick={() => createNew()} className="bg-seal text-white px-6 py-3 flex items-center gap-2 hover:bg-seal-dark text-xs uppercase tracking-widest font-bold shadow-lg hover:-translate-y-1 transition-all">
          <Plus size={16} /> Add New FAQ
        </button>
      </div>

      <div className="grid gap-6">
        {editingId && editForm && !faqs.find(f => f.id === editingId) && (
             <div className="bg-white border-l-4 border-seal p-8 shadow-xl mb-12 relative animate-fade-up-slow">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-seal text-white p-1 rounded-full"><Plus size={12} /></div>
                    <span className="text-sm font-bold uppercase tracking-widest text-seal">Drafting New Entry</span>
                </div>
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                    {['en', 'fr', 'ar', 'es'].map(lang => (
                        <div key={lang} className="p-4 bg-paper-dark border border-ink/5 relative">
                        <div className="absolute top-2 right-2 text-[10px] font-bold uppercase opacity-40">{lang}</div>
                        <input 
                            className="w-full bg-transparent border-b border-ink/10 mb-3 text-sm font-bold py-2 focus:border-seal outline-none" 
                            value={(editForm.question as any)[lang]} 
                            onChange={e => setEditForm({...editForm, question: {...editForm.question, [lang]: e.target.value} as LocalizedString} as FAQData)} 
                            placeholder="Question" 
                        />
                        <textarea 
                            className="w-full bg-transparent border-b border-ink/10 text-sm py-2 focus:border-seal outline-none resize-none" 
                            value={(editForm.answer as any)[lang]} 
                            onChange={e => setEditForm({...editForm, answer: {...editForm.answer, [lang]: e.target.value} as LocalizedString} as FAQData)} 
                            placeholder="Answer" 
                            rows={3}
                        />
                        </div>
                    ))}
                    </div>

                    <div className="flex gap-3 justify-end mt-4">
                    <button onClick={() => setEditingId(null)} className="px-6 py-3 border border-ink/10 text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors">Discard</button>
                    <button onClick={handleSave} className="px-6 py-3 bg-seal text-white flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-seal-dark shadow-md"><Save size={14} /> Publish to Site</button>
                    </div>
                </div>
             </div>
        )}

        {faqs.map((f, idx) => (
          <div key={f.id} className="bg-white border border-ink/5 p-8 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up-slow group" style={{ animationDelay: `${idx * 50}ms` }}>
            {editingId === f.id && editForm ? (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b border-ink/10 pb-4 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-seal">Editing Mode</span>
                    <button onClick={() => setEditingId(null)} className="text-ink/40 hover:text-ink"><X size={16} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['en', 'fr', 'ar', 'es'].map(lang => (
                    <div key={lang} className="p-4 bg-paper-dark/50 border border-ink/5 relative">
                      <div className="absolute top-2 right-2 text-[10px] font-bold uppercase opacity-30">{lang}</div>
                      <input 
                        className="w-full bg-transparent border-b border-ink/10 mb-3 text-sm font-bold py-2 focus:border-seal outline-none" 
                        value={(editForm.question as any)[lang]} 
                        onChange={e => setEditForm({...editForm, question: {...editForm.question, [lang]: e.target.value} as LocalizedString} as FAQData)} 
                        placeholder="Question" 
                      />
                      <textarea 
                        className="w-full bg-transparent border-b border-ink/10 text-sm py-2 focus:border-seal outline-none resize-none" 
                        value={(editForm.answer as any)[lang]} 
                        onChange={e => setEditForm({...editForm, answer: {...editForm.answer, [lang]: e.target.value} as LocalizedString} as FAQData)} 
                        placeholder="Answer" 
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end mt-4">
                  <button onClick={() => setEditingId(null)} className="px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-ink/60 hover:text-ink">Cancel</button>
                  <button onClick={handleSave} className="px-6 py-3 bg-seal text-white flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold hover:bg-seal-dark shadow-md"><Save size={14} /> Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-8">
                  <div className="flex items-start gap-4">
                     <span className="text-seal font-serif text-2xl font-bold italic opacity-30">Q.</span>
                     <h3 className="font-bold text-lg text-ink pt-1 group-hover:text-seal transition-colors">{f.question.en}</h3>
                  </div>
                  <div className="flex items-start gap-4 mt-3">
                     <span className="text-ink font-serif text-2xl font-bold italic opacity-10">A.</span>
                     <p className="opacity-70 italic font-serif leading-relaxed text-lg pt-1">{f.answer.en}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleEdit(f)} className="p-2 border border-ink/10 text-ink/60 hover:text-seal hover:border-seal transition-colors bg-paper-dark"><Settings size={14} /></button>
                   <button onClick={() => deleteDoc(doc(db, 'faqs', f.id))} className="p-2 border border-ink/10 text-ink/60 hover:text-red-600 hover:border-red-600 transition-colors bg-paper-dark"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
