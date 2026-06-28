'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { uploadImage } from '@/lib/upload-image';

// UPLOAD PHOTO ACTION
export async function uploadPhotoAction(formData: FormData) {
  // AUTH CHECK
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  // DATA EXTRACTION
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string | null;

  if (!file || file.size === 0) return { error: 'Empty file' };

  try {
    // PROJECT VALIDATION
    if (projectId) {
      const projectExists = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!projectExists) return { error: 'Project not found' };
    }

    // IMAGE UPLOAD SERVICE
    const upload = await uploadImage(
      file,
      `Lithium_gallery/${projectId || 'general'}`,
    );

    // DATABASE RECORD CREATION
    await prisma.photo.create({
      data: {
        url: upload.url,
        secureUrl: upload.secureUrl,
        publicId: upload.publicId,
        width: upload.width,
        height: upload.height,
        format: upload.format ?? 'jpg',
        projectId: projectId || null,
        title: file.name,
      },
    });

    // REVALIDATION
    revalidatePath('/admin/photos');
    if (projectId) revalidatePath(`/admin/projects/${projectId}`);

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Upload failed' };
  }
}

// DELETE PHOTO ACTION
export async function deletePhotoAction(photoId: string) {
  // AUTH CHECK
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  // ID VALIDATION
  const idCheck = z.string().cuid().safeParse(photoId);
  if (!idCheck.success) return { error: 'Invalid ID' };

  // FETCH EXISTING DATA
  const photo = await prisma.photo.findUnique({
    where: { id: idCheck.data },
  });

  // CLOUDINARY STORAGE CLEANUP
  if (photo?.publicId) {
    const cloudinary = await import('@/lib/cloudinary');
    await cloudinary.default.uploader.destroy(photo.publicId);
  }

  // DATABASE RECORD DELETION
  await prisma.photo.delete({
    where: { id: idCheck.data },
  });

  // REVALIDATION
  revalidatePath('/admin/photos');

  return { success: true };
}
