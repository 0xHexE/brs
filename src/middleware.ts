import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  return NextResponse.next();
  // const { pathname } = request.nextUrl;
  //
  // // Define public paths that don't require authentication
  // const publicPaths = ['/', '/auth/login', '/auth/signup', '/api/auth'];
  //
  // // Check if the current path is public
  // const isPublicPath = publicPaths.some(
  //   (path) => pathname === path || pathname.startsWith(path),
  // );
  //
  // // If it's a public path, allow access
  // if (isPublicPath) {
  //   // If user is already authenticated and trying to access login/signup, redirect to dashboard
  //   if (pathname.startsWith('/auth/')) {
  //     try {
  //       const session = await auth.api.getSession({
  //         headers: request.headers,
  //       });
  //
  //       if (session) {
  //         return NextResponse.redirect(new URL('/dashboard', request.url));
  //       }
  //     } catch (error) {
  //       // Continue to login if session check fails
  //     }
  //   }
  //
  //   // If it's the root path and user is authenticated, redirect to dashboard
  //   if (pathname === '/') {
  //     try {
  //       const session = await auth.api.getSession({
  //         headers: request.headers,
  //       });
  //
  //       if (session) {
  //         return NextResponse.redirect(new URL('/dashboard', request.url));
  //       }
  //     } catch (error) {
  //       // Continue to public access if session check fails
  //     }
  //   }
  //
  //   return NextResponse.next();
  // }
  //
  // // For protected routes (app folder), check authentication
  // try {
  //   const session = await auth.api.getSession({
  //     headers: request.headers,
  //   });
  //
  //   if (!session) {
  //     // User is not authenticated, redirect to login
  //     const loginUrl = new URL('/auth/login', request.url);
  //     loginUrl.searchParams.set('redirectTo', pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  //
  //   // User is authenticated, allow access
  //   return NextResponse.next();
  // } catch (error) {
  //   console.error('Middleware auth error:', error);
  //   // If there's an error checking session, redirect to login
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
  runtime: 'nodejs',
};
