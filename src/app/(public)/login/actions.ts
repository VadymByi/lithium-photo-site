'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

// LOGIN VALIDATION SCHEMA
const LoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
});

// ACTION STATE TYPE
export interface ActionState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  error?: string; // Поменяли message на error для совместимости с интерфейсом страницы
}

// LOGIN ACTION HANDLER
export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // EXTRACT AND VALIDATE FORM DATA
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    // Берем первую ошибку валидации из Zod для вывода в общую плашку
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors)[0]?.[0] ||
      'Пожалуйста, проверьте введенные данные.';

    return {
      errors: fieldErrors,
      error: firstError,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    // ATTEMPT SIGN IN
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    });

    return { error: undefined, errors: {} };
  } catch (error) {
    // HANDLE AUTH ERRORS
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Неверный email или пароль.', errors: {} };
        default:
          return {
            error: 'Ошибка аутентификации. Попробуйте позже.',
            errors: {},
          };
      }
    }

    // RE-THROW REDIRECT ERRORS (Next.js обрабатывает редиректы через бросание ошибок, это важно не гасить)
    throw error;
  }
}
