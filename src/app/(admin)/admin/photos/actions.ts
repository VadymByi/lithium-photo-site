'use server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function uploadPhotoAction(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  const file = formData.get('file') as File;
  const projectId = formData.get('projectId') as string;

  if (!file || !projectId) return { error: 'Missing data' };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'Lithium_gallery',
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        )
        .end(buffer);
    });

    await prisma.photo.create({
      data: {
        url: uploadResponse.url,
        secureUrl: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format || 'jpg',
        projectId: projectId,
      },
    });

    revalidatePath('/admin/photos');
    return { success: true };
  } catch (error) {
    console.error('Upload error:', error);
    return { error: 'Failed to upload image' };
  }
}
