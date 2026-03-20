import { v2 as cloudinary } from 'cloudinary';

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error('Cloudinary credentials are missing in .env');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const getProtectedImageUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 1600, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      {
        overlay: 'lithium_placeholder',
        opacity: 20,
        width: '0.5',
        flags: 'relative',
        gravity: 'center',
      },
    ],
    secure: true,
  });
};

export default cloudinary;
