import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Quay lại đầu trang"
      title="Quay lại đầu trang"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-950 text-white text-xs font-semibold shadow-lg hover:shadow-xl backdrop-blur-xs border border-neutral-700/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group"
    >
      <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="hidden sm:inline">Quay lại đầu</span>
    </button>
  );
}
