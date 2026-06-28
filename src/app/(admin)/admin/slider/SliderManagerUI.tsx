'use client';

import { MainSliderItem, Photo } from '@prisma/client';
import { useState, useRef, useTransition } from 'react';
import { createSliderItem, deleteSliderItem } from './actions';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { Trash2, Upload, ImageIcon } from 'lucide-react';

interface Props {
  allPhotos: Photo[];
  initialItems: (MainSliderItem & { photo: Photo })[];
}

export default function SliderManagerUI({ allPhotos, initialItems }: Props) {
  const [selectedPhotoId, setSelectedPhotoId] = useState('');
  const [bgColor, setBgColor] = useState('#111111');
  const [uploadMode, setUploadMode] = useState<'upload' | 'select'>('upload');
  const [isPending, startTransition] = useTransition();
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]>>(
    {},
  );

  const formRef = useRef<HTMLFormElement>(null);

  // CREATE HANDLER
  const handleCreate = async (formData: FormData) => {
    setErrorDetails({});

    startTransition(async () => {
      if (uploadMode === 'select' && !selectedPhotoId) {
        setErrorDetails({ photoId: ['Выберите фото из списка'] });
        return;
      }

      const result = await createSliderItem(formData);

      if (result?.error) {
        if (result.details) {
          setErrorDetails(result.details as Record<string, string[]>);
        } else {
          alert(result.error);
        }
      } else {
        formRef.current?.reset();
        setSelectedPhotoId('');
        setBgColor('#111111');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* FORM COLUMN */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Добавить новый слайд
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

          {/* TITLE + BACKGROUND COLOR */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Заголовок
              </label>
              <input
                name="title"
                type="text"
                className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Заголовок слайда"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Цвет фона
              </label>
              <div className="flex gap-2">
                <input
                  name="backgroundColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-12 p-1 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 p-2 border rounded text-sm uppercase text-black font-mono"
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Описание
            </label>
            <textarea
              name="description"
              rows={2}
              className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Краткое описание проекта"
            />
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
              <label
                className={`block text-sm font-medium mb-2 ${
                  errorDetails.photoId ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                Выберите фото из существующих
              </label>

              <input type="hidden" name="photoId" value={selectedPhotoId} />

              <div
                className={`grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded transition-colors ${
                  errorDetails.photoId
                    ? 'border-red-500 bg-red-50'
                    : 'bg-gray-50'
                }`}
              >
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

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-gray-400 font-medium"
          >
            {isPending ? 'Обработка...' : 'Добавить в слайдер'}
          </button>
        </form>
      </div>

      {/* SLIDER LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black">Активные слайды</h2>

        {initialItems.length === 0 && (
          <div className="p-12 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <p className="text-gray-400 italic">Слайдов пока нет</p>
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
                  alt={item.title || ''}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-black truncate">
                  {item.title || 'Без названия'}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: item.backgroundColor }}
                  />
                  <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                    {item.backgroundColor}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (confirm('Удалить этот слайд?')) {
                    deleteSliderItem(item.id);
                  }
                }}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Удалить слайд"
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
