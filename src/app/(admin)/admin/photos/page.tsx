import { prisma } from '@/lib/prisma';
import PhotoUploadForm from '@/components/admin/PhotoUploadForm';
import PhotoList from './PhotoList';
import CreateProjectForm from '@/components/admin/CreateProjectForm';

export const dynamic = 'force-dynamic'; //здесь нужно разобраться - нужно ли

export default async function AdminPhotosPage() {
  const [photos, projects] = await Promise.all([
    prisma.photo.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  // const photos = await prisma.photo.findMany({
  //   orderBy: { createdAt: 'desc' },
  // });

  // const projects = await prisma.project.findMany({
  //   orderBy: { createdAt: 'desc' },
  // });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        Управление контентом
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Левая колонка: Формы управления (4 из 12 колонок) */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-black italic">
              1. Новый проект
            </h2>
            <CreateProjectForm />
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-black italic">
              2. Загрузка фото
            </h2>
            {projects.length > 0 ? (
              <PhotoUploadForm projects={projects} />
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                ⚠️ Сначала создайте проект в форме выше, чтобы привязать к нему
                фотографии.
              </div>
            )}
          </section>
        </aside>

        {/* Правая колонка: Список фото (8 из 12 колонок) */}
        <main className="lg:col-span-8">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-125">
            <h2 className="text-lg font-semibold mb-6 flex items-center justify-between">
              Галерея{' '}
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-normal text-gray-500">
                {photos.length} фото
              </span>
            </h2>

            {photos.length > 0 ? (
              <PhotoList photos={photos} />
            ) : (
              <div className="text-gray-400 py-20 text-center border-2 border-dashed rounded-xl flex flex-col items-center">
                <p>Фотографий пока нет. Время наполнять портфолио!</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
