import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
        setReadingProgress(currentProgress);
        // Hiện thanh tiến độ khi người dùng bắt đầu cuộn quá 20px
        setIsVisible(scrollY > 20);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Khởi tạo trạng thái ban đầu
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id="reading-progress-container"
      role="progressbar"
      aria-label="Tiến độ đọc tài liệu chứng cứ"
      aria-valuenow={Math.round(readingProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`fixed top-0 left-0 right-0 z-50 h-[3px] bg-neutral-200/60 pointer-events-none transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        id="reading-progress-indicator"
        className="h-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-amber-600 transition-[width] duration-150 ease-out shadow-xs"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}
