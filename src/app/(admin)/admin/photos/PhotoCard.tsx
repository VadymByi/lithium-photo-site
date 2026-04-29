'use client';

import { useState } from 'react';
import { Photo } from '@/types/photo';
import ProtectedImage from '@/components/shared/ProtectedImage';

interface PhotoCardProps {
  photo: Photo;
  onDelete: (id: string, publicId: string) => Promise<void>;
}

// PHOTO CARD COMPONENT
export default function PhotoCard({ photo, onDelete }: PhotoCardProps) {
  // STATE
  const [isDeleting, setIsDeleting] = useState(false);

  // DELETE HANDLER
  const handleInnerDelete = async () => {
    try {
      setIsDeleting(true);

      await onDelete(photo.id, photo.publicId);
    } catch (error) {
      setIsDeleting(false);

      alert('Не удалось удалить фото. Попробуйте еще раз.');

      console.error(error);
    }
  };

  // RENDER
  return (
    <div className="group relative border rounded-lg overflow-hidden bg-zinc-50">
      {/* IMAGE */}
      <div className={isDeleting ? 'opacity-50' : ''}>
        <ProtectedImage
          publicId={photo.publicId}
          alt={photo.title || 'Photo'}
          className="aspect-square object-cover"
          width={300}
          height={300}
        />
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={handleInnerDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-md opacity-0 z-20 group-hover:opacity-100 transition-opacity disabled:opacity-50"
      >
        {isDeleting ? '...' : 'Удалить'}
      </button>

      {/* OPTIONAL LABEL */}
      {!photo.projectId && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-[10px] text-white px-1.5 py-0.5 rounded backdrop-blur-sm">
          Свободное
        </div>
      )}
    </div>
  );
}
