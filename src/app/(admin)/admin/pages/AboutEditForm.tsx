'use client';

import { SiteConfig } from '@prisma/client';
import { useState } from 'react';
import { updateSiteConfig } from '../settings/actions';

// COMPONENT PROPS TYPE
interface Props {
  initialConfig: SiteConfig;
}

// MAIN ABOUT EDIT FORM COMPONENT
export default function AboutEditForm({ initialConfig }: Props) {
  // STATE MANAGEMENT
  const [config, setConfig] = useState(initialConfig);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{
    aboutTitle?: string[];
    aboutText?: string[];
  }>({});

  // HANDLE SAVE WITH VALIDATION AND ERROR HANDLING
  const handleSave = async (data: Partial<SiteConfig>) => {
    setIsUpdating(true);
    setErrors({});

    const result = await updateSiteConfig(data);

    if (!result?.success) {
      if (result?.errors) {
        setErrors(result.errors);
      } else {
        alert(result?.error || 'Failed to save changes');
      }
    }

    setIsUpdating(false);
  };

  // RENDER FORM UI
  return (
    <div className="space-y-6 max-w-3xl">
      {/* TITLE FIELD */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Заголовок страницы
        </label>
        <input
          type="text"
          className={`w-full p-4 border rounded-xl outline-none transition-all text-2xl font-light shadow-sm ${
            errors.aboutTitle
              ? 'border-red-500 bg-red-50'
              : 'border-zinc-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          }`}
          value={config.aboutTitle || ''}
          onChange={(e) => setConfig({ ...config, aboutTitle: e.target.value })}
          onBlur={() => handleSave({ aboutTitle: config.aboutTitle || '' })}
          placeholder="Например: Обо мне"
        />
        {errors.aboutTitle && (
          <p className="text-red-500 text-xs">{errors.aboutTitle[0]}</p>
        )}
      </div>

      {/* BIO TEXT FIELD */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Текст биографии
        </label>
        <textarea
          rows={12}
          className={`w-full p-4 border rounded-xl outline-none transition-all leading-relaxed shadow-sm ${
            errors.aboutText
              ? 'border-red-500 bg-red-50'
              : 'border-zinc-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
          }`}
          value={config.aboutText || ''}
          onChange={(e) => setConfig({ ...config, aboutText: e.target.value })}
          onBlur={() => handleSave({ aboutText: config.aboutText || '' })}
          placeholder="Расскажите о своем творческом пути..."
        />
        {errors.aboutText && (
          <p className="text-red-500 text-xs">{errors.aboutText[0]}</p>
        )}
      </div>

      {/* LOADING INDICATOR */}
      {isUpdating && (
        <div className="fixed bottom-10 right-10 bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-2xl animate-bounce">
          Сохранение контента...
        </div>
      )}
    </div>
  );
}
