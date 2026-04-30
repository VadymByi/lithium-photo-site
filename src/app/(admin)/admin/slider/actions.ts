'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { mainSliderItemSchema } from '@/lib/schemas';
import { uploadImage } from '@/lib/upload-image';

// FETCH SLIDER ITEMS
export async function getSliderItems() {
  return prisma.mainSliderItem.findMany({
    include: { photo: true },
    orderBy: { order: 'asc' },
  });
}

// CREATE SLIDER ITEM
export async function createSliderItem(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  try {
    let photoId = formData.get('photoId') as string | null;
    const file = formData.get('file') as File;

    // UPLOAD IMAGE IF FILE PROVIDED
    if (file && file.size > 0) {
      const upload = await uploadImage(file, 'lithium/main-slider');

      const photo = await prisma.photo.create({
        data: {
          publicId: upload.publicId,
          url: upload.url,
          secureUrl: upload.secureUrl,
          width: upload.width,
          height: upload.height,
          format: upload.format ?? 'jpg',
        },
      });

      photoId = photo.id;
    }

    if (!photoId) {
      return { error: 'No image provided' };
    }

    // BUILD PAYLOAD
    const raw = {
      title: formData.get('title'),
      description: formData.get('description'),
      backgroundColor: formData.get('backgroundColor') ?? '#111111',
      photoId,
      order: Number(formData.get('order')) || 0,
    };

    // VALIDATE INPUT
    const parsed = mainSliderItemSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        error: 'Validation error',
        details: parsed.error.flatten().fieldErrors,
      };
    }

    // CREATE DB RECORD
    await prisma.mainSliderItem.create({
      data: parsed.data,
    });

    // REVALIDATE CACHE
    revalidatePath('/');
    revalidatePath('/admin/slider');

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Slider create failed' };
  }
}

// DELETE SLIDER ITEM
export async function deleteSliderItem(id: string) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  await prisma.mainSliderItem.delete({ where: { id } });

  // REVALIDATE CACHE
  revalidatePath('/');
  revalidatePath('/admin/slider');

  return { success: true };
}
