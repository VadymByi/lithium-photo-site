import { getSiteConfig } from './actions';
import SettingsForm from './SettingsForm';

// DISABLE PAGE CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// MAIN SETTINGS PAGE COMPONENT
export default async function SettingPage() {
  // FETCH SITE CONFIGURATION
  const config = await getSiteConfig();

  // ERROR STATE
  if (!config) {
    return <div className="p-8 text-red-500">Ошибка загрузки конфигурации</div>;
  }

  // RENDER SETTINGS UI
  return (
    <div className="p-8 max-w-2xl">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-8 text-zinc-900">Настройки сайта</h1>

      {/* SETTINGS CONTAINER */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-zinc-800">
          Видимость разделов меню
        </h2>

        {/* SETTINGS FORM WITH FORCED REMOUNT */}
        <SettingsForm key={JSON.stringify(config)} initialConfig={config} />
      </div>
    </div>
  );
}
