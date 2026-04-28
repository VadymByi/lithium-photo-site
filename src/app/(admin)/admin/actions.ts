'use server';

import { auth, signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { projectSchema } from '@/lib/schemas';

// LOGOUT ACTION
export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}

// CREATE PROJECT ACTION
export async function createProjectAction(formData: FormData) {
  // CHECK AUTHORIZATION
  const session = await auth();
  if (!session) return { error: 'Доступ запрещен' };

  // EXTRACT FORM DATA
  const rawData = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    description: formData.get('description'),
  };

  // VALIDATE WITH ZOD
  const result = projectSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: 'Ошибка валидации',
      details: result.error.flatten().fieldErrors,
    };
  }

  const { title, slug, description } = result.data;

  try {
    // CHECK SLUG UNIQUENESS
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return { error: 'Проект с таким URL-адресом (slug) уже существует' };
    }

    // CREATE PROJECT
    await prisma.project.create({
      data: {
        title,
        slug,
        description,
      },
    });

    // REVALIDATE CACHE
    revalidatePath('/admin');
    revalidatePath('/projects');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Project creation error:', error);
    return { error: 'Не удалось создать проект в базе данных' };
  }
}
