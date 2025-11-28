import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // If it's root path, let frontend page handle language detection
  if (pathname === '/') {
    return NextResponse.next();
  }
  if (pathname.includes('blocks/preview')) {
    return NextResponse.next();
  }

  // Check if path already contains supported language
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If no language identifier, redirect to default language
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip internal paths (_next)
    '/((?!_next|api|favicon.ico|.*\\..*|.*\\.|$).*)',
    '/'
  ],
}; 