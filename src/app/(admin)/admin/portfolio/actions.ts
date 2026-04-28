'use server';

import { prisma } from '@/lib/prisma';
import { portfolioItemSchema } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { z } from 'zod';

// AUTH CHECK HELPER
async function checkAuth() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

// FETCH PHOTOS NOT IN PORTFOLIO
export async function getAvailablePhotos() {
  try {
    const portfolioItems = await prisma.portfolioItem.findMany({
      select: { photoId: true },
    });

    const portfolioItemIds = portfolioItems.map((item) => item.photoId);

    return await prisma.photo.findMany({
      where: {
        id: { notIn: portfolioItemIds },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching available photos:', error);
    return [];
  }
}

// FETCH PORTFOLIO ITEMS WITH PHOTOS
export async function getPortfolioManagementItems() {
  return await prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
    include: { photo: true },
  });
}

// ADD PHOTO TO PORTFOLIO
export async function addToPortfolio(photoId: string) {
  try {
    await checkAuth();

    // VALIDATE INPUT
    const result = portfolioItemSchema.safeParse({ photoId, order: 0 });

    if (!result.success) {
      return { success: false, error: 'Invalid photo format' };
    }

    const count = await prisma.portfolioItem.count();

    await prisma.portfolioItem.create({
      data: {
        photoId: result.data.photoId,
        order: count,
      },
    });

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to add to portfolio' };
  }
}

// REMOVE PHOTO FROM PORTFOLIO
export async function removeFromPortfolio(itemId: string) {
  try {
    await checkAuth();

    // VALIDATE CUID
    const idCheck = z.string().cuid().safeParse(itemId);
    if (!idCheck.success) {
      return { success: false, error: 'Invalid item ID' };
    }

    await prisma.portfolioItem.delete({
      where: { id: idCheck.data },
    });

    revalidatePath('/portfolio');
    revalidatePath('/admin/portfolio');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to remove from portfolio' };
  }
}
