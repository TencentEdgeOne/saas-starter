import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n';
import { createClient } from '@supabase/supabase-js';

// 创建 Supabase 客户端用于中间件
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 管理员路由保护 - 让 layout 组件处理所有认证逻辑
  if (pathname.startsWith('/admin')) {
    // 直接让请求通过，让 layout 组件处理认证和显示逻辑
    return NextResponse.next();
  }

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