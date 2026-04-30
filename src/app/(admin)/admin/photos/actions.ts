'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { uploadImage } from '@/lib/upload-image';
import cloudinary from '@/lib/cloudinary';

// UPLOAD PHOTO
export async function uploadPhotoAction(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  if (!file || file.size === 0) return { error: 'Empty file' };
  if (!projectId) return { error: 'Project required' };

  // CHECK PROJECT EXISTS
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!projectExists) return { error: 'Project not found' };

  try {
    // UPLOAD TO CLOUDINARY
    const upload = await uploadImage(file, `Lithium_gallery/${projectId}`);

    // SAVE PHOTO TO DB
    await prisma.photo.create({
      data: {
        url: upload.url,
        secureUrl: upload.secureUrl,
        publicId: upload.publicId,
        width: upload.width,
        height: upload.height,
        format: upload.format ?? 'jpg',
        projectId,
        title: file.name,
      },
    });

    // REVALIDATE CACHE
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/photos');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Upload failed' };
  }
}

// DELETE PHOTO
export async function deletePhotoAction(photoId: string) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  // VALIDATE ID
  const idCheck = z.string().cuid().safeParse(photoId);
  if (!idCheck.success) return { error: 'Invalid ID' };

  // FIND PHOTO
  const photo = await prisma.photo.findUnique({
    where: { id: idCheck.data },
  });

  // DELETE FROM CLOUDINARY
  if (photo?.publicId) {
    await cloudinary.uploader.destroy(photo.publicId);
  }

  // DELETE FROM DB
  await prisma.photo.delete({
    where: { id: idCheck.data },
  });

  // REVALIDATE CACHE
  revalidatePath('/admin/photos');

  return { success: true };
}
