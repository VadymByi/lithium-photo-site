'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { uploadPhotoAction } from '@/app/(admin)/admin/photos/actions';
import { Upload, ImageIcon, Loader2, X } from 'lucide-react';

// TYPES
interface Project {
  id: string;
  title: string;
}

interface PhotoUploadFormProps {
  projects?: Project[];
  projectId?: string;
}

// MAIN PHOTO UPLOAD FORM COMPONENT
export default function PhotoUploadForm({
  projects = [],
  projectId,
}: PhotoUploadFormProps) {
  // STATE MANAGEMENT
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // HANDLE FILE SELECTION AND PREVIEW GENERATION
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

      previews.forEach((url) => URL.revokeObjectURL(url));

      setPreviews(newPreviews);
      setMessage('');
    }
  };

  // CLEAR SELECTED FILES
  const clearSelection = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);

    if (formRef.current) formRef.current.reset();
  };

  // HANDLE FORM SUBMISSION AND SEQUENTIAL UPLOAD
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');

    const files = formData.getAll('file') as File[];
    const currentProjectId = projectId || (formData.get('projectId') as string);

    if (!currentProjectId) {
      setMessage('❌ Сначала выберите проект');
      setIsPending(false);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setMessage(`⏳ Загрузка фото ${i + 1} из ${files.length}...`);

      const singleFormData = new FormData();
      singleFormData.append('file', file);
      singleFormData.append('projectId', currentProjectId);

      try {
        const result = await uploadPhotoAction(singleFormData);

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch {
        failCount++;
      }
    }

    // FINAL RESULT HANDLING
    if (failCount === 0) {
      setMessage(`✅ Все фото (${successCount}) успешно загружены!`);
      formRef.current?.reset();
      setPreviews([]);
    } else {
      setMessage(
        `⚠️ Загрузка завершена. Успешно: ${successCount}, Ошибок: ${failCount}`,
      );
    }

    setIsPending(false);
  }

  // RENDER FORM UI
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
          <Upload size={20} className="text-blue-500" />
          Массовая загрузка фотографий
        </h2>

        {previews.length > 0 && !isPending && (
          <button
            onClick={clearSelection}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <X size={14} /> Отменить выбор
          </button>
        )}
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-6">
        {/* PROJECT SELECT */}
        {!projectId && (
          <div>
            <label className="block text-sm font-semibold mb-2 text-zinc-700">
              Выберите альбом
            </label>
            <select
              name="projectId"
              disabled={isPending}
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50"
            >
              <option value="">-- Выберите проект --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PREVIEW GRID */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
            {previews.map((url, index) => (
              <div
                key={index}
                className="aspect-square relative rounded-lg overflow-hidden border border-white shadow-sm bg-zinc-200"
              >
                <img
                  src={url}
                  alt="Preview"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* UPLOAD DROPZONE */}
        <div className="relative group">
          <input
            type="file"
            name="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isPending}
            required
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />

          <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 group-hover:border-blue-400 group-hover:bg-blue-50/50 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
              <ImageIcon size={24} />
            </div>

            <div className="text-center">
              <p className="text-sm font-bold text-zinc-800">
                {previews.length > 0
                  ? `Выбрано: ${previews.length}`
                  : 'Выберите или перетащите фото'}
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Любое количество файлов за раз
              </p>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isPending || previews.length === 0}
          className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-black disabled:bg-zinc-100 disabled:text-zinc-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-100"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              {message}
            </>
          ) : (
            'Начать загрузку файлов'
          )}
        </button>

        {/* RESULT MESSAGE */}
        {message && !isPending && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.includes('✅')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
