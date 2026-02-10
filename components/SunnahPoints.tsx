import React from 'react';

// Custom Callout Point Component
const PointCallout: React.FC<{ 
  cx: number; 
  cy: number; 
  label: string; 
  delay?: string; 
  side?: 'left' | 'right';
}> = ({ cx, cy, label, delay = '0s', side = 'right' }) => (
  <div 
    className="absolute group z-30" 
    style={{ 
      left: `${(cx / 300) * 100}%`, 
      top: `${(cy / 500) * 100}%`, 
    }}
  >
    {/* The Point on Body */}
    <div className="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-seal bg-paper shadow-[0_0_10px_rgba(211,47,47,0.3)] cursor-crosshair group-hover:scale-125 transition-transform duration-300 z-20">
      <div className="absolute inset-1 rounded-full bg-seal animate-pulse-slow"></div>
    </div>

    {/* Callout Line & Label */}
    <div className={`absolute top-1/2 -translate-y-1/2 ${side === 'left' ? 'right-6 flex-row-reverse' : 'left-6'} flex items-center pointer-events-none`}>
      {/* Line */}
      <div 
        className={`h-[1px] bg-ink/30 transition-all duration-700 ease-out origin-${side === 'left' ? 'right' : 'left'} ${side === 'left' ? 'w-8 mr-2' : 'w-8 ml-2'} scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100`}
      ></div>
      
      {/* Label Box */}
      <div className={`
        opacity-0 group-hover:opacity-100 transform ${side === 'left' ? 'translate-x-4' : '-translate-x-4'} group-hover:translate-x-0 transition-all duration-700 delay-100
        bg-paper border border-ink/10 px-3 py-1 shadow-sm whitespace-nowrap
      `}>
        <span className="font-serif text-ink text-xs font-bold tracking-widest uppercase">{label}</span>
      </div>
    </div>
  </div>
);

const SunnahPoints: React.FC = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto h-[600px] bg-[#FDFBF7] p-8 flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-ink/5 rounded-sm overflow-hidden group/container">
      
      {/* Vintage Paper Texture Overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")` }}></div>

      {/* Grid Lines for Medical Feel */}
      <div className="absolute inset-0 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Diagram Container */}
      <div className="relative w-full h-full max-w-[300px] max-h-[500px]">
        
        {/* Anatomical Outline (SVG) - Improved artistic style */}
        <svg viewBox="0 0 300 500" className="w-full h-full drop-shadow-sm opacity-90 pointer-events-none">
          <defs>
            <filter id="ink-bleed">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>

          {/* Head & Neck */}
          <path 
            d="M 150 40 C 130 40 110 50 100 80 C 95 100 100 120 110 135"
            fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" filter="url(#ink-bleed)"
          />
          <path 
            d="M 150 40 C 170 40 190 50 200 80 C 205 100 200 120 190 135"
            fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" filter="url(#ink-bleed)"
          />

          {/* Shoulders & Back */}
          <path 
            d="M 110 135 C 80 145 50 155 40 180 C 35 210 40 300 45 350 C 50 420 80 480 150 480"
            fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" filter="url(#ink-bleed)"
          />
          <path 
            d="M 190 135 C 220 145 250 155 260 180 C 265 210 260 300 255 350 C 250 420 220 480 150 480"
            fill="none" stroke="#2a2a2a" strokeWidth="2" strokeLinecap="round" filter="url(#ink-bleed)"
          />
          
          {/* Spine Line (Dashed) */}
          <path d="M 150 140 L 150 400" stroke="#2a2a2a" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />
          
          {/* Shoulder Blades Hint */}
          <path d="M 100 200 Q 80 230 100 260" stroke="#2a2a2a" strokeWidth="0.5" fill="none" opacity="0.2" />
          <path d="M 200 200 Q 220 230 200 260" stroke="#2a2a2a" strokeWidth="0.5" fill="none" opacity="0.2" />

        </svg>

        {/* --- POINTS & CALLOUTS --- */}
        
        {/* 1. Al-Haamah (Top Head) */}
        <PointCallout cx={150} cy={70} label="Al-Haamah" side="right" />

        {/* 2. Al-Kahil (C7 - Base of Neck) */}
        <PointCallout cx={150} cy={150} label="Al-Kahil (C7)" side="left" />

        {/* 3. Al-Akhda'ain (Neck Sides) */}
        <PointCallout cx={115} cy={120} label="Al-Akhda'ain" side="left" />
        <PointCallout cx={185} cy={120} label="Al-Akhda'ain" side="right" />

        {/* 4. Al-Katifain (Upper Back / Shoulders) */}
        <PointCallout cx={90} cy={220} label="Al-Katifain" side="left" />
        <PointCallout cx={210} cy={220} label="Al-Katifain" side="right" />

        {/* 5. Lower Back (Lumbar) */}
        <PointCallout cx={150} cy={350} label="Dahr (Lumbar)" side="right" />

      </div>
      
      {/* Caption */}
      <div className="absolute bottom-6 left-0 w-full text-center">
        <span className="font-display italic text-ink text-lg tracking-wide border-b border-ink/20 pb-1">Fig 1. The Prophetic Points</span>
      </div>
      
      {/* Seal in Corner */}
      <div className="absolute top-6 right-6 opacity-80 mix-blend-multiply">
         <div className="w-16 h-16 border-2 border-seal rounded-full flex items-center justify-center rotate-12">
            <div className="w-14 h-14 border border-seal/50 rounded-full flex items-center justify-center">
                <span className="text-[8px] text-seal uppercase font-bold tracking-widest text-center leading-none">Sunnah<br/>Verified</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default SunnahPoints;