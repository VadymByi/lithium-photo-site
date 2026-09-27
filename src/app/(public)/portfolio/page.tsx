'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Indicator from '@/components/portfolio/Indicator';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { getPortfolioPhotos } from './actions';
import { Photo } from '@prisma/client';

const PortfolioPage = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolioPhotos();
        setPhotos(data);
      } catch (err) {
        console.error('Failed to load photos', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white/20">
        Loading...
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white/20">
        Portfolio is empty
      </div>
    );
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-blackIn">
      {/* SLIDES WRAPPER */}
      <div
        className="flex h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative h-full w-full shrink-0">
            <ProtectedImage
              publicId={photo.publicId}
              alt={photo.title || 'Portfolio Image'}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* NAVIGATION BUTTONS */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 p-4 text-white/40 hover:text-white transition-all outline-none"
      >
        <ChevronLeft size={60} strokeWidth={0.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 p-4 text-white/40 hover:text-white transition-all outline-none"
      >
        <ChevronRight size={60} strokeWidth={0.5} />
      </button>

      {/* ИНТЕРАКТИВНАЯ ЗОНА ДЛЯ МИНИАТЮР */}
      <div className="fixed bottom-0 left-0 w-full z-50 group h-24 flex flex-col justify-end">
        {/* Невидимый триггер над полосой */}
        <div className="absolute top-0 left-0 w-full h-8 bg-transparent pointer-events-auto" />

        {/* Сама лента с миниатюрами */}
        <div className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-wrap justify-center overflow-hidden translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0">
          {/* Генерируем достаточное количество элементов для заполнения экрана.
      Если фото мало (например, меньше 20), мы повторяем их по кругу.
    */}
          {Array.from({ length: Math.ceil(20 / photos.length) || 1 })
            .flatMap(() => photos)
            .map((photo, index) => {
              // Вычисляем реальный индекс оригинальной фотографии
              const originalIndex = index % photos.length;
              const isCurrentActive = activeIndex === originalIndex;

              return (
                <button
                  key={`thumb-${photo.id}-${index}`}
                  onClick={() => setActiveIndex(originalIndex)}
                  className="relative group/thumb w-16 h-16 shrink-0 border-r border-white/5 last:border-r-0 outline-none"
                >
                  {/* IMAGE CONTAINER */}
                  <div
                    className={`relative w-full h-full transition-all duration-500 ${
                      isCurrentActive
                        ? 'opacity-100 scale-100'
                        : 'opacity-40 scale-105 group-hover/thumb:opacity-80'
                    }`}
                  >
                    <ProtectedImage
                      publicId={photo.publicId}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* ACTIVE INDICATOR */}
                  <Indicator isActive={isCurrentActive} />
                </button>
              );
            })}
        </div>
      </div>
    </main>
  );
};

export default PortfolioPage;
