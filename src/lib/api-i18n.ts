import { NextRequest } from 'next/server'
import { Locale, defaultLocale, locales } from './i18n'
import { getDictionary } from './dictionaries'

/**
 * Extract locale from request URL or headers
 * Supports:
 * - URL path: /en/api/... or /zh/api/...
 * - Query parameter: ?lang=en or ?lang=zh
 * - Referer header (extract from referring page URL)
 * - Accept-Language header
 */
export async function getLocaleFromRequest(request: NextRequest): Promise<Locale> {
  // Try to get from URL path
  const pathname = request.nextUrl.pathname
  const pathLocale = pathname.split('/').find(segment => locales.includes(segment as Locale))
  if (pathLocale) {
    return pathLocale as Locale
  }

  // Try to get from query parameter
  const langParam = request.nextUrl.searchParams.get('lang')
  if (langParam && locales.includes(langParam as Locale)) {
    return langParam as Locale
  }

  // Try to get from Referer header (most reliable for API calls from frontend)
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      const refererPath = refererUrl.pathname
      const refererLocale = refererPath.split('/').find(segment => locales.includes(segment as Locale))
      if (refererLocale) {
        return refererLocale as Locale
      }
    } catch (e) {
      // Invalid referer URL, continue to next method
    }
  }

  // Try to get from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,zh-CN;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [code] = lang.trim().split(';')
        return code.split('-')[0] // Extract base language code
      })
    
    for (const lang of languages) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale
      }
    }
  }

  // Fallback to default locale
  return defaultLocale
}

/**
 * Get dictionary for the request locale
 */
export async function getRequestDictionary(request: NextRequest) {
  const locale = await getLocaleFromRequest(request)
  return await getDictionary(locale)
}

