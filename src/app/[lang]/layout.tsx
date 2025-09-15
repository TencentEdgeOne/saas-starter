import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Locale, locales } from '@/lib/i18n'
import { generateMetadata as generateI18nMetadata } from '@/lib/metadata'
import { getServerUser } from '@/lib/auth-server'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale }
}) {
  return await generateI18nMetadata(params.lang)
}

// Generate all language paths for static export
export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale,
  }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  // 在服务端获取用户认证状态
  const { user } = await getServerUser()

  return (
    // <html lang={params.lang} suppressHydrationWarning>
      // <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </ThemeProvider>
      // </body>
    // </html>
  )
} 