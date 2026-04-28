'use client';

import { useRef, useState } from 'react';
import { uploadPhotoAction } from '@/app/(admin)/admin/photos/actions';

// PROJECT TYPE
interface Project {
  id: string;
  title: string;
}

// PHOTO UPLOAD FORM COMPONENT
export default function PhotoUploadForm({ projects }: { projects: Project[] }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ projectId?: string[] }>({});
  const formRef = useRef<HTMLFormElement>(null);

  // HANDLE FORM SUBMIT
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');
    setFieldErrors({});

    try {
      const result = await uploadPhotoAction(formData);

      if (result?.error) {
        setMessage(`❌ ${result.error}`);
        if (result.details) {
          setFieldErrors(result.details as { projectId?: string[] });
        }
      } else {
        setMessage('✅ Фото успешно загружено!');
        formRef.current?.reset();
      }
    } catch (error) {
      setMessage('❌ Произошла непредвиденная ошибка');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-black">
        Добавить новое фото
      </h2>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Выберите проект
          </label>
          <select
            name="projectId"
            disabled={isPending}
            className={`w-full p-2 border rounded bg-gray-50 text-black outline-none transition-all disabled:opacity-50 ${
              fieldErrors.projectId
                ? 'border-red-500 ring-1 ring-red-500'
                : 'focus:ring-2 focus:ring-blue-500'
            }`}
          >
            <option value="">-- Выберите проект --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          {fieldErrors.projectId && (
            <p className="text-red-500 text-xs mt-1">
              {fieldErrors.projectId[0]}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Файл изображения
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            disabled={isPending}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 disabled:opacity-50 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          {isPending ? 'Загрузка...' : 'Отправить в облако'}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 p-2 rounded ${
              message.includes('✅')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
