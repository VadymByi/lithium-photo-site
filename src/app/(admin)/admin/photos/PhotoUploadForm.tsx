'use client';
import { useState } from 'react';
import { uploadPhotoAction } from './actions';

export default function PhotoUploadForm({ projects }: { projects: any[] }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');

    const result = await uploadPhotoAction(formData);

    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ Фото успешно загружено!');
    }
    setIsPending(false);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Выберите проект
        </label>
        <select
          name="projectId"
          required
          className="w-full p-2 border rounded bg-gray-50 text-black"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Файл изображения
        </label>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 rounded font-medium disabled:bg-gray-400 transition-colors"
      >
        {isPending ? 'Загрузка...' : 'Отправить в облако'}
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </form>
  );
}
