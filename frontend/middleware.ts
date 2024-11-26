import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {jwtDecode} from 'jwt-decode';

import { readRoleFromJwt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public paths (paths that don't require authentication)
  const publicPaths = ['/login', '/register', '/about'];
  const isPublicPath = publicPaths.includes(pathname);

  // Define admin-only routes
  const adminOnlyRoutes = ['/LabManagement/lab-tests', '/LabManagement/employee']; // Add admin-only routes here
  const isAdminRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));

  // Get the token from cookies using NextAuth's getToken method
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Check if the token has expired
  const isTokenExpired = token?.exp ? Date.now() >= Number(token.exp) * 1000 : true;

  // Decode the token and retrieve the role
  const role = token && typeof token.access_token === 'string' ? readRoleFromJwt(token.access_token) : null;

  // Redirect to login if the path is protected and token is missing or expired
  if (!isPublicPath && (!token || isTokenExpired)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect non-admin users away from admin-only routes
  if (isAdminRoute && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirect to an unauthorized page
  }

  // If the user is authenticated and trying to access login page, redirect them to the dashboard
  if (isPublicPath && token && !isTokenExpired) {
    return NextResponse.redirect(new URL('/LabManagement', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Config to define which routes the middleware applies to (exclude API routes, static assets, etc.)
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/admin/:path*', // Apply middleware to admin routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Protect general pages
  ],
};
