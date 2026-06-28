'use client';

import { useState, useEffect, use } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { getProjectBySlug } from '../actions';
import { Project, Photo } from '@prisma/client';

// EXTENDED PROJECT TYPE WITH PHOTOS
type ProjectWithPhotos = Project & {
  photos: Photo[];
};

export default function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // EXTRACT ROUTE PARAMS
  const { slug } = use(params);

  // STATE MANAGEMENT
  const [project, setProject] = useState<ProjectWithPhotos | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // FETCH PROJECT DATA
  useEffect(() => {
    getProjectBySlug(slug).then((data) => {
      setProject(data as ProjectWithPhotos);
    });
  }, [slug]);

  // LOADING STATE
  if (!project)
    return (
      <div className="h-screen bg-white flex items-center justify-center text-zinc-400 font-light tracking-widest">
        Loading...
      </div>
    );

  // VIEWER NAVIGATION: NEXT IMAGE
  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewerIndex === null || project.photos.length === 0) return;

    setViewerIndex((prev) =>
      prev !== null ? (prev + 1) % project.photos.length : null,
    );
  };

  // VIEWER NAVIGATION: PREVIOUS IMAGE
  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (viewerIndex === null || project.photos.length === 0) return;

    setViewerIndex((prev) =>
      prev !== null
        ? (prev - 1 + project.photos.length) % project.photos.length
        : null,
    );
  };

  return (
    // PAGE CONTAINER
    <main className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* PROJECT HEADER */}
        <div className="mb-16">
          <h1 className="text-6xl font-light tracking-tighter uppercase mb-4 text-zinc-900">
            {project.title}
          </h1>

          {project.description && (
            <p className="text-zinc-500 max-w-2xl font-light leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* MASONRY GALLERY */}
        {project.photos.length === 0 ? (
          <div className="text-zinc-400 font-light text-sm tracking-wider py-10">
            В этом проекте пока нет фотографий.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {project.photos.map((photo, index: number) => (
              <div
                key={photo.id}
                className="mb-4 break-inside-avoid cursor-pointer group relative bg-zinc-50 rounded-sm overflow-hidden"
                onClick={() => setViewerIndex(index)}
              >
                <ProtectedImage
                  publicId={photo.publicId}
                  alt={photo.title || 'Gallery image'}
                  width={800}
                  height={1200}
                  className="w-full h-auto transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-90"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN IMAGE VIEWER */}
      {viewerIndex !== null && project.photos.length > 0 && (
        <div
          className="fixed inset-0 z-100 bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
          onClick={() => setViewerIndex(null)}
        >
          {/* CLOSE BUTTON */}
          <button
            className="absolute top-10 right-10 text-black hover:rotate-90 transition-transform duration-300 z-110"
            onClick={() => setViewerIndex(null)}
          >
            <X size={40} strokeWidth={1} />
          </button>

          {/* PREVIOUS BUTTON */}
          <button
            onClick={showPrev}
            className="absolute left-6 text-black/30 hover:text-black transition-colors z-110"
          >
            <ChevronLeft size={64} strokeWidth={0.5} />
          </button>

          {/* FULLSCREEN IMAGE */}
          <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
            <ProtectedImage
              publicId={project.photos[viewerIndex].publicId}
              alt={project.photos[viewerIndex].title || 'Fullscreen view'}
              fill
              className="object-contain"
            />
          </div>

          {/* NEXT BUTTON */}
          <button
            onClick={showNext}
            className="absolute right-6 text-black/30 hover:text-black transition-colors z-110"
          >
            <ChevronRight size={64} strokeWidth={0.5} />
          </button>

          {/* IMAGE COUNTER */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">
            {viewerIndex + 1} / {project.photos.length}
          </div>
        </div>
      )}
    </main>
  );
}
