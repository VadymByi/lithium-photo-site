// IMPORTS
import { prisma } from '@/lib/prisma';
import { uploadImage } from './upload-image';

// PHOTO CREATION UTILITY
export async function createPhotoFromFile(
  file: File,
  folder: string,
  projectId?: string,
) {
  // EXTERNAL STORAGE UPLOAD
  const upload = await uploadImage(file, folder);

  // DATABASE RECORD CREATION
  const photo = await prisma.photo.create({
    data: {
      publicId: upload.publicId,
      url: upload.url,
      secureUrl: upload.secureUrl,
      width: upload.width,
      height: upload.height,
      format: upload.format ?? 'jpg',
      projectId: projectId ?? null,
    },
  });

  return photo;
}
