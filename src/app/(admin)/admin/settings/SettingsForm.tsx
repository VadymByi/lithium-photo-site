'use client';

import { SiteConfig } from '@prisma/client';
import { useState } from 'react';
import { updateSiteConfig } from './actions';

interface Props {
  initialConfig: SiteConfig;
}

export default function SettingsForm({ initialConfig }: Props) {
  // STATE MANAGEMENT
  const [config, setConfig] = useState(initialConfig);
  const [isUpdating, setIsUpdating] = useState(false);

  // SAVE HANDLER
  const handleSave = async (data: Partial<SiteConfig>) => {
    setIsUpdating(true);

    const result = await updateSiteConfig(data);

    if (!result || !result.success) {
      alert('Failed to save changes');
    }

    setIsUpdating(false);
  };

  // TOGGLE BOOLEAN SETTINGS
  const toggleSetting = async (field: keyof SiteConfig) => {
    if (isUpdating) return;

    const newValue = !config[field];
    setConfig((prev) => ({ ...prev, [field]: newValue }));

    await handleSave({ [field]: newValue });
  };

  // SETTINGS CONFIGURATION
  const settings = [
    { id: 'showAbout', label: 'Страница "About"', key: 'showAbout' as const },
    {
      id: 'showPortfolio',
      label: 'Страница "Portfolio"',
      key: 'showPortfolio' as const,
    },
    {
      id: 'showProjects',
      label: 'Страница "Projects"',
      key: 'showProjects' as const,
    },
    {
      id: 'showContacts',
      label: 'Страница "Contacts"',
      key: 'showContacts' as const,
    },
  ];

  return (
    <div className="max-w-2xl space-y-12">
      {/* NAVIGATION SETTINGS */}
      <section>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6">
          Навигация
        </h3>

        <div className="space-y-4">
          {settings.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between group p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100"
            >
              <label
                htmlFor={item.id}
                className="cursor-pointer text-zinc-600 group-hover:text-black font-medium"
              >
                {item.label}
              </label>

              {/* TOGGLE SWITCH */}
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id={item.id}
                  className="sr-only peer"
                  checked={config[item.key] as boolean}
                  onChange={() => toggleSetting(item.key)}
                  disabled={isUpdating}
                />
                <div className="w-11 h-6 bg-zinc-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT PAGE CONTENT SETTINGS */}
      <section className="pt-10 border-t border-zinc-200 space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
          Контент страницы About
        </h3>

        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase">
            Заголовок
          </label>
          <input
            type="text"
            className="w-full p-3 border border-zinc-200 rounded-md focus:border-black outline-none transition-colors text-xl font-light"
            value={config.aboutTitle || ''}
            onChange={(e) =>
              setConfig({ ...config, aboutTitle: e.target.value })
            }
            onBlur={() => handleSave({ aboutTitle: config.aboutTitle || '' })}
            placeholder="Напр: About the Author"
          />
        </div>

        {/* TEXTAREA INPUT */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-500 uppercase">
            Текст биографии
          </label>
          <textarea
            rows={10}
            className="w-full p-3 border border-zinc-200 rounded-md focus:border-black outline-none transition-colors leading-relaxed"
            value={config.aboutText || ''}
            onChange={(e) =>
              setConfig({ ...config, aboutText: e.target.value })
            }
            onBlur={() => handleSave({ aboutText: config.aboutText || '' })}
            placeholder="Расскажите о себе..."
          />
        </div>
      </section>

      {/* GLOBAL SAVING INDICATOR */}
      <div className="fixed bottom-8 right-8">
        {isUpdating && (
          <div className="bg-black text-white px-4 py-2 rounded-full text-xs animate-fade-in shadow-xl">
            Сохранение...
          </div>
        )}
      </div>
    </div>
  );
}
