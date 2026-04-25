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

  // TOGGLE SETTING HANDLER WITH OPTIMISTIC UPDATE
  const toggleSetting = async (field: keyof Omit<SiteConfig, 'id'>) => {
    if (isUpdating) return;

    setIsUpdating(true);
    const newValue = !config[field];

    setConfig((prev) => ({ ...prev, [field]: newValue }));

    const result = await updateSiteConfig({ [field]: newValue });

    if (!result || !result.success) {
      alert('Failed to update settings');
      setConfig((prev) => ({ ...prev, [field]: !newValue }));
    }

    setIsUpdating(false);
  };

  // SETTINGS CONFIGURATION LIST
  const settings = [
    { id: 'showAbout', label: 'Страница "About"', key: 'showAbout' as const },
    {
      id: 'showPortfolio',
      label: 'Страница "Portfolio" (Избранное)',
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
    <div className="space-y-6">
      {/* SETTINGS LIST UI */}
      {settings.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between group p-2 hover:bg-zinc-50 rounded-lg transition-colors"
        >
          <label
            htmlFor={item.id}
            className="cursor-pointer text-zinc-600 group-hover:text-black transition-colors grow"
          >
            {item.label}
          </label>

          {/* TOGGLE SWITCH */}
          <div className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id={item.id}
              className="sr-only peer"
              checked={config[item.key]}
              onChange={() => toggleSetting(item.key)}
              disabled={isUpdating}
            />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
          </div>
        </div>
      ))}

      {/* LOADING STATE */}
      <div className="h-4">
        {isUpdating && (
          <p className="text-xs text-zinc-400 animate-pulse text-right italic">
            Сохранение...
          </p>
        )}
      </div>
    </div>
  );
}
