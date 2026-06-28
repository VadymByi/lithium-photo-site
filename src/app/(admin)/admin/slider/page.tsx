import { prisma } from '@/lib/prisma';
import { getSliderItems } from './actions';
import SliderManagerUI from './SliderManagerUI';

// ADMIN SLIDER PAGE
export default async function AdminSliderPage() {
  // FETCH ALL PHOTOS
  const allPhotos = await prisma.photo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  // FETCH SLIDER ITEMS
  const sliderItems = await getSliderItems();

  // RENDER UI
  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-8">Управление главным слайдером</h1>

      <SliderManagerUI
        allPhotos={allPhotos}
        initialItems={JSON.parse(JSON.stringify(sliderItems))}
      />
    </div>
  );
}
