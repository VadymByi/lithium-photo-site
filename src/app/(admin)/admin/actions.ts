'use server';

import { signOut } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}

export async function createProjectAction(formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!title) return { error: 'Название проекта обязательно' };

  try {
    await prisma.project.create({
      data: {
        title,
        slug,
        description,
      },
    });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { error: 'Ошибка при создании проекта' };
  }
}
