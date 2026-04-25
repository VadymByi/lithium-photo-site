'use client';

import { useState } from 'react';
import { MainSliderItem, Photo } from '@prisma/client';
import ProtectedImage from './../shared/ProtectedImage';

interface Props {
  items: (MainSliderItem & { photo: Photo })[];
}

export default function MainSlider({ items }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = items.length;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % count);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + count) % count);

  const sideBarStyle = {
    transform: `translateY(${activeIndex * 100}vh)`,
    top: `-${(count - 1) * 100}vh`,
  };

  const mainSlideStyle = {
    transform: `translateY(-${activeIndex * 100}vh)`,
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* SIDEBAR (ТЕКСТ) - Едет ВНИЗ */}
      <div
        className="absolute left-0 w-full md:w-[35%] h-full transition-transform duration-1000 ease-in-out z-20"
        style={sideBarStyle}
      >
        {[...items].reverse().map((item) => (
          <div
            key={`text-${item.id}`}
            className="h-screen w-full flex flex-col items-center justify-center p-12 text-center text-white"
            style={{ backgroundColor: item.backgroundColor }}
          >
            <h1 className="text-3xl md:text-5xl font-extralight tracking-[0.3em] uppercase leading-tight">
              {item.title}
            </h1>
            <div className="w-12 h-[1px] bg-white/30 my-6"></div>
            <p className="text-white/60 text-xs md:text-sm uppercase tracking-[0.4em] italic">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN SLIDE (ФОТО) - Едет ВВЕРХ */}
      <div
        className="absolute right-0 w-full md:w-[65%] h-full transition-transform duration-1000 ease-in-out z-10"
        style={mainSlideStyle}
      >
        {items.map((item) => (
          <div
            key={`img-${item.id}`}
            className="relative w-full h-screen overflow-hidden"
          >
            <ProtectedImage
              publicId={item.photo.publicId}
              alt={item.title || 'Lithium'}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, 65vw"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Кнопки управления */}
      <div className="absolute left-1/2 md:left-[35%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col gap-0 shadow-2xl">
        <button
          onClick={prevSlide}
          className="p-5 bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black transition-all duration-300 border border-white/10"
        >
          <span className="block transform rotate-180 text-xl font-light">
            ↓
          </span>
        </button>
        <button
          onClick={nextSlide}
          className="p-5 bg-white/10 hover:bg-white backdrop-blur-md text-white hover:text-black transition-all duration-300 border border-white/10 border-t-0"
        >
          <span className="block text-xl font-light">↓</span>
        </button>
      </div>

      {/* Индикатор текущего слайда */}
      <div className="absolute bottom-10 left-10 z-50 text-white/30 text-[10px] tracking-[0.5em] uppercase hidden md:block">
        {String(activeIndex + 1).padStart(2, '0')} /{' '}
        {String(count).padStart(2, '0')}
      </div>
    </div>
  );
}
