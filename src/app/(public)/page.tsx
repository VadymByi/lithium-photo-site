import { prisma } from '@/lib/prisma';
import MainSlider from './../../components/home/MainSlider';
import Burger from '@/components/layout/Burger';

export default async function HomePage() {
  const photos = await prisma.photo.findMany({
    take: 5,
    include: { project: true },
    orderBy: { createdAt: 'desc' },
  });

  console.log('ЗАГРУЖЕНО ФОТО:', photos.length);

  if (photos.length === 0) {
    return (
      <main className="h-screen flex items-center justify-center bg-black text-white">
        <Burger />
        <p>В базе нет фото. Загрузи их в админке, привязав к проекту!</p>
      </main>
    );
  }
  return (
    <main>
      <Burger />
      <MainSlider photos={photos} />
    </main>
  );
}
