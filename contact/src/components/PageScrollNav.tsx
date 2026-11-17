import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SectionTarget {
  id: string;
  labelKey: string;
  fallbackLabel: string;
}

export const PageScrollNav: React.FC = () => {
  const { language } = useLanguage();
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const sections: SectionTarget[] = useMemo(
    () => [
      { id: 'hero', labelKey: 'hero', fallbackLabel: 'Overview' },
      { id: 'quick-options', labelKey: 'quick', fallbackLabel: 'Quick Contact' },
      { id: 'security-compliance', labelKey: 'security', fallbackLabel: 'Security & Compliance' },
      { id: 'contact-form', labelKey: 'form', fallbackLabel: 'Send Message' },
      { id: 'direct-contact', labelKey: 'direct', fallbackLabel: 'Direct Channels' },
      { id: 'pan-africa', labelKey: 'presence', fallbackLabel: 'Pan-African Hubs' },
      { id: 'success-stories', labelKey: 'stories', fallbackLabel: 'Client Stories' },
      { id: 'partnerships', labelKey: 'partnerships', fallbackLabel: 'Partnerships' },
      { id: 'help-centre', labelKey: 'resources', fallbackLabel: 'Help Centre' },
      { id: 'faqs', labelKey: 'faq', fallbackLabel: 'FAQs' },
      { id: 'final-cta', labelKey: 'cta', fallbackLabel: 'Get Started' },
      { id: 'footer', labelKey: 'footer', fallbackLabel: 'Footer' },
    ],
    []
  );

  // Localized section labels
  const getSectionLabel = useCallback((id: string, fallback: string) => {
    const labels: Record<string, Record<string, string>> = {
      hero: { en: 'Overview', fr: 'Aperçu', pt: 'Visão Geral', es: 'Inicio' },
      'quick-options': { en: 'Quick Contact', fr: 'Contact Rapide', pt: 'Contacto Rápido', es: 'Contacto Rápido' },
      'security-compliance': { en: 'Security & Compliance', fr: 'Sécurité & Conformité', pt: 'Segurança & Conformidade', es: 'Seguridad y Cumplimiento' },
      'contact-form': { en: 'Send Message', fr: 'Envoyer Message', pt: 'Enviar Mensagem', es: 'Enviar Mensaje' },
      'direct-contact': { en: 'Direct Touchpoints', fr: 'Canaux Directs', pt: 'Canais Diretos', es: 'Canales Directos' },
      'pan-africa': { en: 'Pan-Africa', fr: 'Panafricain', pt: 'Pan-Africano', es: 'Panafricano' },
      'success-stories': { en: 'Client Stories', fr: 'Témoignages', pt: 'Casos Sucesso', es: 'Casos Éxito' },
      partnerships: { en: 'Partnerships', fr: 'Partenariats', pt: 'Parcerias', es: 'Alianzas' },
      'help-centre': { en: 'Help Centre', fr: 'Centre d\'Aide', pt: 'Central de Ajuda', es: 'Centro de Ayuda' },
      faqs: { en: 'FAQs', fr: 'FAQ', pt: 'Perguntas', es: 'Preguntas' },
      'final-cta': { en: 'Get Started', fr: 'Commencer', pt: 'Começar', es: 'Comenzar' },
      footer: { en: 'Footer', fr: 'Pied de page', pt: 'Rodapé', es: 'Pie de página' },
    };
    return labels[id]?.[language] || fallback;
  }, [language]);

  // Track active section and scroll metrics
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const docHeight = document.documentElement.scrollHeight;
          const maxScroll = docHeight - windowHeight;

          // Progress calculation
          const progress = maxScroll > 0 ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100)) : 0;
          setScrollProgress(Math.round(progress));

          setIsAtTop(scrollY <= 40);
          setIsAtBottom(scrollY >= maxScroll - 40);

          // Find current section in viewport
          const viewportMid = scrollY + windowHeight * 0.35;
          let currentId = sections[0].id;

          for (const section of sections) {
            const el = document.getElementById(section.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              const elTop = rect.top + scrollY;
              if (elTop <= viewportMid) {
                currentId = section.id;
              }
            }
          }

          setActiveSectionId(currentId);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Scroll to a specific section by ID with header offset
  const scrollToSection = (id: string) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70; // approximate navbar height
      const targetPosition = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  // Up Button handler: navigate to previous section or top
  const handleScrollUp = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      scrollToSection(prevSection.id);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Down Button handler: navigate to next section or bottom
  const handleScrollDown = () => {
    const currentIndex = sections.findIndex((s) => s.id === activeSectionId);
    if (currentIndex >= 0 && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      scrollToSection(nextSection.id);
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  const activeIndex = sections.findIndex((s) => s.id === activeSectionId);
  const prevSectionName = activeIndex > 0 ? getSectionLabel(sections[activeIndex - 1].id, sections[activeIndex - 1].fallbackLabel) : 'Top of page';
  const nextSectionName = activeIndex < sections.length - 1 ? getSectionLabel(sections[activeIndex + 1].id, sections[activeIndex + 1].fallbackLabel) : 'Bottom of page';

  return (
    <>
      {/* Desktop/Tablet Left-Side Navigation Bar */}
      <aside
        aria-label="Page navigation"
        className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-40 select-none hidden sm:flex flex-col items-center"
      >
        <div className="bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/10 flex flex-col items-center gap-1.5 transition-all duration-300">
        {/* Scroll to Top (Quick jump if scrolled down) */}
        {!isAtTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Jump to top of landing page"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0B3B82] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group relative"
            title="Jump to Top"
          >
            <ChevronsUp className="w-3.5 h-3.5" />
            <span className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-50">
              Jump to Top
            </span>
          </button>
        )}

        {/* Up Button: Previous Section */}
        <button
          onClick={handleScrollUp}
          disabled={isAtTop}
          aria-label={`Scroll up to ${prevSectionName}`}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all group relative ${
            isAtTop
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              : 'text-slate-700 dark:text-slate-200 hover:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-[#0B3B82] dark:hover:bg-[#1D4ED8] shadow-xs active:scale-95'
          }`}
        >
          <ChevronUp className="w-5 h-5 stroke-[2.2]" />
          {!isAtTop && (
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-50 flex items-center gap-1.5">
              <span>Up:</span>
              <span className="text-[#a1e670] font-semibold">{prevSectionName}</span>
            </span>
          )}
        </button>

        {/* Vertical Section Indicator Track & Dots */}
        <div className="py-2 flex flex-col items-center gap-1.5 my-0.5">
          {sections.map((section, idx) => {
            const isActive = section.id === activeSectionId;
            const label = getSectionLabel(section.id, section.fallbackLabel);

            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                aria-label={`Jump to section ${idx + 1}: ${label}`}
                aria-current={isActive ? 'true' : undefined}
                className="group relative flex items-center justify-center py-0.5 focus:outline-none"
              >
                {/* Dot / Pill indicator */}
                <div
                  className={`transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-2 h-4 bg-[#70C038] shadow-sm shadow-[#70C038]/50 ring-2 ring-[#70C038]/30'
                      : 'w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-[#0B3B82] dark:hover:bg-blue-400 group-hover:scale-125'
                  }`}
                />

                {/* Hover Tooltip (Appears to the right of the left nav) */}
                {(hoveredSection === section.id || (isActive && hoveredSection === null && false)) && (
                  <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold whitespace-nowrap opacity-100 transition-all pointer-events-none shadow-md z-50 flex items-center gap-1.5 border border-slate-700 animate-in fade-in zoom-in-95">
                    <span className="text-[10px] text-slate-400 font-mono">0{idx + 1}</span>
                    <span>{label}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Down Button: Next Section */}
        <button
          onClick={handleScrollDown}
          disabled={isAtBottom}
          aria-label={`Scroll down to ${nextSectionName}`}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all group relative ${
            isAtBottom
              ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-40'
              : 'text-slate-700 dark:text-slate-200 hover:text-white bg-slate-100/80 dark:bg-slate-800 hover:bg-[#0B3B82] dark:hover:bg-[#1D4ED8] shadow-xs active:scale-95'
          }`}
        >
          <ChevronDown className="w-5 h-5 stroke-[2.2]" />
          {!isAtBottom && (
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-50 flex items-center gap-1.5">
              <span>Down:</span>
              <span className="text-[#a1e670] font-semibold">{nextSectionName}</span>
            </span>
          )}
        </button>

        {/* Scroll to Bottom (Quick jump if not at bottom) */}
        {!isAtBottom && (
          <button
            onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
            aria-label="Jump to bottom of landing page"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0B3B82] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group relative"
            title="Jump to Bottom"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
            <span className="absolute left-full ml-3 px-2 py-1 rounded bg-slate-900 text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md z-50">
              Jump to Bottom
            </span>
          </button>
        )}

        {/* Scroll percentage badge */}
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 text-center w-full">
          {scrollProgress}%
        </div>
      </div>
    </aside>

    {/* Mobile Floating Up/Down Navigation (Left Side) */}
    <aside
      aria-label="Mobile page navigation"
      className="fixed bottom-6 left-4 z-40 flex sm:hidden flex-col gap-2 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-900/15"
    >
      <button
        onClick={handleScrollUp}
        disabled={isAtTop}
        aria-label="Scroll up"
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isAtTop
            ? 'text-slate-300 dark:text-slate-700 opacity-40'
            : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 active:bg-[#0B3B82] active:text-white'
        }`}
      >
        <ChevronUp className="w-5 h-5 stroke-[2.4]" />
      </button>

      <div className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 text-center py-0.5">
        {scrollProgress}%
      </div>

      <button
        onClick={handleScrollDown}
        disabled={isAtBottom}
        aria-label="Scroll down"
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
          isAtBottom
            ? 'text-slate-300 dark:text-slate-700 opacity-40'
            : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 active:bg-[#0B3B82] active:text-white'
        }`}
      >
        <ChevronDown className="w-5 h-5 stroke-[2.4]" />
      </button>
    </aside>
  </>
  );
};
