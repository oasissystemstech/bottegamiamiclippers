import React, { useState, useEffect } from 'react';
import { UtensilsCrossed, Wine, Sparkles, Scissors, Image as ImageIcon } from 'lucide-react';

interface AppImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
  priority?: boolean;
  departmentIcon?: 'restaurant' | 'bar' | 'salon' | 'barbershop' | 'brand';
  showMonogramOnFallback?: boolean;
  containerClassName?: string;
}

/**
 * Normalizes image paths to ensure production Vite/Vercel compatibility.
 * Strips accidental "/public/" or "public/" prefixes because Vite serves
 * the public directory directly from the root web path ("/").
 */
export function normalizeImagePath(path?: string | null): string {
  if (!path) return '';
  const trimmed = path.trim();
  
  // Strip redundant /public/ or public/ prefix
  if (trimmed.startsWith('/public/')) {
    return trimmed.replace('/public/', '/');
  }
  if (trimmed.startsWith('public/')) {
    return trimmed.replace('public/', '/');
  }
  
  return trimmed;
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/brand/bottega-logo.jpeg',
  priority = false,
  departmentIcon = 'brand',
  showMonogramOnFallback = true,
  className = '',
  containerClassName = '',
  onError,
  onLoad,
  ...rest
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => normalizeImagePath(src));
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    const normalized = normalizeImagePath(src);
    setResolvedSrc(normalized);
    setHasError(false);
    setIsLoaded(false);
    setTriedFallback(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (import.meta.env.DEV) {
      console.warn(`[AppImage] Failed to load image: "${resolvedSrc}". Falling back to branded display.`, { originalSrc: src, alt });
    }

    const normalizedFallback = normalizeImagePath(fallbackSrc);
    if (!triedFallback && normalizedFallback && normalizedFallback !== resolvedSrc) {
      setTriedFallback(true);
      setResolvedSrc(normalizedFallback);
    } else {
      setHasError(true);
    }

    if (onError) onError(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const renderIcon = () => {
    switch (departmentIcon) {
      case 'restaurant':
        return <UtensilsCrossed className="w-6 h-6 text-[#7B2635]" />;
      case 'bar':
        return <Wine className="w-6 h-6 text-[#B38A45]" />;
      case 'salon':
        return <Sparkles className="w-6 h-6 text-[#C85B35]" />;
      case 'barbershop':
        return <Scissors className="w-6 h-6 text-[#28201E]" />;
      default:
        return <ImageIcon className="w-6 h-6 text-[#7B2635]" />;
    }
  };

  // If permanently errored or no source provided, show the branded placeholder
  if (hasError || !resolvedSrc) {
    return (
      <div 
        className={`w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center bg-[#EDE3D5] border border-[#DDD1C0] rounded-xl select-none ${containerClassName}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-12 h-12 rounded-full bg-[#F5F0E8] border border-[#B38A45]/40 flex items-center justify-center shadow-xs mb-2">
          {renderIcon()}
        </div>
        {showMonogramOnFallback && (
          <span className="font-serif text-xs font-semibold text-[#7B2635] tracking-widest uppercase">
            Bottega · Miami Clipper
          </span>
        )}
        <p className="text-[11px] text-[#6B5E59] font-medium mt-1 line-clamp-1 max-w-[200px]">
          {alt}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {/* Smooth Shimmer / Skeleton while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#EDE3D5] animate-pulse" aria-hidden="true" />
      )}
      
      <img
        src={resolvedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </div>
  );
};

export default AppImage;
