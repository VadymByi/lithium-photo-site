import { auth } from './lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export async function middleware(req: NextRequest) {
  const session = await auth();

  const isLoggedIn = !!session;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
