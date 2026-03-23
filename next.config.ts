import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true, // Ваша текущая настройка для React 19
  images: {
    formats: ['image/avif', 'image/webp'],
    // Для сайта фотографа также полезно разрешить большие размеры
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Разрешаем все пути на этом домене
      },
    ],
  },
};

export default nextConfig;
