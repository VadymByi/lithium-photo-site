'use client';

import Image, { ImageProps } from 'next/image';

interface ProtectedImageProps extends ImageProps {
  showShield?: boolean;
}

export const ProtectedImage = ({
  src,
  alt,
  className,
  ...props
}: ProtectedImageProps) => {
  const preventDefault = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div
      className={`relative inline-block overflow-hidden select-none ${className || ''}`}
      onContextMenu={preventDefault}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        draggable={false}
        className="pointer-events-none block"
      />

      <div
        className="absolute inset-0 z-10 bg-transparent cursor-default"
        aria-hidden="true"
        onContextMenu={preventDefault}
      ></div>
    </div>
  );
};

// 'use client';

// import Image, { ImageProps } from 'next/image';
// import { getProtectedImageUrl } from '@/lib/cloudinary';

// interface ProtectedImageProps extends Omit<ImageProps, 'src'> {
//   publicId: string;
// }

// export const ProtectedImage = ({
//   publicId,
//   alt,
//   className,
//   ...props
// }: ProtectedImageProps) => {
//   const protectedUrl = getProtectedImageUrl(publicId);

//   const preventDefault = (e: React.MouseEvent) => e.preventDefault();

//   return (
//     <div
//       className={`relative inline-block overflow-hidden select-none ${className || ''}`}
//       onContextMenu={preventDefault}
//     >
//       <Image
//         {...props}
//         src={protectedUrl}
//         alt={alt}
//         draggable={false}
//         className="pointer-events-none block"
//       />

//       <div
//         className="absolute inset-0 z-10 bg-transparent cursor-default"
//         aria-hidden="true"
//         onContextMenu={preventDefault}
//       ></div>
//     </div>
//   );
// };
