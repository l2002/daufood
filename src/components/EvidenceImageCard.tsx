import { useState, useMemo } from 'react';

interface EvidenceImageCardProps {
  key?: string;
  src?: string;
  filename: string;
  alt: string;
  label?: string;
  onOpenZoom?: (src: string, alt: string) => void;
}

export function EvidenceImageCard({ src, filename, alt, label, onOpenZoom }: EvidenceImageCardProps) {
  // Generate candidate URL paths to check for the image file
  const candidateUrls = useMemo(() => {
    const urls: string[] = [];

    // If explicit src is provided, place it first
    if (src) {
      urls.push(src);
    }

    const baseNames = [
      filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase(),
      filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').toLowerCase(),
      filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '').toLowerCase(),
      filename.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(),
      filename,
      filename.toLowerCase(),
    ];

    const uniqueBaseNames = Array.from(new Set(baseNames));

    for (const name of uniqueBaseNames) {
      const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
      const rawRoot = name.replace(/\.(jpg|jpeg|png|webp)$/i, '');

      for (const ext of extensions) {
        const fileWithExt = `${rawRoot}${ext}`;
        urls.push(`/images/${fileWithExt}`);
        urls.push(`/images/${encodeURIComponent(fileWithExt)}`);
        urls.push(`/${fileWithExt}`);
        urls.push(`/${encodeURIComponent(fileWithExt)}`);
        urls.push(`/assets/aistudio/${fileWithExt}`);
        urls.push(`/assets/aistudio/${encodeURIComponent(fileWithExt)}`);
      }
    }

    return Array.from(new Set(urls));
  }, [src, filename]);

  const [urlIndex, setUrlIndex] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const handleImageError = () => {
    if (urlIndex < candidateUrls.length - 1) {
      setUrlIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  const handleImageLoad = () => {
    setHasLoaded(true);
    setHasFailedAll(false);
  };

  const currentSrc = candidateUrls[urlIndex];

  return (
    <div className="w-full flex flex-col items-center">
      {label && (
        <div className="text-sm font-semibold text-neutral-600 mb-2 self-start tracking-wide">
          {label}
        </div>
      )}

      <div
        className="w-full bg-white rounded-xl border border-neutral-200/90 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer group relative"
        onClick={() => {
          if (hasLoaded && currentSrc && onOpenZoom) {
            onOpenZoom(currentSrc, alt);
          }
        }}
      >
        {!hasFailedAll ? (
          <div className="relative w-full flex justify-center bg-neutral-100/40 p-2 sm:p-4 min-h-[140px] items-center">
            {!hasLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-100/70 z-10">
                <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={currentSrc}
              alt={alt}
              referrerPolicy="no-referrer"
              loading="lazy"
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={`w-full max-h-[85vh] object-contain rounded-lg transition-transform duration-200 group-hover:scale-[1.005] ${
                hasLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        ) : (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center bg-neutral-50/90 border border-neutral-200 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-200/60">
              <svg
                className="w-5 h-5 text-neutral-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-800 mb-1">
              Ảnh chứng cứ: <span className="text-neutral-950 font-bold">{filename}</span>
            </p>
            <p className="text-xs text-neutral-500 max-w-md leading-relaxed">
              Tài liệu chứng cứ lưu trữ hồ sơ giải quyết quyền lợi lao động
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
