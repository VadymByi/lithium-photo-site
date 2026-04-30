'use client';

import { useState, useRef, useTransition } from 'react';
import { Photo, PortfolioItem } from '@prisma/client';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { Trash2, Upload, ImageIcon } from 'lucide-react';

type Item = PortfolioItem & { photo: Photo };

interface Props {
  allPhotos: Photo[];
  initialItems: Item[];
  createAction: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string }>;
  deleteAction: (id: string) => Promise<{ success?: boolean; error?: string }>;
}

export default function PortfolioManager({
  allPhotos,
  initialItems,
  createAction,
  deleteAction,
}: Props) {
  const [selectedPhotoId, setSelectedPhotoId] = useState('');
  const [uploadMode, setUploadMode] = useState<'upload' | 'select'>('upload');
  const [isPending, startTransition] = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  // CREATE HANDLER
  const handleCreate = async (formData: FormData) => {
    startTransition(async () => {
      if (uploadMode === 'select' && !selectedPhotoId) {
        alert('Выберите фото');
        return;
      }

      const result = await createAction(formData);

      if (result?.error) {
        alert(result.error);
      } else {
        formRef.current?.reset();
        setSelectedPhotoId('');
      }
    });
  };

  // DELETE HANDLER
  const handleDelete = (id: string) => {
    startTransition(async () => {
      if (!confirm('Удалить элемент из портфолио?')) return;

      const res = await deleteAction(id);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* FORM COLUMN */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Добавить в портфолио
        </h2>

        <form ref={formRef} action={handleCreate} className="space-y-4">
          {/* MODE SWITCH */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => setUploadMode('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                uploadMode === 'upload'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Upload size={16} /> Загрузить файл
            </button>

            <button
              type="button"
              onClick={() => setUploadMode('select')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                uploadMode === 'select'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <ImageIcon size={16} /> Из галереи
            </button>
          </div>

          {/* UPLOAD MODE */}
          {uploadMode === 'upload' ? (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Файл изображения
              </label>
              <input
                name="file"
                type="file"
                accept="image/*"
                required
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Выберите фото из существующих
              </label>

              <input type="hidden" name="photoId" value={selectedPhotoId} />

              <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded bg-gray-50">
                {allPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhotoId(photo.id)}
                    className={`relative aspect-square cursor-pointer border-2 transition-all rounded overflow-hidden ${
                      selectedPhotoId === photo.id
                        ? 'border-blue-500 scale-95 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ProtectedImage
                      publicId={photo.publicId}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-gray-400 font-medium"
          >
            {isPending ? 'Обработка...' : 'Добавить в портфолио'}
          </button>
        </form>
      </div>

      {/* LIST COLUMN */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black">Элементы портфолио</h2>

        {initialItems.length === 0 && (
          <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <p className="text-gray-400 italic">Портфолио пока пустое</p>
          </div>
        )}

        <div className="space-y-3">
          {initialItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm group hover:shadow-md transition-all"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-inner">
                <ProtectedImage
                  publicId={item.photo.publicId}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-black truncate">
                  {item.photo.publicId.split('/').pop()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Удалить элемент"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
