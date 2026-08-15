import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 1. Logic for the Login Page
  if (pathname.startsWith('/admin/login')) {
    if (isLoggedIn) {
      // If already logged in, send to dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    // Explicitly allow the login page to render (This stops the infinite loop!)
    return NextResponse.next();
  }

  // 2. Logic for all other Admin Pages
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      // Not logged in? Send to login page
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  // Allow all public website routes
  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*'], 
};