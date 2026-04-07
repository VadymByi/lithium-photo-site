'use client';

import { createProjectAction } from '@/app/(admin)/admin/actions';
import { useRef, useState } from 'react';

export default function CreateProjectForm() {
  const [isPending, setIspending] = useState(false);
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIspending(true);
    setMessage('');

    const result = await createProjectAction(formData);

    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ Проект создан!');
      formRef.current?.reset();
    }
    setIspending(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-black">
        Создать новый проект (альбом)
      </h2>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Название проекта
          </label>
          <input
            name="title"
            type="text"
            required
            className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="например: Wedding in Spain"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Описание (необязательно)
          </label>
          <textarea
            name="description"
            className="w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isPending ? 'Создание...' : 'Создать проект'}
        </button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
