'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { siteConfigSchema } from '@/lib/schemas';

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

// UPDATE SITE CONFIG WITH VALIDATION AND AUTHORIZATION
export async function updateSiteConfig(rawData: unknown) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { success: false, error: 'Unauthorized' };

  // VALIDATE INPUT DATA (PARTIAL UPDATE)
  const result = siteConfigSchema.partial().safeParse(rawData);

  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  try {
    // UPSERT CONFIG (CREATE OR UPDATE)
    await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: result.data,
      create: {
        id: 1,
        showAbout: true,
        showPortfolio: true,
        showProjects: true,
        showContacts: true,
        ...result.data,
      },
    });

    // REVALIDATE CACHE
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}
