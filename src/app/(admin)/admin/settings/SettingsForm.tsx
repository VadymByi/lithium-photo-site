'use client';

import { SiteConfig } from '@prisma/client';
import { useState } from 'react';
import { updateSiteConfig } from './actions';

// COMPONENT PROPS TYPE
interface Props {
  initialConfig: SiteConfig;
}

// MAIN SETTINGS FORM COMPONENT
export default function SettingsForm({ initialConfig }: Props) {
  // STATE MANAGEMENT
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  const [isUpdating, setIsUpdating] = useState(false);

  // HANDLE TOGGLE WITH OPTIMISTIC UPDATE
  const handleToggle = async (field: keyof SiteConfig) => {
    if (isUpdating) return;

    const oldValue = config[field] as boolean;
    const newValue = !oldValue;

    setConfig((prev) => ({ ...prev, [field]: newValue }));
    setIsUpdating(true);

    try {
      const result = await updateSiteConfig({ [field]: newValue });

      if (!result.success) {
        throw new Error('Failed to update');
      }
    } catch (err) {
      alert('Ошибка сохранения');
      setConfig(initialConfig);
    } finally {
      setIsUpdating(false);
    }
  };

  // MENU ITEMS CONFIGURATION
  const menuItems = [
    { id: 'showAbout', label: 'About', key: 'showAbout' as const },
    { id: 'showPortfolio', label: 'Portfolio', key: 'showPortfolio' as const },
    { id: 'showProjects', label: 'Projects', key: 'showProjects' as const },
    { id: 'showContacts', label: 'Contacts', key: 'showContacts' as const },
  ];

  // RENDER SETTINGS LIST
  return (
    <div className="space-y-3">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl"
        >
          <span className="font-medium text-zinc-700">{item.label}</span>

          {/* TOGGLE BUTTON */}
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
