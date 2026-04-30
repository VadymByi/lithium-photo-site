import cloudinary from '@/lib/cloudinary';

// CORE TYPE
export type UploadImageResult = {
  publicId: string;
  url: string;
  secureUrl: string;
  width: number;
  height: number;
  format?: string;
};

// UNIVERSAL UPLOADER
export async function uploadImage(
  file: File,
  folder: string,
): Promise<UploadImageResult> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<UploadImageResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: {
            quality: 'auto',
            fetch_format: 'auto',
          },
        },
        (error, res) => {
          if (error || !res) return reject(error);

          resolve({
            publicId: res.public_id,
            url: res.url,
            secureUrl: res.secure_url,
            width: res.width,
            height: res.height,
            format: res.format,
          });
        },
      )
      .end(buffer);
  });

  return result;
}
