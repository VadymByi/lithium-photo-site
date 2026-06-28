'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// FETCH ALL PROJECTS WITH COVER PHOTO
export async function getProjects() {
  return await prisma.project.findMany({
    include: {
      photos: {
        take: 1,
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// FETCH SINGLE PROJECT BY SLUG
export async function getProjectBySlug(slug: string) {
  // VALIDATE SLUG
  const slugSchema = z.string().min(1).max(100);
  const validated = slugSchema.safeParse(slug);

  if (!validated.success) return null;

  return await prisma.project.findUnique({
    where: { slug: validated.data },
    include: {
      photos: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}
