import { EvidenceBlock } from '../types';
import { EvidenceImageCard } from './EvidenceImageCard';

interface EvidenceBlockSectionProps {
  key?: string;
  block: EvidenceBlock;
  onOpenZoom?: (src: string, alt: string) => void;
}

export function EvidenceBlockSection({ block, onOpenZoom }: EvidenceBlockSectionProps) {
  const isMultipleImages = block.images.length > 1;

  return (
    <section
      id={block.id}
      className="bg-white rounded-2xl p-5 sm:p-8 md:p-10 border border-neutral-200/80 shadow-sm transition-shadow duration-300 hover:shadow"
    >
      <header className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mb-3">
          {block.title}
        </h2>
        <p className="text-neutral-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
          {block.description}
        </p>
      </header>

      <div
        className={
          isMultipleImages
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6 items-start'
            : 'w-full max-w-4xl mx-auto flex flex-col items-center'
        }
      >
        {block.images.map((img, idx) => (
          <EvidenceImageCard
            key={`${block.id}-${idx}`}
            src={img.src}
            filename={img.filename}
            alt={img.alt}
            label={img.label}
            onOpenZoom={onOpenZoom}
          />
        ))}
      </div>
    </section>
  );
}
