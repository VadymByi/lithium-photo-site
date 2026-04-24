import { prisma } from '@/lib/prisma';
import { getSliderItems } from './actions';
import SliderManagerUI from './SliderManagerUI';

export default async function AdminSliderPage() {
  const allPhotos = await prisma.photo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  const sliderItems = await getSliderItems();

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
