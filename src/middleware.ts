import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('studyflow_session')?.value;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // If on login page and already has session, redirect to overview
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

