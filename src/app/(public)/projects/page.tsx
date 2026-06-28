'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { getProjects } from './actions';
import { Project, Photo } from '@prisma/client';

// PROJECT TYPE WITH COVER PHOTO
type ProjectWithCover = Project & {
  photos: Photo[];
};

export default function ProjectsPage() {
  // STATE MANAGEMENT
  const [projects, setProjects] = useState<ProjectWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // FETCH PROJECTS
  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data as ProjectWithCover[]);
      setLoading(false);
    });
  }, []);

  // LOADING STATE
  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center text-zinc-400 font-light tracking-widest uppercase">
        Loading Projects...
      </div>
    );
  }

  return (
    // PAGE CONTAINER
    <main className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* PAGE TITLE */}
        <h1 className="text-5xl font-light mb-16 tracking-tighter uppercase text-zinc-900">
          Projects
        </h1>

        {/* MASONRY GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group block mb-12 break-inside-avoid relative"
            >
              {/* PROJECT CARD */}
              <div className="relative aspect-3/4 overflow-hidden bg-zinc-100 rounded-sm">
                {/* COVER IMAGE */}
                {project.photos && project.photos.length > 0 ? (
                  <ProtectedImage
                    publicId={project.photos[0].publicId}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    priority={projects.indexOf(project) < 3}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs uppercase tracking-widest">
                    No images
                  </div>
                )}

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                  <div className="border border-white/30 px-6 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.3em]">
                      View Project
                    </p>
                  </div>
                </div>
              </div>

              {/* PROJECT INFO */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[0.2em] mb-1">
                  {project.title}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="h-px w-4 bg-zinc-300"></span>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">
                    {project.photos.length} Photos
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-400 font-light italic">
              No projects found in the gallery.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
