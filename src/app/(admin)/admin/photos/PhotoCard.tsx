'use client';

import { Photo } from '@/types/photo';
import { useState } from 'react';
import ProtectedImage from '@/components/shared/ProtectedImage';

export default function PhotoCard({
  photo,
  onDelete,
}: {
  photo: Photo;
  onDelete: (id: string, publicId: string) => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInnerDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(photo.id, photo.publicId);
    } catch (error) {
      setIsDeleting(false);
      alert('Could not delete photo. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="group relative border rounded-lg overflow-hidden">
      <div className={isDeleting ? 'opacity-50' : ''}>
        <ProtectedImage
          publicId={photo.publicId}
          alt="Photo"
          className="aspect-square object-cover"
          width={300}
          height={300}
        />
      </div>

      <button
        onClick={handleInnerDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-md opacity-0 z-20 group-hover:opacity-100 transition-opacity disabled:opacity-50"
      >
        {isDeleting ? '...' : 'Delete'}
      </button>
    </div>
  );
}
