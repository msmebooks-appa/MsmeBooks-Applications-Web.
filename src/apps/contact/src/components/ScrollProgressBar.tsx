import React, { useState, useEffect } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const maxScroll = docHeight - windowHeight;

          if (maxScroll > 0) {
            const currentProgress = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
            setScrollProgress(currentProgress);
            setIsVisible(scrollY > 15);
          } else {
            setScrollProgress(0);
            setIsVisible(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
      className={`fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background track (subtle translucent line) */}
      <div className="absolute inset-0 bg-slate-200/30 dark:bg-slate-800/40" />

      {/* Dynamic Progress fill with brand corporate blue to lemon green gradient */}
      <div
        className="h-full bg-gradient-to-r from-[#0B3B82] via-[#2563EB] to-[#70C038] transition-[width] duration-100 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Leading edge light glow */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#70C038] shadow-[0_0_8px_#70C038,0_0_3px_#fff] opacity-90"
          style={{ display: scrollProgress > 1 && scrollProgress < 99.8 ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
};
