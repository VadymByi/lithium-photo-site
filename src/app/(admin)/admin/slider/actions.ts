'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { mainSliderItemSchema } from '@/lib/schemas';
import { z } from 'zod';

// FETCH ALL SLIDER ITEMS
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

// CREATE NEW SLIDER ITEM
export async function createSliderItem(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  // EXTRACT RAW FORM DATA
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    backgroundColor: formData.get('backgroundColor'),
    photoId: formData.get('photoId'),
    order: formData.get('order'),
  };

  // VALIDATE WITH ZOD
  const result = mainSliderItemSchema.safeParse(rawData);

  if (!result.success) {
    return {
      error: 'Invalid data',
      details: result.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.mainSliderItem.create({
      data: result.data,
    });

    revalidatePath('/');
    revalidatePath('/admin/slider');

    return { success: true };
  } catch (error) {
    console.error('Slider creation error:', error);
    return { error: 'Failed to create slider item' };
  }
}

// DELETE SLIDER ITEM
export async function deleteSliderItem(id: string) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  // VALIDATE ID
  const idCheck = z.string().cuid().safeParse(id);
  if (!idCheck.success) return { error: 'Invalid ID format' };

  try {
    await prisma.mainSliderItem.delete({
      where: { id: idCheck.data },
    });

    revalidatePath('/');
    revalidatePath('/admin/slider');

    return { success: true };
  } catch (error) {
    console.error('Slider deletion error:', error);
    return { error: 'Failed to delete slider item' };
  }
}
