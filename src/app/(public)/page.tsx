import { getSliderItems } from '../(admin)/admin/slider/actions';
import MainSlider from './../../components/home/MainSlider';

export default async function HomePage() {
  // FETCH SLIDER ITEMS
  const sliderItems = await getSliderItems();

  // SAFE FALLBACK
  const safeItems = Array.isArray(sliderItems) ? sliderItems : [];

  // EMPTY STATE (ADMIN WARNING)
  if (safeItems.length === 0) {
    return <div>Add slides in the admin panel</div>;
  }

  // EMPTY STATE (MAIN PAGE)
  if (sliderItems.length === 0) {
    return (
      <main className="h-screen flex items-center justify-center bg-black text-white px-10 text-center">
        <div>
          <h1 className="text-2xl font-light uppercase tracking-widest mb-4">
            Lithium Photo
          </h1>
          <p className="text-zinc-500">
            Configure the main slider in the admin panel.
          </p>
        </div>
      </main>
    );
  }

  return (
    // MAIN PAGE WRAPPER
    <main>
      <MainSlider items={JSON.parse(JSON.stringify(safeItems))} />
    </main>
  );
}
