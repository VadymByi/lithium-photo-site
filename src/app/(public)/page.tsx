import { prisma } from '@/lib/prisma';
import MainSlider from './../../components/home/MainSlider';

export default async function HomePage() {
  const photos = await prisma.photo.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <Burger />
      <MainSlider photos={photos} />
    </main>
  );
}
