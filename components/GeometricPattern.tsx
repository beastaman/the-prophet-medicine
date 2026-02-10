import React from 'react';

const GeometricPattern: React.FC<{ className?: string, opacity?: number }> = ({ className = "", opacity = 0.05 }) => {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden ${className}`}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-star" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M30 0 L37 20 L60 20 L42 35 L48 58 L30 45 L12 58 L18 35 L0 20 L23 20 Z" fill="none" stroke="#d4af37" strokeWidth="0.5" transform="scale(0.5) translate(30,30)" />
            <circle cx="30" cy="30" r="1" fill="#d4af37" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star)" style={{ opacity: opacity }} />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black"></div>
    </div>
  );
};

export default GeometricPattern;
