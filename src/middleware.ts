import NextAuth from 'next-auth';
import { authConfig } from 'auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Добавляем jpg, jpeg, gif, svg и обязательно webp
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
