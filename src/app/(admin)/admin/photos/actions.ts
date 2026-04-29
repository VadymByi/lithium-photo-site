'use server';

import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { UploadApiResponse } from 'cloudinary';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// UPLOAD SINGLE PHOTO ACTION
export async function uploadPhotoAction(formData: FormData) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { error: 'Доступ запрещен' };

  // EXTRACT FORM DATA
  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  // BASIC VALIDATION
  if (!file || file.size === 0) return { error: 'Файл пустой или отсутствует' };
  if (!projectId) return { error: 'ID проекта не указан' };

  try {
    // VERIFY PROJECT EXISTS
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projectExists) return { error: 'Указанный проект не найден' };

    // PREPARE FILE BUFFER
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // UPLOAD TO CLOUDINARY
    const uploadResponse = await new Promise<UploadApiResponse>((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `Lithium_gallery/${projectId}`,
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result)
              rej(error || new Error('Cloudinary upload failed'));
            else res(result);
          },
        )
        .end(buffer);
    });

    // SAVE PHOTO RECORD TO DATABASE
    await prisma.photo.create({
      data: {
        url: uploadResponse.url,
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format || 'jpg',
        projectId: projectId,
        title: file.name,
      },
    });

    // REVALIDATE RELATED PATHS
    revalidatePath(`/admin/projects/${projectId}`);
    revalidatePath('/admin/photos');

    return { success: true };
  } catch (error) {
    // ERROR HANDLING
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`Ошибка загрузки файла ${file.name}:`, errorMessage);

    return { error: `Не удалось загрузить ${file.name}` };
  }
}

// DELETE PHOTO ACTION
export async function deletePhotoAction(photoId: string, publicId: string) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { error: 'Доступ запрещен' };

  // VALIDATE INPUT IDS
  const idCheck = z.string().cuid().safeParse(photoId);
  if (!idCheck.success || !publicId) return { error: 'Некорректные ID' };

  try {
    // DELETE FROM CLOUDINARY
    await cloudinary.uploader.destroy(publicId);

    // DELETE FROM DATABASE
    await prisma.photo.delete({
      where: { id: idCheck.data },
    });

    // REVALIDATE RELATED PATHS
    revalidatePath('/admin/photos');
    revalidatePath('/projects');

    return { success: true };
  } catch (error) {
    // ERROR HANDLING
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Delete error:', errorMessage);

    return { error: 'Не удалось удалить фотографию' };
  }
}
