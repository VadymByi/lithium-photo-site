'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export interface ActionState {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string | null;
}
export async function loginAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFields = LoginSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please check your input.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/admin',
    });
    return { message: 'Success', errors: {} };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { message: 'Invalid email or password.', errors: {} };
        default:
          return { message: 'Something went wrong.', errors: {} };
      }
    }
    throw error;
  }
}
