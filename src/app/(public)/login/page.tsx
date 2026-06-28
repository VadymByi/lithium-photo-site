'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  // Передаем пустой объект как начальное состояние, чтобы удовлетворить типы
  const [state, formAction, isPending] = useActionState(loginAction, {
    error: undefined,
  });

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md">
        {/* ЗАГОЛОВОК */}
        <h2 className="mt-6 text-center text-3xl font-light tracking-tight text-zinc-900 uppercase">
          Вход в панель
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Lithium Photo Studio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-zinc-100 sm:rounded-xl sm:px-10">
          <form action={formAction} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@example.com"
                  className="block w-full px-3 py-2 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700"
              >
                Пароль
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="block w-full px-3 py-2 border border-zinc-200 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>

            {/* ВЫВОД ОШИБКИ */}
            {state?.error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {state.error}
              </div>
            )}

            {/* КНОПКА ОТПРАВКИ */}
            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Авторизация...' : 'Войти'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
