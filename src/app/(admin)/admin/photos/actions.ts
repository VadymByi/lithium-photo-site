'use server';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { UploadApiResponse } from 'cloudinary';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: 'Access denied' };
  }

  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  if (!file || !projectId) {
    return { error: 'Missing data' };
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse = await new Promise<UploadApiResponse>((res, rej) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'Lithium_gallery',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) rej(error);
            if (!result)
              return rej(new Error('Cloudinary upload failed: No result'));
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
    await prisma.photo.create({
      data: {
        url,
        secureUrl,
        publicId,
        width,
        height,
        format: format || 'jpg',
        projectId,
      },
    });
    revalidatePath('/admin/photos');
    return { success: true };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload image' };
  }
}

export async function deletePhotoAction(photoId: string, publicId: string) {
  console.log('attempt to delete photo:', photoId, publicId);

  const session = await auth();
  if (!session) return { error: 'Not authenticated' };
  try {
    await cloudinary.uploader.destroy(publicId);

    await prisma.photo.delete({ where: { id: photoId } });

    revalidatePath('/admin/photos');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { error: 'Failed to delete photo' };
  }
}
