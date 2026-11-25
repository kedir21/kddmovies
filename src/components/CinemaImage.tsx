import { useState } from 'react';
import { Film } from 'lucide-react';

interface CinemaImageProps {
  src?: string;
  alt: string;
  title?: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function CinemaImage({
  src,
  alt,
  title,
  className = '',
  loading = 'lazy',
}: CinemaImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#16191D] via-[#101215] to-[#0B0C0E] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Film className="mb-3 h-7 w-7 text-[#D4AF6A]/60" strokeWidth={1.25} />
        <span className="font-serif text-lg tracking-tight text-[#F5F2EB]/80">
          {title || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#121417] ${className}`}>
      {!loaded && (
        <div
          className="skeleton-shimmer absolute inset-0 z-0"
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
