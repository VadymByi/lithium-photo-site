export function getProtectedImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn('Miss env NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
    return '';
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
  const baseTransform = 'ar_1:1,c_fill,g_auto,w_1920,q_auto,f_auto';

  const overlayTransform =
    'l_lithium_placeholder,o_30,w_0.3,fl_relative,g_center';

  return `${baseUrl}${baseTransform}/${overlayTransform}/${publicId}`;
}
