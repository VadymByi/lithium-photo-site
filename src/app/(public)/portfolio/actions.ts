'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// FETCH PORTFOLIO PHOTOS FOR SLIDER
export async function getPortfolioPhotos() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: {
        order: 'asc',
      },
      include: {
        photo: true,
      },
    });

    return items.map((item) => item.photo);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return [];
  }
}

// ADD PHOTO TO PORTFOLIO (ADMIN ONLY)
export async function addToPortfolio(photoId: string) {
  const lastItem = await prisma.portfolioItem.findFirst({
    orderBy: { order: 'desc' },
  });

  const newOrder = lastItem ? lastItem.order + 1 : 0;

  await prisma.portfolioItem.create({
    data: {
      photoId,
      order: newOrder,
    },
  });

  revalidatePath('/portfolio');
}
