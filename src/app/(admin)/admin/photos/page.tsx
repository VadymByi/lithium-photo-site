import { prisma } from '@/lib/prisma';
import PhotoUploadForm from './PhotoUploadForm';

export const dynamic = 'force-dynamic';

export default async function AdminPhotosPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Управление фотографиями</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Загрузить новое фото</h2>
          {projects.length > 0 ? (
            <PhotoUploadForm projects={projects} />
          ) : (
            <p className="text-amber-600">
              Сначала создайте хотя бы один проект в базе.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Последние загрузки</h2>
          {/* Здесь позже выведем список уже загруженных фото */}
          <div className="text-gray-400 italic text-sm">Список пуст...</div>
        </section>
      </div>
    </div>
  );
}
