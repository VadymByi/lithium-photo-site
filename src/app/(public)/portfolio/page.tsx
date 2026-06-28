'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Indicator from '@/components/portfolio/Indicator';
import ProtectedImage from '@/components/shared/ProtectedImage';
import { getPortfolioPhotos } from './actions';
import { Photo } from '@prisma/client';

// MAIN PORTFOLIO PAGE COMPONENT
const PortfolioPage = () => {
  // STATE MANAGEMENT
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH PORTFOLIO PHOTOS
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

  // SLIDER NAVIGATION: NEXT
  const nextSlide = () => {
    setActiveIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // SLIDER NAVIGATION: PREVIOUS
  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white/20">
        Loading...
      </div>
    );
  }

  // EMPTY STATE
  if (photos.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white/20">
        Portfolio is empty
      </div>
    );
  }

  return (
    // MAIN SLIDER CONTAINER
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {/* SLIDES WRAPPER */}
      <div
        className="flex h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative h-full w-full shrink-0">
            {/* MAIN IMAGE */}
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
        className="absolute left-6 top-1/2 -translate-y-1/2 z-50 p-4 text-white/40 hover:text-white transition-all outline-none"
      >
        <ChevronLeft size={60} strokeWidth={0.5} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-50 p-4 text-white/40 hover:text-white transition-all outline-none"
      >
        <ChevronRight size={60} strokeWidth={0.5} />
      </button>

      {/* THUMBNAIL STRIP */}
      <div className="fixed bottom-0 left-0 z-50 grid grid-flow-col auto-cols-fr w-full border-t border-white/5 bg-black/20 backdrop-blur-md">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(index)}
            className="relative group aspect-square overflow-hidden border-r border-white/5 last:border-r-0 outline-none"
          >
            {/* THUMBNAIL IMAGE */}
            <div
              className={`relative w-full h-full transition-all duration-700 ${
                activeIndex === index
                  ? 'opacity-100 scale-100'
                  : 'opacity-30 scale-110 grayscale group-hover:opacity-60'
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
            <Indicator isActive={activeIndex === index} />
          </button>
        ))}
      </div>
    </main>
  );
};

// DEFAULT EXPORT
export default PortfolioPage;
