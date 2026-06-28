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
  message?: string | null;
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
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Пожалуйста, проверьте введенные данные.',
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

    return { message: 'Успешный вход', errors: {} };
  } catch (error) {
    // HANDLE AUTH ERRORS
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Неверный email или пароль.', errors: {} };
        default:
          return {
            message: 'Ошибка аутентификации. Попробуйте позже.',
            errors: {},
          };
      }
    }

    // RE-THROW REDIRECT ERRORS
    throw error;
  }
}
