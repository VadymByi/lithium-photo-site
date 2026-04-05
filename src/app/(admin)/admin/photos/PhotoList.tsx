'use client';

import ProtectedImage from '@/components/shared/ProtectedImage';
import { deletePhotoAction } from './actions';

interface Photo {
  id: string;
  publicId: string;
  projectId: string;
}
interface PhotoListProps {
  photos: Photo[];
}

export default function PhotoList({ photos }: PhotoListProps) {
  const handleDelete = async (id: string, publicId: string) => {
    if (confirm('Delete this photo?')) {
      await deletePhotoAction(id, publicId);
    }
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {photos.map((photo) => {
        return (
          <div
            key={photo.id}
            className="group relative border rounded-lg overflow-hidden"
          >
            <ProtectedImage
              publicId={photo.publicId}
              alt="Photo"
              className="aspect-square object-cover"
              width={300}
              height={300}
            />
            <button
              onClick={() => handleDelete(photo.id, photo.publicId)}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-md opacity-0 z-20 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
