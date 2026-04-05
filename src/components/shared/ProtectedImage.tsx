'use client';

import Image, { ImageProps } from 'next/image';
import { getProtectedImageUrl } from '@/lib/cloudinary-client';

interface ProtectedImageProps extends Omit<ImageProps, 'src'> {
  publicId: string;
}

export default function ProtectedImage({
  publicId,
  alt,
  className,
  ...props
}: ProtectedImageProps) {
  const protectedUrl = getProtectedImageUrl(publicId);
  const preventDefault = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div
      className={`relative inline-block overflow-hidden select-none ${className || ''}`}
      onContextMenu={preventDefault}
    >
      <Image
        className="pointer-events-none block"
        src={protectedUrl}
        {...props}
        alt={alt}
        draggable={false}
      />
      <div
        className="absolute inset-0 z-10 bg-transparent cursor-default"
        aria-hidden="true"
        onContextMenu={preventDefault}
      />
    </div>
  );
}
