'use client';

import { createProjectAction } from '@/app/(admin)/admin/actions';
import { useRef, useState } from 'react';
import slugify from 'slugify';

// FIELD ERRORS TYPE
interface FieldErrors {
  title?: string[];
  slug?: string[];
  description?: string[];
}

// CREATE PROJECT FORM COMPONENT
export default function CreateProjectForm() {
  const [isPending, setIspending] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [slug, setSlug] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // HANDLE TITLE CHANGE AND AUTO-GENERATE SLUG
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = slugify(title, {
      lower: true,
      strict: true,
      locale: 'ru',
    });
    setSlug(generatedSlug);

    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  // HANDLE FORM SUBMIT
  async function handleSubmit(formData: FormData) {
    setIspending(true);
    setMessage('');
    setErrors({});

    const result = await createProjectAction(formData);

    if (result?.error) {
      setMessage(`❌ ${result.error}`);

      if (result.details) {
        setErrors(result.details as FieldErrors);
      }
    } else {
      setMessage('✅ Проект создан!');
      formRef.current?.reset();
      setSlug('');
      setErrors({});
    }

    setIspending(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold mb-4 text-black">
        Создать новый проект (альбом)
      </h2>
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        {/* TITLE FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Название проекта
          </label>
          <input
            name="title"
            type="text"
            onChange={handleTitleChange}
            className={`w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 ${
              errors.title
                ? 'border-red-500 focus:ring-red-200'
                : 'focus:ring-blue-500'
            }`}
            placeholder="например: Wedding in Spain"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>
          )}
        </div>

        {/* SLUG FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-400 italic">
            URL-адрес проекта
          </label>
          <input
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              if (errors.slug) {
                setErrors((prev) => ({ ...prev, slug: undefined }));
              }
            }}
            className={`w-full p-2 border rounded text-sm outline-none ${
              errors.slug
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-gray-100 text-gray-500'
            }`}
            placeholder="wedding-in-spain"
          />
          {errors.slug && (
            <p className="text-red-500 text-xs mt-1">{errors.slug[0]}</p>
          )}
        </div>

        {/* DESCRIPTION FIELD */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Описание (необязательно)
          </label>
          <textarea
            name="description"
            className={`w-full p-2 border rounded bg-gray-50 text-black outline-none focus:ring-2 ${
              errors.description
                ? 'border-red-500 focus:ring-red-200'
                : 'focus:ring-blue-500'
            }`}
            rows={2}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 text-white py-2 rounded font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {isPending ? 'Создание...' : 'Создать проект'}
        </button>

        {message && (
          <p
            className={`text-sm mt-2 ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
