import NextAuth from 'next-auth';
import { authConfig } from 'auth.config';

// AUTH MIDDLEWARE
export default NextAuth(authConfig).auth;

// MIDDLEWARE CONFIGURATION
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
