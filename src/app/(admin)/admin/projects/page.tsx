import { prisma } from '@/lib/prisma';
import CreateProjectForm from '@/components/admin/CreateProjectForm';
import { Trash2, ExternalLink, FolderOpen } from 'lucide-react'; // добавить иконки в юай!!!
import Link from 'next/link';
import ProtectedImage from '@/components/shared/ProtectedImage';

export default async function ProjectsPage() {
  // FETCH PROJECTS DATA
  const projects = await prisma.project.findMany({
    include: {
      _count: {
        select: { photos: true },
      },
      photos: {
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Управление проектами</h1>
      </div>

      {/* MAIN LAYOUT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* CREATE PROJECT FORM */}
        <div className="xl:col-span-1">
          <div className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Создать новый проект</h2>
            <CreateProjectForm />
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="xl:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Существующие проекты ({projects.length})
          </h2>

          <div className="grid gap-4">
            {/* EMPTY STATE */}
            {projects.length === 0 && (
              <p className="text-gray-500 italic">Проектов пока нет...</p>
            )}

            {/* PROJECT ITEM */}
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                {/* PROJECT COVER */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {project.photos[0] ? (
                    <ProtectedImage
                      publicId={project.photos[0].publicId}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FolderOpen size={20} />
                    </div>
                  )}
                </div>

                {/* PROJECT INFO */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-black truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {project._count.photos} фото • /{project.slug}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/projects/${project.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Посмотреть на сайте"
                  >
                    <ExternalLink size={18} />
                  </Link>

                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white rounded-md text-sm font-medium transition-all"
                  >
                    Управление
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
