export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <header>
        <h1 className="text-2xl font-bold text-black tracking-tight">
          Dashboard
        </h1>
        <p className="text-gray-500">
          Добро пожаловать в панель управления Lithium Photo.
        </p>
      </header>

      {/* MAIN GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SYSTEM STATUS CARD */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center min-h-[160px]">
          <p className="text-xs text-blue-600 uppercase font-bold tracking-widest mb-1">
            Статус системы
          </p>
          <p className="text-xl font-semibold text-black">
            Все системы работают
          </p>
          <p className="text-sm text-gray-400 mt-2">
            База данных Prisma и хранилище Cloudinary подключены.
          </p>
        </div>

        {/* PLACEHOLDER: VIEWS STATISTICS */}
        <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-gray-200 flex flex-col justify-center items-center text-center">
          <p className="text-gray-400 text-sm">
            Статистика просмотров появится здесь позже
          </p>
        </div>

        {/* PLACEHOLDER: RECENT ACTIVITY */}
        <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-gray-200 flex flex-col justify-center items-center text-center">
          <p className="text-gray-400 text-sm">
            Последняя активность появится здесь позже
          </p>
        </div>
      </div>
    </div>
  );
}
