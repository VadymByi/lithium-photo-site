'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// FETCH PHOTOS NOT YET IN PORTFOLIO
export async function getAvailablePhotos() {
  const portfolioItemIds = (
    await prisma.portfolioItem.findMany({
      select: { photoId: true },
    })
  ).map((item) => item.photoId);

  return await prisma.photo.findMany({
    where: {
      id: { notIn: portfolioItemIds },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// FETCH CURRENT PORTFOLIO ITEMS WITH RELATED PHOTOS
export async function getPortfolioManagementItems() {
  return await prisma.portfolioItem.findMany({
    orderBy: { order: 'asc' },
    include: { photo: true },
  });
}

// ADD PHOTO TO PORTFOLIO WITH ORDERING
export async function addToPortfolio(photoId: string) {
  const count = await prisma.portfolioItem.count();

  await prisma.portfolioItem.create({
    data: { photoId, order: count },
  });

  // REVALIDATE AFFECTED PAGES
  revalidatePath('/portfolio');
  revalidatePath('/admin/portfolio');
}

// REMOVE PHOTO FROM PORTFOLIO
export async function removeFromPortfolio(itemId: string) {
  await prisma.portfolioItem.delete({
    where: { id: itemId },
  });

  // REVALIDATE AFFECTED PAGES
  revalidatePath('/portfolio');
  revalidatePath('/admin/portfolio');
}
