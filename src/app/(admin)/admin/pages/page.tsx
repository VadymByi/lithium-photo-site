import { getSiteConfig } from '../settings/actions';
import AboutEditForm from './AboutEditForm';

// MAIN ADMIN PAGE COMPONENT
export default async function PagesAdmin() {
  // FETCH SITE CONFIGURATION
  const siteConfig = await getSiteConfig();

  // ERROR STATE
  if (!siteConfig) return <div>Ошибка загрузки конфигурации</div>;

  // RENDER ADMIN UI
  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <header>
        <h1 className="text-2xl font-bold text-black tracking-tight">
          Управление страницами
        </h1>
        <p className="text-gray-500 text-sm">
          Редактирование текстового наполнения разделов сайта.
        </p>
      </header>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 gap-8">
        {/* ABOUT SECTION */}
        <section className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            {/* SECTION HEADER */}
            <div>
              <h2 className="text-lg font-bold text-black">
                Страница "О себе"
              </h2>
              <p className="text-xs text-gray-400">
                Персональная информация и биография
              </p>
            </div>
          </div>

          {/* ABOUT EDIT FORM */}
          <AboutEditForm initialConfig={siteConfig} />
        </section>
      </div>
    </div>
  );
}
