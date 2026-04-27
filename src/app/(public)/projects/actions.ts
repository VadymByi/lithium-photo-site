'use server';

import { prisma } from '@/lib/prisma';

// FETCH ALL PROJECTS WITH COVER PHOTO
export async function getProjects() {
  return await prisma.project.findMany({
    include: {
      photos: {
        take: 1,
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// FETCH SINGLE PROJECT BY SLUG WITH ALL PHOTOS
export async function getProjectBySlug(slug: string) {
  return await prisma.project.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}
