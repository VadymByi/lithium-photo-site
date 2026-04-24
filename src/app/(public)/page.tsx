import { prisma } from '@/lib/prisma';
import { getSliderItems } from '../(admin)/admin/slider/actions';
import MainSlider from './../../components/home/MainSlider';

export default async function HomePage() {
  const sliderItems = await getSliderItems();
  const safeItems = Array.isArray(sliderItems) ? sliderItems : [];

  if (safeItems.length === 0) {
    return <div>Добавьте слайды в админке</div>;
  }

  if (sliderItems.length === 0) {
    return (
      <main className="h-screen flex items-center justify-center bg-black text-white px-10 text-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest mb-4">
            Lithium Photo
          </h1>
          <p className="text-zinc-500">
            Зайдите в админку и настройте главный слайдер.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <MainSlider items={JSON.parse(JSON.stringify(safeItems))} />
    </main>
  );
}
