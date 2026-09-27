'use client';

import { PhotoListProps } from '@/types/photo';
import { deletePhotoAction } from './actions';
import PhotoCard from './PhotoCard';

// PHOTO GRID LIST COMPONENT
export default function PhotoList({ photos }: PhotoListProps) {
  // DELETE HANDLER
  const handleDelete = async (id: string, publicId: string) => {
    const confirmed = confirm('Удалить это фото?');

    if (!confirmed) return;

    await deletePhotoAction(id);
  };

  // RENDER GRID
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={handleDelete} />
      ))}
    </div>
  );
}
