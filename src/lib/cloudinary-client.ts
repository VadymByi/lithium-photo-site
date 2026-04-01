export const getProtectedImageUrl = (publicId: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing');
    return '';
  }

  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
  const transformations = `w_1600,c_limit,q_auto,f_auto/o_50,l_lithium_placeholder,fl_relative,g_center`;

  return `${baseUrl}/${transformations}/${publicId}`;
};
