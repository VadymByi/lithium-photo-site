'use client';

import { MainSliderItem, Photo } from '@prisma/client';
import { useState, useRef, useTransition } from 'react';
import { createSliderItem, deleteSliderItem } from './actions';
import ProtectedImage from '@/components/shared/ProtectedImage';

// COMPONENT PROPS
interface Props {
  allPhotos: Photo[];
  initialItems: (MainSliderItem & { photo: Photo })[];
}

// SLIDER MANAGER UI COMPONENT
export default function SliderManagerUI({ allPhotos, initialItems }: Props) {
  const [selectedPhotoId, setSelectedPhotoId] = useState('');
  const [bgColor, setBgColor] = useState('#111111');
  const [isPending, startTransition] = useTransition();
  const [errorDetails, setErrorDetails] = useState<Record<string, string[]>>(
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  // HANDLE CREATE ACTION
  const handleCreate = async (formData: FormData) => {
    setErrorDetails({});

    startTransition(async () => {
      const result = await createSliderItem(formData);

      if (result?.error) {
        if (result.details) {
          setErrorDetails(result.details as Record<string, string[]>);
        } else {
          alert(result.error);
        }
      } else {
        // RESET FORM ON SUCCESS
        formRef.current?.reset();
        setSelectedPhotoId('');
        setBgColor('#111111');
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Добавить слайд
        </h2>
        <form ref={formRef} action={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Заголовок
            </label>
            <input
              name="title"
              type="text"
              className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Описание
            </label>
            <textarea
              name="description"
              className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Collection 2026"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
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
                  className="flex-1 p-2 border rounded text-sm uppercase text-black"
                />
              </div>
              {errorDetails.backgroundColor && (
                <p className="text-red-500 text-xs mt-1">
                  {errorDetails.backgroundColor[0]}
                </p>
              )}
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Порядок
              </label>
              <input
                name="order"
                type="number"
                defaultValue="0"
                className="w-full p-2 border rounded bg-gray-50 text-black"
              />
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${errorDetails.photoId ? 'text-red-500' : 'text-gray-700'}`}
            >
              Выберите фото из галереи{' '}
              {errorDetails.photoId && ' (обязательно)'}
            </label>
            <input type="hidden" name="photoId" value={selectedPhotoId} />
            <div
              className={`grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border rounded transition-colors ${
                errorDetails.photoId ? 'border-red-500 bg-red-50' : 'bg-gray-50'
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

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-zinc-800 transition-colors disabled:bg-gray-400"
          >
            {isPending ? 'Добавление...' : 'Добавить в слайдер'}
          </button>
        </form>
      </div>

      {/* SLIDER ITEMS LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-black">Активные слайды</h2>
        {initialItems.length === 0 && (
          <p className="text-gray-400 italic">Слайдов пока нет...</p>
        )}
        {initialItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative w-20 h-20 rounded overflow-hidden shrink-0 shadow-inner">
              <ProtectedImage
                publicId={item.photo.publicId}
                alt={item.title || ''}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-black">
                {item.title || 'Без названия'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full border shadow-sm"
                  style={{ backgroundColor: item.backgroundColor }}
                ></div>
                <span className="text-xs text-gray-500 uppercase font-mono">
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
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
