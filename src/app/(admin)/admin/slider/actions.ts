'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { mainSliderItemSchema } from '@/lib/schemas';
import cloudinary from '@/lib/cloudinary';
import { UploadApiResponse } from 'cloudinary';

/**
 * Типизация ответа Cloudinary для устранения any
 */
interface CloudinaryResponse extends UploadApiResponse {
  url: string;
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

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

// CREATE NEW SLIDER ITEM (WITH PHOTO UPLOAD)
export async function createSliderItem(formData: FormData) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  const file = formData.get('file') as File;

  // Если файла нет в FormData, проверяем, пришел ли photoId (выбор из галереи)
  const existingPhotoId = formData.get('photoId') as string;

  try {
    let photoId = existingPhotoId;

    // 1. Если загружается новый файл
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await new Promise<CloudinaryResponse>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: 'lithium/main-slider' },
              (error, result) => {
                if (error || !result) reject(error);
                else resolve(result as CloudinaryResponse);
              },
            )
            .end(buffer);
        },
      );

      // 2. Создание записи в Photo (projectId теперь официально опционален)
      const photo = await prisma.photo.create({
        data: {
          url: uploadResponse.url,
          secureUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          width: uploadResponse.width,
          height: uploadResponse.height,
          format: uploadResponse.format,
        },
      });
      photoId = photo.id;
    }

    if (!photoId) {
      return { error: 'Необходимо выбрать или загрузить изображение' };
    }

    // 3. Валидация данных слайдера через Zod
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      backgroundColor: formData.get('backgroundColor') || '#111111',
      photoId: photoId,
      order: Number(formData.get('order')) || 0,
    };

    const result = mainSliderItemSchema.safeParse(rawData);
    if (!result.success) {
      return {
        error: 'Ошибка валидации данных',
        details: result.error.flatten().fieldErrors,
      };
    }

    // 4. Создание айтема слайдера
    await prisma.mainSliderItem.create({
      data: result.data,
    });

    revalidatePath('/');
    revalidatePath('/admin/slider');

    return { success: true };
  } catch (error) {
    console.error('Slider creation error:', error);
    return { error: 'Не удалось создать элемент слайдера' };
  }
}

// DELETE SLIDER ITEM
export async function deleteSliderItem(
  id: string,
  photoId?: string,
  publicId?: string,
) {
  const session = await auth();
  if (!session) return { error: 'Access denied' };

  try {
    // Если переданы данные фото, удаляем и из Cloudinary, и саму сущность Photo
    // Это наш случай для "прямой загрузки" в слайдер
    if (photoId && publicId) {
      await cloudinary.uploader.destroy(publicId);
      await prisma.photo.delete({ where: { id: photoId } });
    } else {
      // Иначе удаляем только привязку в слайдере (если фото общее)
      await prisma.mainSliderItem.delete({ where: { id } });
    }

    revalidatePath('/');
    revalidatePath('/admin/slider');
    return { success: true };
  } catch (error) {
    console.error('Slider deletion error:', error);
    return { error: 'Не удалось удалить элемент слайдера' };
  }
}
