'use client';

import { deletePhotoAction } from './actions';
import PhotoCard from './PhotoCard';
import { PhotoListProps } from '@/types/photo';

export default function PhotoList({ photos }: PhotoListProps) {
  const handleDelete = async (id: string, publicId: string) => {
    if (confirm('Delete this photo?')) {
      await deletePhotoAction(id, publicId);
    }
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} onDelete={handleDelete} />
      ))}
    </div>
  );
}
