import ProtectedImage from '@/components/shared/ProtectedImage';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-black text-white">
      {/* Заголовок проекта */}
      <header className="mb-16 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-thin uppercase tracking-[0.2em] leading-tight">
          {project.title}
        </h1>
        {project.description && (
          <p className="mt-6 text-gray-400 text-lg font-light leading-relaxed border-l border-white/20 pl-6">
            {project.description}
          </p>
        )}
      </header>

      {/* Masonry Grid через чистый CSS Columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {project.photos.map((photo) => (
          <div key={photo.id} className="break-inside-avoid group relative">
            <ProtectedImage
              publicId={photo.publicId} // Используем publicId для Cloudinary трансформаций
              alt={project.title}
              width={800}
              height={1200}
              className="w-full h-auto object-cover rounded-sm transition-opacity duration-500 group-hover:opacity-80"
            />

            {/* Опционально: подпись к фото при ховере */}
            {photo.title && (
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="text-xs uppercase tracking-widest bg-black/50 backdrop-blur-sm px-2 py-1">
                  {photo.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
