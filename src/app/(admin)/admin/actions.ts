'use server';

import { signOut } from '@/lib/auth';

// LOGOUT ACTION
export async function logoutAction() {
  await signOut({ redirectTo: '/' });
}
