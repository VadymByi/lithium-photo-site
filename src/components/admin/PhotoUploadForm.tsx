'use client';

import { useRef, useState, ChangeEvent } from 'react';
import { uploadPhotoAction } from '@/app/(admin)/admin/photos/actions';
import { Upload, ImageIcon, Loader2, X } from 'lucide-react';

// MAIN COMPONENT
export default function PhotoUploadForm({ projectId }: { projectId?: string }) {
  // STATE & REFS
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');
  const [previews, setPreviews] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // PREVIEW GENERATION LOGIC
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

    previews.forEach((url) => URL.revokeObjectURL(url));

    setPreviews(newPreviews);
    setMessage('');
  };

  // CLEANUP LOGIC
  const clearSelection = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
    formRef.current?.reset();
  };

  // UPLOAD HANDLER
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isPending) return;

    const formData = new FormData(formRef.current!);

    if (projectId) {
      formData.append('projectId', projectId);
    }

    setIsPending(true);
    setMessage('');

    const files = Array.from(formData.getAll('file') as File[]).filter(
      (f) => f.size > 0,
    );

    let success = 0;
    let fail = 0;

    for (const file of files) {
      try {
        const res = await uploadPhotoAction(formData);
        if (res?.success) success++;
        else fail++;
      } catch (e) {
        fail++;
      }
    }

    setMessage(`Загружено: ${success}, Ошибок: ${fail}`);
    setIsPending(false);
  }

  // RENDER UI
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
      {/* HEADER SECTION */}
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

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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

        {/* FILE INPUT DROPZONE */}
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

        {/* STATUS MESSAGES */}
        {message && !isPending && (
          <div
            className={`p-4 rounded-xl text-sm font-medium ${
              message.includes('Ошибок: 0')
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
