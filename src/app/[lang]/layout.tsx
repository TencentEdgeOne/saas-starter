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
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  // 确保 lang 是有效的 Locale 类型
  const validLang = locales.includes(lang as Locale) ? (lang as Locale) : 'en';
  return await generateI18nMetadata(validLang)
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
  params: Promise<{ lang: string }>
}) {
  // 在服务端获取用户认证状态
  const { user } = await getServerUser()
  const { lang } = await params

  return (
   
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
     
  )
} 