// src/types/photo.ts
import { Photo as PrismaPhoto } from '@prisma/client';

export type Photo = PrismaPhoto;

export interface PhotoListProps {
  photos: Photo[];
}
