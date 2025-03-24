'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Film } from 'lucide-react';

interface MoviePosterProps {
  tconst: string;
  title: string;
  isRevealed?: boolean;
  className?: string;
}

export default function MoviePoster({ tconst, title, isRevealed = true, className = "w-48 h-72" }: MoviePosterProps) {
  const [hasError, setHasError] = useState(false);

  if (!isRevealed) {
    return (
      <div className={`relative flex-shrink-0 ${className}`}>
        <div className="absolute inset-0 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
          <Film className="w-1/4 h-1/4 text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <div className="absolute inset-0 bg-muted rounded-lg overflow-hidden">
        {!hasError ? (
          <Image
            src={`/posters/${tconst}.jpg`}
            alt={`Plakat filmu ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-1/4 h-1/4 text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
} 