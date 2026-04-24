'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getSliderItems() {
  return await prisma.mainSliderItem.findMany({
    include: {
      photo: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export async function createSliderItem(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const backgroundColor = formData.get('backgroundColor') as string;
  const photoId = formData.get('photoId') as string;
  const order = parseInt(formData.get('order') as string) || 0;

  try {
    await prisma.mainSliderItem.create({
      data: {
        title,
        description,
        backgroundColor,
        photoId,
        order,
      },
    });
    revalidatePath('/');
    revalidatePath('/admin/slider');
    return { success: true };
  } catch (error) {
    console.error('Slider creation error: ', error);
    return { error: 'Не удалось создать слайд' };
  }
}

export async function deleteSliderItem(id: string) {
  try {
    await prisma.mainSliderItem.delete({
      where: { id },
    });
    revalidatePath('/');
    revalidatePath('/admin/slider');
    return { success: true };
  } catch (error) {
    return { error: 'Ошибка при удалении' };
  }
}
