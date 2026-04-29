'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { projectSchema } from '@/lib/schemas';
import cloudinary from '@/lib/cloudinary';
import { Prisma } from '@prisma/client';

// CREATE PROJECT ACTION
export async function createProjectAction(formData: FormData) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  // EXTRACT AND VALIDATE DATA
  const data = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  const result = projectSchema.safeParse(data);

  if (!result.success) {
    return {
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    };
  }

  try {
    // CREATE PROJECT IN DATABASE
    await prisma.project.create({ data: result.data });

    // REVALIDATE CACHE
    revalidatePath('/admin/projects');

    return { success: true };
  } catch (err) {
    // HANDLE UNIQUE CONSTRAINT ERROR
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { error: 'Проект с таким URL (slug) уже существует' };
      }
    }

    return { error: 'Ошибка базы данных при создании проекта' };
  }
}

// UPDATE PROJECT ACTION
export async function updateProjectAction(id: string, formData: FormData) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  // EXTRACT AND VALIDATE DATA
  const data = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  const result = projectSchema.safeParse(data);

  if (!result.success) {
    return {
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    };
  }

  try {
    // UPDATE PROJECT IN DATABASE
    await prisma.project.update({
      where: { id },
      data: result.data,
    });

    // REVALIDATE CACHE
    revalidatePath('/admin/projects');
    revalidatePath(`/admin/projects/${id}`);

    return { success: true };
  } catch (err) {
    console.error('Update error:', err instanceof Error ? err.message : err);

    return { error: 'Ошибка при обновлении проекта' };
  }
}

// DELETE PROJECT ACTION
export async function deleteProjectAction(id: string) {
  // AUTHORIZATION CHECK
  const session = await auth();
  if (!session) return { success: false, error: 'Unauthorized' };

  try {
    // FETCH PROJECT PHOTOS
    const projectPhotos = await prisma.photo.findMany({
      where: { projectId: id },
      select: { publicId: true },
    });

    // DELETE PHOTOS FROM CLOUDINARY
    if (projectPhotos.length > 0) {
      const publicIds = projectPhotos.map((p) => p.publicId);
      await cloudinary.api.delete_resources(publicIds);

      console.log(
        `--- CLOUDINARY CLEANUP: Deleted ${publicIds.length} images ---`,
      );
    }

    // DELETE PROJECT FROM DATABASE
    await prisma.project.delete({
      where: { id },
    });

    // REVALIDATE CACHE
    revalidatePath('/admin/projects');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    // ERROR HANDLING
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown deletion error';

    console.error('Error during project deletion:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
