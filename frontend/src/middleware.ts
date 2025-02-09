import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/splash', '/forgot-password', '/'];

// List of protected routes that require authentication
const protectedRoutes = [
  '/learning',
  '/learning-path',
  '/learning/dashboard',
  '/learning/balance-sheet',
  '/learning/ebitda',
  '/learning/financial-statements',
  '/settings',
  '/analysis'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // For protected routes, check for authentication token
  const token = request.cookies.get('token');

  // If no token is present and trying to access protected route, redirect to login
  if (!token && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all protected routes:
     * - /learning
     * - /learning-path
     * - /dashboard
     * - /settings
     * - /analysis
     */
    '/learning/:path*',
    '/learning-path',
    '/dashboard',
    '/settings',
    '/analysis',
  ],
}; 