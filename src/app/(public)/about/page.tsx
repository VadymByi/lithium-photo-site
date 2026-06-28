import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// FETCH ABOUT PAGE DATA
async function getAboutData() {
  try {
    const config = await prisma.siteConfig.findFirst({
      where: { id: 1 },
      select: {
        aboutTitle: true,
        aboutText: true,
        aboutImageUrl: true,
      },
    });

    return config;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

export default async function AboutPage() {
  // DATA LOADING
  const data = await getAboutData();

  // FALLBACK IMAGE
  const placeholderImage =
    'https://images.unsplash.com/photo-1554080353-a576cf803bda?q=80&w=1000';

  // TEXT PROCESSING
  const paragraphs = data?.aboutText
    ? data.aboutText.split('\n').filter((p) => p.trim() !== '')
    : [];

  return (
    <main className="min-h-screen bg-white text-black pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32">
          {/* TITLE BLOCK */}
          <div className="md:col-span-5 md:text-right order-2 md:order-1">
            <h1 className="text-5xl md:text-8xl font-light tracking-tighter leading-none text-zinc-900">
              {data?.aboutTitle || 'About'}
            </h1>
            <p className="mt-6 text-zinc-400 uppercase tracking-[0.3em] text-[10px] font-medium">
              Lithium Photography
            </p>
          </div>

          {/* MAIN IMAGE */}
          <div className="md:col-span-7 order-1 md:order-2">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-zinc-100 shadow-2xl shadow-zinc-200">
              <Image
                src={data?.aboutImageUrl || placeholderImage}
                alt="Photographer Portrait"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-w-1280px) 60vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-zinc-100 pt-20">
          {/* SECTION TITLE */}
          <div className="md:col-span-4">
            <h2 className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
              The Philosophy
            </h2>
          </div>

          {/* TEXT CONTENT */}
          <div className="md:col-span-8 text-zinc-800 leading-relaxed space-y-8 text-xl font-light">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="first-letter:text-3xl first-letter:font-normal"
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-zinc-400 italic">
                Контент пока не добавлен в панели управления.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
