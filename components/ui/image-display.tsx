"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageDisplayProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function ImageDisplay({ 
  src, 
  alt, 
  width, 
  height, 
  className = "",
  fill = false,
  objectFit = "cover"
}: ImageDisplayProps) {
  const [error, setError] = useState(false);

  if (!src || src.trim() === "") {
    return null;
  }

  // Проверяем, является ли src base64 data URL
  const isBase64 = src.startsWith("data:image");

  if (isBase64) {
    // Для base64 используем обычный img тег з lazy loading
    if (fill) {
      return (
        <div className={`relative w-full h-full ${className}`} style={{ width: '100%', height: '100%' }}>
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: objectFit,
              display: 'block'
            }}
            onError={() => setError(true)}
          />
        </div>
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit }}
        loading="lazy"
        onError={() => setError(true)}
      />
    );
  }

  // Для обычных URL используем Next.js Image
  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-400 text-sm">Помилка завантаження</span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative ${className}`} style={{ width: '100%', height: '100%' }}>
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-${objectFit}`}
          style={{ objectFit }}
          onError={() => setError(true)}
          unoptimized={src.startsWith('/')}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 200}
      height={height || 200}
      className={className}
      style={{ objectFit }}
      onError={() => setError(true)}
      unoptimized={src.startsWith('/') && !src.startsWith('/images')}
      loading="lazy"
    />
  );
}

