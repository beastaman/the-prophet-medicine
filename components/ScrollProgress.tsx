import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setWidth(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-brand-charcoal">
      <div 
        className="h-full bg-gradient-to-r from-brand-goldDark via-brand-gold to-brand-goldLight transition-all duration-100 ease-out"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgress;
