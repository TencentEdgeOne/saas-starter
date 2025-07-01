import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'EdgeOne Saas Starter - Build Your Next SaaS Product',
    template: '%s | EdgeOne Saas Starter'
  },
  description: 'A modern SaaS starter template with all the components you need to build your next product.',
  keywords: ['SaaS', 'Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  authors: [{ name: 'EdgeOne Saas Starter' }],
  creator: 'EdgeOne Saas Starter',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edgeone-saas-starter.com',
    title: 'EdgeOne Saas Starter - Build Your Next SaaS Product',
    description: 'A modern SaaS starter template with all the components you need to build your next product.',
    siteName: 'EdgeOne Saas Starter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EdgeOne Saas Starter - Build Your Next SaaS Product',
    description: 'A modern SaaS starter template with all the components you need to build your next product.',
    creator: '@saas_starter',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            {/* Google Analytics */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 