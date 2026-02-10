import React, { useEffect, useRef, useState } from 'react';

const InkCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    
    // Position tracking
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (cursor) {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a') || 
        target.classList.contains('cursor-pointer');
      
      setIsHovering(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation Loop for Ring Lag
    let rafId: number;
    const animate = () => {
      // Lerp for smooth following
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Main Dot Cursor */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-300 mix-blend-multiply ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
         <div className={`w-3 h-3 bg-seal rounded-full transition-all duration-300 ${isHovering ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}></div>
      </div>

      {/* Trailing Ring */}
      <div 
        ref={ringRef}
        className={`fixed top-0 left-0 z-[9999] pointer-events-none transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div 
          className={`
            border-2 rounded-full transition-all duration-300 ease-out
            ${isHovering 
              ? 'w-12 h-12 border-seal bg-seal/5' 
              : 'w-8 h-8 border-seal/40 bg-transparent'}
          `}
        ></div>
      </div>
    </>
  );
};

export default InkCursor;