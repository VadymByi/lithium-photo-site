'use client';

import { SiteConfig } from '@prisma/client';
import { useState } from 'react';
import { updateSiteConfig } from './actions';
import { SITE_SETTINGS_MENU } from '@/constants/site-config';

interface Props {
  initialConfig: SiteConfig;
}

// SETTINGS TOGGLES COMPONENT
export default function SettingsForm({ initialConfig }: Props) {
  // STATE
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [isUpdating, setIsUpdating] = useState(false);

  // TOGGLE HANDLER
  const handleToggle = async (field: keyof SiteConfig) => {
    if (isUpdating) return;

    const currentValue = !!config[field];
    const newValue = !currentValue;

    // OPTIMISTIC UI UPDATE
    setConfig((prev) => ({ ...prev, [field]: newValue }));
    setIsUpdating(true);

    try {
      const result = await updateSiteConfig({ [field]: newValue });

      if (!result.success) {
        throw new Error('Update failed');
      }
    } catch (err) {
      alert('Ошибка при сохранении настройки');

      console.error(
        'Settings update error:',
        err instanceof Error ? err.message : err,
      );

      // ROLLBACK
      setConfig(initialConfig);
    } finally {
      setIsUpdating(false);
    }
  };

  // RENDER
  return (
    <div className="space-y-3">
      {SITE_SETTINGS_MENU.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-100"
        >
          <span className="font-medium text-zinc-700">{item.label}</span>

          <button
            type="button"
            onClick={() => handleToggle(item.key)}
            disabled={isUpdating}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config[item.key] ? 'bg-blue-600' : 'bg-zinc-300'
            } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                config[item.key] ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
