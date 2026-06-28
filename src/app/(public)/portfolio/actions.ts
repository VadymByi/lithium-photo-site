'use server';

import { prisma } from '@/lib/prisma';

// FETCH PORTFOLIO PHOTOS FOR PUBLIC VIEW
export async function getPortfolioPhotos() {
  try {
    const items = await prisma.portfolioItem.findMany({
      orderBy: { order: 'asc' },
      include: {
        photo: true,
      },
    });

    // MAP TO PHOTO ARRAY
    return items.map((item) => item.photo);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return [];
  }
}
