'use client';

import { useState } from 'react';
import { Photo } from '@prisma/client';
import ProtectedImage from './../shared/ProtectedImage';

export default function MainSlider({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = photos.length;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % count);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <div
        className="absolute left-0 w-[35%] h-full transition-transform duration-700 ease-in-out z-10"
        style={{
          transform: `translateY(${activeIndex * 100}vh)`,
          top: `-${(count - 1) * 100}vh`,
        }}
      >
        {[...photos].reverse().map((photo, i) => (
          <div
            key={photo.id}
            className="h-screen w-full flex flex-col items-center justify-center p-8 text-white bg-neutral-900"
          >
            <h1 className="text-3xl font-light tracking-widest uppercase">
              Project
            </h1>
            <p className="text-gray-400 mt-2 text-sm italic">
              Lithium Collection
            </p>
          </div>
        ))}
      </div>

      <div
        className="absolute right-0 w-[65%] h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateY(-${activeIndex * 100}vh)` }}
      >
        {photos.map((photo) => (
          <div
            key={`img-${photo.id}`}
            className="relative w-full h-screen border-l border-white/5 overflow-hidden"
          >
            {/* <img
              src={`https://res.cloudinary.com/dffhgmla8/image/upload/${photo.publicId}`}
              alt="test"
              className="w-full h-full object-cover"
            /> */}
            <ProtectedImage
              publicId={photo.publicId}
              alt="Lithium"
              fill
              className="object-cover object-center" // Растянуть с обрезкой лишнего, центрировать
              sizes="65vw" // Подсказка браузеру: картинка займет 65% ширины вьюпорта
              priority
            />
          </div>
        ))}
      </div>

      <div className="absolute left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col">
        <button
          onClick={prevSlide}
          className="p-4 bg-white/10 hover:bg-white text-white hover:text-black transition-all"
        >
          ↑
        </button>
        <button
          onClick={nextSlide}
          className="p-4 bg-white/10 hover:bg-white text-white hover:text-black transition-all"
        >
          ↓
        </button>
      </div>
    </div>
  );
}
