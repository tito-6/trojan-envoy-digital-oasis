import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from './skeleton';
import { motion, AnimatePresence } from 'framer-motion';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lowResSrc?: string;
  className?: string;
}

export function ProgressiveImage({
  src,
  alt,
  lowResSrc,
  className,
  ...props
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || src);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setCurrentSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            <Skeleton className="h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.img
        {...props}
        src={currentSrc}
        alt={alt}
        className={cn(
          'w-full transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          error ? 'grayscale' : '',
          className
        )}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ 
          scale: isLoading ? 1.1 : 1,
          opacity: isLoading ? 0 : 1
        }}
        transition={{ duration: 0.4 }}
        onError={() => setError(true)}
        loading="lazy"
        decoding="async"
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <p className="text-sm text-muted-foreground">Failed to load image</p>
        </div>
      )}
    </div>
  );
}