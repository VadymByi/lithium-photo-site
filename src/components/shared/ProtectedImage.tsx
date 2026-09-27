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
      className={`relative select-none overflow-hidden ${props.fill ? 'w-full h-full' : 'inline-block'}`}
      onContextMenu={preventDefault}
    >
      <Image
        // Теперь object-cover (из className) применяется именно к картинке!
        className={`pointer-events-none block ${className || ''}`}
        src={protectedUrl}
        {...props}
        alt={alt}
        draggable={false}
      />
      {/* Прозрачный слой поверх картинки для защиты от перетаскивания и сохранения по правому клику */}
      <div
        className="absolute inset-0 z-10 bg-transparent cursor-default"
        aria-hidden="true"
        onContextMenu={preventDefault}
      />
    </div>
  );
}
