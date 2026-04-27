'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Trash2, LayoutGrid, Loader2 } from 'lucide-react';
import { Photo, PortfolioItem } from '@prisma/client';
import {
  getAvailablePhotos,
  getPortfolioManagementItems,
  addToPortfolio,
  removeFromPortfolio,
} from './actions';

// EXTENDED TYPE WITH RELATED PHOTO DATA
type PortfolioItemWithPhoto = PortfolioItem & {
  photo: Photo;
};

export default function PortfolioManager() {
  // STATE MANAGEMENT
  const [available, setAvailable] = useState<Photo[]>([]);
  const [current, setCurrent] = useState<PortfolioItemWithPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // DATA FETCHING (MEMOIZED)
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [avail, curr] = await Promise.all([
        getAvailablePhotos(),
        getPortfolioManagementItems(),
      ]);
      setAvailable(avail);
      setCurrent(curr as PortfolioItemWithPhoto[]);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // INITIAL DATA LOAD
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ADD PHOTO TO PORTFOLIO
  const handleAdd = async (photoId: string) => {
    await addToPortfolio(photoId);
    await loadData();
  };

  // REMOVE PHOTO FROM PORTFOLIO
  const handleRemove = async (itemId: string) => {
    await removeFromPortfolio(itemId);
    await loadData();
  };

  return (
    // MAIN CONTAINER
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3 text-zinc-400">
          <LayoutGrid size={24} />
          <h1 className="text-2xl font-semibold text-white">
            Portfolio Manager
          </h1>
        </div>
        {isLoading && (
          <Loader2 className="animate-spin text-zinc-500" size={20} />
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* CURRENT PORTFOLIO SECTION */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold">
              In Portfolio ({current.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-zinc-800 p-4 rounded-xl bg-zinc-900/30 min-h-50">
            {current.length === 0 && !isLoading && (
              <div className="col-span-full flex items-center justify-center text-zinc-600 text-sm italic">
                No photos in portfolio yet
              </div>
            )}

            {current.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square group overflow-hidden rounded-lg bg-zinc-800"
              >
                {/* PORTFOLIO IMAGE */}
                <Image
                  src={item.photo.url}
                  alt={item.photo.title || 'Portfolio image'}
                  fill
                  className="object-cover opacity-80"
                />

                {/* REMOVE BUTTON OVERLAY */}
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute inset-0 bg-red-600/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  title="Remove from portfolio"
                >
                  <Trash2 className="text-white" size={24} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* AVAILABLE PHOTOS SECTION */}
        <section>
          <h2 className="text-sm uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4">
            Available Library
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {available.length === 0 && !isLoading && (
              <div className="col-span-full text-zinc-600 text-sm">
                All photos are already in portfolio or library is empty.
              </div>
            )}

            {available.map((photo) => (
              <div
                key={photo.id}
                className="relative aspect-square group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
              >
                {/* LIBRARY IMAGE */}
                <Image
                  src={photo.url}
                  alt={photo.title || 'Library image'}
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />

                {/* ADD BUTTON */}
                <button
                  onClick={() => handleAdd(photo.id)}
                  className="absolute bottom-2 right-2 p-2 bg-white text-black rounded-full shadow-2xl translate-y-12 group-hover:translate-y-0 transition-all duration-300 hover:bg-zinc-200"
                  title="Add to portfolio"
                >
                  <Plus size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
