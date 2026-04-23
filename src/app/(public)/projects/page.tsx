import ProtectedImage from '@/components/shared/ProtectedImage';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ProjectsCatalogPage() {
  const projects = await prisma.project.findMany({
    include: {
      photos: {
        take: 1,
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen pt-32 pb-12 px-6 bg-black text-white">
      <header className="mb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-thin uppercase tracking-[0.3em]">
          Portfolio
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block relative overflow-hidden"
          >
            {/* Обложка проекта */}
            <div className="aspect-3/4 relative overflow-hidden bg-zinc-900">
              {project.photos[0] ? (
                <ProtectedImage
                  publicId={project.photos[0].publicId}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-700 uppercase tracking-widest text-xs">
                  No photos yet
                </div>
              )}

              {/* Overlay при ховере */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <span className="border border-white/50 px-6 py-2 text-sm uppercase tracking-widest backdrop-blur-sm">
                  View Project
                </span>
              </div>
            </div>

            {/* Инфо о проекте */}
            <div className="mt-6 text-center">
              <h2 className="text-xl font-light uppercase tracking-[0.2em] group-hover:text-sky-400 transition-colors">
                {project.title}
              </h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2">
                {project.photos.length} photos
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
