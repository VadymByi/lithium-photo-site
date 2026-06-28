import { prisma } from '@/lib/prisma';
import PhotoUploadForm from '@/components/admin/PhotoUploadForm';
import PhotoList from './PhotoList';

export const dynamic = 'force-dynamic';

// ADMIN PHOTOS PAGE
export default async function AdminPhotosPage() {
  // DATA FETCH
  const [photos, projects] = await Promise.all([
    prisma.photo.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  // RENDER PAGE
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Общая библиотека</h1>
        <p className="text-gray-500 mt-2">
          Управление всеми фотографиями и быстрая загрузка в существующие
          альбомы
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN - UPLOAD */}
        <aside className="lg:col-span-4">
          <section className="sticky top-8">
            <h2 className="text-lg font-semibold mb-4 text-black italic">
              Быстрая загрузка
            </h2>

            {projects.length > 0 ? (
              <PhotoUploadForm projects={projects} />
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                ⚠️ Нет доступных альбомов. Сначала создайте проект в разделе
                «Проекты».
              </div>
            )}
          </section>
        </aside>

        {/* RIGHT COLUMN - PHOTO LIST */}
        <main className="lg:col-span-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-125">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
              Все фотографии
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-normal text-gray-500">
                {photos.length} объектов
              </span>
            </h2>

            {photos.length > 0 ? (
              <PhotoList photos={photos} />
            ) : (
              <div className="text-gray-400 py-20 text-center border-2 border-dashed rounded-xl">
                <p>Библиотека пуста.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
