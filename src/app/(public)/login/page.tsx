'use client'; // Теперь нам нужен клиентский компонент для хука

import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  // Хук принимает экшен и начальное состояние
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Вход в админку</h1>
      <form action={formAction}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ display: 'block', margin: '10px auto', padding: '8px' }}
        />

        {/* Выводим ошибку, если она пришла из экшена */}
        {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '10px 20px',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          {isPending ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
