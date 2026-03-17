'use server';

import { signIn } from '../../../lib/auth';
import { AuthError } from 'next-auth';

// Добавляем prevState первым аргументом
export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/admin',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Возвращаем объект ошибки, который попадет в переменную state на клиенте
      return { error: 'Неверный логин или пароль' };
    }
    // ВАЖНО: Next.js использует проброс ошибок для редиректов.
    // Если это ошибка редиректа — пробрасываем её дальше.
    throw error;
  }
}
