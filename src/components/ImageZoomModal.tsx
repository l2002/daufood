import { useEffect } from 'react';

interface ImageZoomModalProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

export function ImageZoomModal({ src, alt, onClose }: ImageZoomModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (src) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [src, onClose]);

  if (!src) return null;

  return (
    <div
      id="image-zoom-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 transition-opacity cursor-zoom-out"
      onClick={onClose}
    >
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="max-w-full max-h-[92vh] object-contain rounded-lg shadow-2xl"
          onClick={onClose}
        />
      </div>
    </div>
  );
}
