"use client";

import { useEffect, useRef, useState } from "react";

export function LandingCardScanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scanPosition, setScanPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, 
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      ));
      
      setScanPosition(scrollProgress * 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Scanner Line Effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, 
            transparent ${scanPosition - 5}%, 
            rgba(255, 255, 255, 0.1) ${scanPosition}%, 
            transparent ${scanPosition + 5}%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
          استكشف الأدوات
        </h2>
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto">
          مجموعة متكاملة من الأدوات الإبداعية المدعومة بالذكاء الاصطناعي
        </p>
      </div>
    </div>
  );
}
