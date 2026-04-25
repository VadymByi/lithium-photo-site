import { getSiteConfig } from './actions';
import SettingsForm from './SettingsForm';

export default async function SettingPage() {
  const config = await getSiteConfig();

  if (!config) {
    return <div className="p-8">Ошибка загрузки настроек</div>;
  }
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-8">Настройки сайта</h1>
      <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6 text-zinc-800">
          Видимость страниц в меню
        </h2>
        <SettingsForm initialConfig={config} />
      </div>
    </div>
  );
}
