'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProjectAction } from '../actions';
import { Trash2 } from 'lucide-react';

// DELETE PROJECT BUTTON COMPONENT
export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  // STATE AND ROUTER
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // HANDLE DELETE ACTION
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Вы уверены, что хотите удалить проект "${projectTitle}"? \nВсе фотографии этого проекта будут удалены безвозвратно.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const result = await deleteProjectAction(projectId);

      if (result.success) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        alert(result.error || 'Ошибка при удалении');
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Произошла системная ошибка');
      setIsDeleting(false);
    }
  };

  // RENDER BUTTON
  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-sm font-bold shadow-sm disabled:opacity-50"
    >
      <Trash2 size={18} />
      {isDeleting ? 'Удаление...' : 'Удалить проект полностью'}
    </button>
  );
}
