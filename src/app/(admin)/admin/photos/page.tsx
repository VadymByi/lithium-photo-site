import { prisma } from '@/lib/prisma';
import PhotoUploadForm from './PhotoUploadForm';
import PhotoList from './PhotoList';

export const dynamic = 'force-dynamic'; //здесь нужно разобраться - нужно ли

export default async function AdminPhotosPage() {
  const photos = await prisma.photo.findMany({
    orderBy: { createdAt: 'desc' },
  });

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
          <h2 className="text-lg font-semibold mb-4">
            Галерея({photos.length})
          </h2>
          {photos.length > 0 ? (
            <PhotoList photos={photos} />
          ) : (
            <div className="text-gray-500 py-10 text-center border-2 border-dashed rounded-lg">
              Фотографий пока нет. Загрузите первое!
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
