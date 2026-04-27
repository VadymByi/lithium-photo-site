'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// FETCH OR INITIALIZE SITE CONFIG
export async function getSiteConfig() {
  try {
    let config = await prisma.siteConfig.findFirst({
      where: { id: 1 },
    });

    if (!config) {
      config = await prisma.siteConfig.create({
        data: {
          id: 1,
          showAbout: true,
          showPortfolio: true,
          showProjects: true,
          showContacts: true,
        },
      });
    }

    return config;
  } catch (error) {
    console.error('Error fetching site config:', error);
    return null;
  }
}

// UPDATE SITE CONFIG WITH UPSERT + CACHE INVALIDATION
export async function updateSiteConfig(data: {
  showAbout?: boolean;
  showPortfolio?: boolean;
  showProjects?: boolean;
  showContacts?: boolean;
  aboutTitle?: string;
  aboutText?: string;
  aboutImageUrl?: string | null;
}) {
  try {
    const updated = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        showAbout: data.showAbout ?? true,
        showPortfolio: data.showPortfolio ?? true,
        showProjects: data.showProjects ?? true,
        showContacts: data.showContacts ?? true,
        aboutTitle: data.aboutTitle ?? 'About Me',
        aboutText: data.aboutText ?? '',
        aboutImageUrl: data.aboutImageUrl ?? null,
      },
    });

    revalidatePath('/', 'layout');
    revalidatePath('/about');

    return { success: true };
  } catch (error) {
    console.error('Error updating site config:', error);
    return { success: false };
  }
}
