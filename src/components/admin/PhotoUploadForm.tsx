'use client';
import { useRef, useState } from 'react';
import { uploadPhotoAction } from '@/app/(admin)/admin/photos/actions';

interface Project {
  id: string;
  title: string;
}

export default function PhotoUploadForm({ projects }: { projects: Project[] }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');

  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');

    try {
      const result = await uploadPhotoAction(formData);

      if (result?.error) {
        setMessage(`❌ ${result.error}`);
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
            required
            disabled={isPending}
            className="w-full p-2 border rounded bg-gray-50 text-black focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          >
            <option value="">-- Выберите проект --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Файл изображения
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            disabled={isPending}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-black file:text-white
              hover:file:bg-gray-800
              disabled:opacity-50 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded font-medium
            hover:bg-blue-700 disabled:bg-gray-400 transition-colors
            flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white">
                Загрузка...
              </span>
            </>
          ) : (
            'Отправить в облако'
          )}
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
