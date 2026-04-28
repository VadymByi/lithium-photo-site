'use server';

import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { UploadApiResponse } from 'cloudinary';
import { revalidatePath } from 'next/cache';
import { photoSchema } from '@/lib/schemas';
import { z } from 'zod';

// UPLOAD PHOTO ACTION
export async function uploadPhotoAction(formData: FormData) {
  // AUTH CHECK
  const session = await auth();
  if (!session) {
    return { error: 'Access denied' };
  }

  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  // INPUT VALIDATION (PROJECT + FILE CHECK)
  const validation = photoSchema
    .pick({ projectId: true })
    .safeParse({ projectId });

  if (!validation.success || !file || file.size === 0) {
    return {
      error: 'Invalid data',
      details: !validation.success
        ? validation.error.flatten().fieldErrors
        : 'File is missing or empty',
    };
  }

  try {
    // CONVERT FILE TO BUFFER
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // UPLOAD TO CLOUDINARY
    const uploadResponse = await new Promise<UploadApiResponse>((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'Lithium_gallery',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) rej(error);
            if (!result) rej(new Error('Cloudinary upload failed: No result'));
            else res(result);
          },
        )
        .end(buffer);
    });

    const {
      url,
      secure_url: secureUrl,
      public_id: publicId,
      width,
      height,
      format,
    } = uploadResponse;

    // FINAL VALIDATION BEFORE DB WRITE
    const dbData = photoSchema.safeParse({
      url,
      publicId,
      projectId: validation.data.projectId,
      title: file.name,
    });

    if (!dbData.success) {
      console.error('DB Validation Error:', dbData.error.flatten());
      return { error: 'Data validation failed before DB save' };
    }

    // SAVE TO DATABASE
    await prisma.photo.create({
      data: {
        url: dbData.data.url,
        secureUrl,
        publicId: dbData.data.publicId,
        width,
        height,
        format: format || 'jpg',
        projectId: dbData.data.projectId,
        title: dbData.data.title,
      },
    });

    // CACHE INVALIDATION
    revalidatePath('/admin/photos');
    revalidatePath('/projects');
    revalidatePath(`/projects/${projectId}`);

    return { success: true };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload image' };
  }
}

// DELETE PHOTO ACTION
export async function deletePhotoAction(photoId: string, publicId: string) {
  // AUTH CHECK
  const session = await auth();
  if (!session) return { error: 'Not authenticated' };

  // VALIDATE INPUT IDS
  const idCheck = z.string().cuid().safeParse(photoId);
  if (!idCheck.success || !publicId) {
    return { error: 'Invalid or missing IDs' };
  }

  try {
    // DELETE FROM CLOUDINARY FIRST
    await cloudinary.uploader.destroy(publicId);

    // THEN DELETE FROM DATABASE
    await prisma.photo.delete({
      where: { id: idCheck.data },
    });

    // CACHE INVALIDATION
    revalidatePath('/admin/photos');
    revalidatePath('/projects');

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { error: 'Failed to delete photo' };
  }
}
