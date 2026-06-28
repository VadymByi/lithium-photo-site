import cloudinary from '@/lib/cloudinary';

// TYPES
export type UploadImageResult = {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format?: string;
};

// UPLOAD SERVICE
export async function uploadImage(
  file: File,
  folder: string,
): Promise<UploadImageResult> {
  // BUFFER CONVERSION
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // CLOUDINARY UPLOAD STREAM
  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error || !result) return reject(error);

          resolve({
            publicId: result.public_id,
            url: result.url,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        },
      )
      .end(buffer);
  });
}
