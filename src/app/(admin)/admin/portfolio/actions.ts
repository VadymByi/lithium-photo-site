'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
};

// AUTH CHECK
async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

// FETCH ALL PHOTOS
export async function getAllPhotos() {
  return prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// FETCH PORTFOLIO ITEMS
export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
    include: { photo: true },
  });
}

// CREATE PORTFOLIO ITEM
export async function createPortfolioItem(formData: FormData) {
  try {
    await checkAuth();

    const file = formData.get('file') as File | null;
    const photoId = formData.get('photoId') as string | null;

    let finalPhotoId: string;

    // HANDLE FILE UPLOAD
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult: CloudinaryUploadResult = await new Promise(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'portfolio' }, (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as CloudinaryUploadResult);
            })
            .end(buffer);
        },
      );

      const createdPhoto = await prisma.photo.create({
        data: {
          publicId: uploadResult.public_id,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url,
          width: uploadResult.width,
          height: uploadResult.height,
          projectId: null,
        },
      });

      finalPhotoId = createdPhoto.id;
    }

    // USE EXISTING PHOTO
    else if (photoId) {
      finalPhotoId = photoId;
    } else {
      return { error: 'Нет фото' };
    }

    // CALCULATE ORDER
    const last = await prisma.portfolioItem.findFirst({
      orderBy: { order: 'desc' },
    });

    const nextOrder = last ? last.order + 1 : 0;

    // CREATE RECORD
    await prisma.portfolioItem.create({
      data: {
        photoId: finalPhotoId,
        order: nextOrder,
      },
    });

    // REVALIDATE CACHE
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Ошибка при создании элемента' };
  }
}

// DELETE PORTFOLIO ITEM
export async function deletePortfolioItem(id: string) {
  try {
    await checkAuth();

    await prisma.portfolioItem.delete({
      where: { id },
    });

    // REVALIDATE CACHE
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Ошибка удаления' };
  }
}
