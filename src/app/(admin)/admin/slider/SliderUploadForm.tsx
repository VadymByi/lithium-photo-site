'use client';

import { useState, useRef } from 'react';
import { createSliderItem } from './actions';

export default function SliderUploadForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');

    const result = await createSliderItem(formData);

    if (result?.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ Слайд добавлен!');
      formRef.current?.reset();
    }
    setIsPending(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm mb-10">
      <h2 className="text-lg font-bold mb-4 text-zinc-800">
        Добавить новый слайд
      </h2>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-600">
              Заголовок
            </label>
            <input
              name="title"
              type="text"
              className="w-full p-2 border rounded bg-zinc-50 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-600">
              Цвет фона (HEX)
            </label>
            <input
              name="backgroundColor"
              type="text"
              defaultValue="#111111"
              className="w-full p-2 border rounded bg-zinc-50 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-600">
            Описание
          </label>
          <textarea
            name="description"
            rows={2}
            className="w-full p-2 border rounded bg-zinc-50 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-600">
            Изображение
          </label>
          <input
            name="file"
            type="file"
            accept="image/*"
            required
            className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-zinc-800 disabled:bg-zinc-400 transition-all"
        >
          {isPending ? 'Загрузка...' : 'Загрузить и добавить'}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 p-2 rounded ${message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
