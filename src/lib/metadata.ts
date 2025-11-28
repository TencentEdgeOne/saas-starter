import type { Metadata } from 'next'
import { getDictionary } from './dictionaries'
import { Locale } from './i18n'

export async function generateMetadata(locale: Locale): Promise<Metadata> {
  const dict = await getDictionary(locale)
  
  return {
    title: {
      default: dict.metadata.defaultTitle,
      template: dict.metadata.titleTemplate
    },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords.split(', '),
    authors: [{ name: dict.metadata.author }],
    creator: dict.metadata.creator,
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_CN' : 'en_US',
      url: 'https://edgeone-saas-starter.com',
      title: dict.metadata.defaultTitle,
      description: dict.metadata.description,
      siteName: dict.metadata.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.defaultTitle,
      description: dict.metadata.description,
      creator: dict.metadata.twitterCreator,
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
} 