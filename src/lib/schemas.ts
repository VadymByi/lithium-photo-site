import { z } from 'zod';

// PHOTO VALIDATION SCHEMA
export const photoSchema = z.object({
  title: z.string().max(100).optional().nullable(),
  publicId: z.string().min(1),
  url: z.string().url(),
  projectId: z.string().optional().nullable(),
});

// PROJECT VALIDATION SCHEMA
export const projectSchema = z.object({
  title: z.string().min(3, 'Заголовок должен быть минимум 3 символа').max(100),
  slug: z
    .string()
    .min(3, 'Slug слишком короткий')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug может содержать только строчные латинские буквы, цифры и дефис',
    ),
  description: z
    .string()
    .max(1000, 'Описание слишком длинное')
    .optional()
    .nullable(),
});

// PORTFOLIO ITEM VALIDATION SCHEMA
export const portfolioItemSchema = z.object({
  photoId: z.string().cuid('Некорректный формат ID фотографии'),
  order: z.number().int().default(0),
});

// SITE CONFIGURATION VALIDATION SCHEMA
export const siteConfigSchema = z.object({
  showAbout: z.boolean(),
  showPortfolio: z.boolean(),
  showProjects: z.boolean(),
  showContacts: z.boolean(),
  aboutTitle: z.string().min(1, 'Заголовок обязателен').max(100).optional(),
  aboutText: z.string().max(3000, 'Текст слишком длинный').optional(),
  aboutImageUrl: z
    .string()
    .url('Некорректная ссылка')
    .nullable()
    .optional()
    .or(z.literal('')),
});

// MAIN SLIDER VALIDATION SCHEMA
export const mainSliderItemSchema = z.object({
  title: z.string().max(100, 'Заголовок слишком длинный').optional(),
  description: z
    .string()
    .max(500, 'Описание слишком длинное')
    .optional()
    .nullable(),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Некорректный формат цвета')
    .optional(),
  photoId: z.string().cuid('Некорректный ID фотографии'),
  order: z.coerce.number().int().default(0),
});

// TYPES INFERENCE
export type ProjectInput = z.infer<typeof projectSchema>;
export type PhotoInput = z.infer<typeof photoSchema>;
