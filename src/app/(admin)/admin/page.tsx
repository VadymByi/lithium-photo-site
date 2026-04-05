import ProtectedImage from '@/components/shared/ProtectedImage';

export default function AdminPage() {
  return (
    <>
      <h1>Admin board</h1>
      <ProtectedImage
        publicId="Lithium_gallery/zpmwbk2s8yufgdsj9vja"
        alt="Protected content"
        width={500}
        height={500}
      />
    </>
  );
}
