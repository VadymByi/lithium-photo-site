'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { uploadImage } from '@/lib/upload-image';

// AUTHENTICATION HELPER
async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

// DATA FETCHING ACTIONS
export async function getAllPhotos() {
  return prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPortfolioItems() {
  return prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
    include: { photo: true },
  });
}

// PORTFOLIO ITEM CREATION
export async function createPortfolioItem(formData: FormData) {
  try {
    await checkAuth();

    const file = formData.get('file') as File | null;
    const photoId = formData.get('photoId') as string | null;

    let finalPhotoId: string;

    // PHOTO PROCESSING LOGIC
    if (file && file.size > 0) {
      const upload = await uploadImage(file, 'portfolio');

      const photo = await prisma.photo.create({
        data: {
          publicId: upload.publicId,
          url: upload.url,
          secureUrl: upload.secureUrl,
          width: upload.width,
          height: upload.height,
          format: upload.format ?? 'jpg',
          projectId: null,
        },
      });

      finalPhotoId = photo.id;
    } else if (photoId) {
      finalPhotoId = photoId;
    } else {
      return { error: 'No photo provided' };
    }

    // ORDERING AND DATABASE RECORD
    const last = await prisma.portfolioItem.findFirst({
      orderBy: { order: 'desc' },
    });

    await prisma.portfolioItem.create({
      data: {
        photoId: finalPhotoId,
        order: last ? last.order + 1 : 0,
      },
    });

    // CACHE REVALIDATION
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Create failed' };
  }
}

// PORTFOLIO ITEM DELETION
export async function deletePortfolioItem(id: string) {
  try {
    await checkAuth();

    await prisma.portfolioItem.delete({
      where: { id },
    });

    // CACHE REVALIDATION
    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');

    return { success: true };
  } catch (e) {
    return { error: 'Delete failed' };
  }
}
