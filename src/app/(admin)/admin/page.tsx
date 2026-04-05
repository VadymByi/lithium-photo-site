import ProtectedImage from '@/components/shared/ProtectedImage';
import { getProtectedImageUrl } from '@/lib/cloudinary-client';

export default function AdminPage() {
  const imageUrl = getProtectedImageUrl('Lithium_gallery/zpmwbk2s8yufgdsj9vja');
  return (
    <>
      <h1>Admin board</h1>
      <ProtectedImage
        src={imageUrl}
        alt="Protected content"
        width={500}
        height={500}
      />
    </>
  );
}
