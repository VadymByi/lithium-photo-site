import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, LayoutGrid } from 'lucide-react';
import EditProjectForm from './EditProjectForm';
import PhotoUploadForm from '@/components/admin/PhotoUploadForm';
import PhotoList from '../../photos/PhotoList';
import DeleteProjectButton from './DeleteProjectButton';

// PAGE PROPS TYPE
interface PageProps {
  params: Promise<{ id: string }>;
}

// PROJECT DETAIL PAGE COMPONENT
export default async function ProjectDetailPage({ params }: PageProps) {
  // RESOLVE ROUTE PARAMS
  const { id } = await params;

  // FETCH PROJECT WITH PHOTOS
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // HANDLE NOT FOUND STATE
  if (!project) {
    notFound();
  }

  // RENDER PAGE UI
  return (
    <div className="space-y-8">
      {/* HEADER NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Назад к списку проектов</span>
        </Link>
      </div>

      {/* MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: PROJECT SETTINGS */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-800">
              Параметры проекта
            </h2>
            <EditProjectForm project={project} />
          </section>
        </div>

        {/* RIGHT COLUMN: CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {/* PHOTO UPLOAD */}
          <section className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
            <h2 className="text-lg font-bold mb-6 text-zinc-800">
              Загрузить новые фотографии
            </h2>
            <PhotoUploadForm projectId={project.id} />
          </section>

          {/* PHOTO LIST */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                <LayoutGrid size={20} className="text-zinc-400" />
                Фотографии альбома
                <span className="ml-2 px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full text-xs font-normal">
                  {project.photos.length}
                </span>
              </h2>
            </div>

            {project.photos.length > 0 ? (
              <PhotoList photos={project.photos} />
            ) : (
              <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
                <p className="text-zinc-400 text-sm">
                  В этом проекте пока нет фотографий.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="pt-12 border-t border-zinc-100">
        <section className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-2xl">
          <h3 className="text-red-800 font-bold text-lg mb-2">Опасная зона</h3>
          <p className="text-red-600 text-sm mb-6">
            Удаление проекта приведет к удалению всех его фотографий из базы
            данных и Cloudinary безвозвратно. Пожалуйста, будьте уверены в этом
            действии.
          </p>

          <DeleteProjectButton
            projectId={project.id}
            projectTitle={project.title}
          />
        </section>
      </div>
    </div>
  );
}
