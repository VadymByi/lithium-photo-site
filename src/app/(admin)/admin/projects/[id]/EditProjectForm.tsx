'use client';

import { Project } from '@prisma/client';
import { useState } from 'react';
import { updateProjectAction } from '../actions';
import slugify from 'slugify';

// EDIT PROJECT FORM COMPONENT
export default function EditProjectForm({ project }: { project: Project }) {
  // STATE MANAGEMENT
  const [isPending, setIsPending] = useState(false);
  const [slug, setSlug] = useState(project.slug);
  const [message, setMessage] = useState('');

  // HANDLE TITLE CHANGE AND AUTO-GENERATE SLUG
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSlug = slugify(e.target.value, {
      lower: true,
      strict: true,
      locale: 'ru',
    });

    setSlug(newSlug);
  };

  // HANDLE FORM SUBMISSION
  async function handleSubmit(formData: FormData) {
    setIsPending(true);

    const result = await updateProjectAction(project.id, formData);

    if (result?.success) {
      setMessage('✅ Изменения сохранены');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ ${result?.error}`);
    }

    setIsPending(false);
  }

  // RENDER FORM UI
  return (
    <form action={handleSubmit} className="space-y-4">
      {/* TITLE FIELD */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
          Название
        </label>
        <input
          name="title"
          type="text"
          defaultValue={project.title}
          onChange={handleTitleChange}
          className="w-full p-3 border border-zinc-200 rounded-lg focus:border-black outline-none transition-colors"
        />
      </div>

      {/* SLUG FIELD */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
          URL (slug)
        </label>
        <input
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full p-3 border border-zinc-200 rounded-lg bg-zinc-50 text-zinc-500 text-sm outline-none"
        />
      </div>

      {/* DESCRIPTION FIELD */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
          Описание
        </label>
        <textarea
          name="description"
          defaultValue={project.description || ''}
          rows={4}
          className="w-full p-3 border border-zinc-200 rounded-lg focus:border-black outline-none transition-colors"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-zinc-800 disabled:bg-zinc-400 transition-all"
      >
        {isPending ? 'Сохранение...' : 'Обновить проект'}
      </button>

      {/* RESULT MESSAGE */}
      {message && (
        <p className="text-center text-sm font-medium mt-2">{message}</p>
      )}
    </form>
  );
}
