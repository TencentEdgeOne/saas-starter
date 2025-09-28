import React from 'react'
import { Layout } from '@/components/layout/layout'
import { BlogCard } from '@/components/ui/blog-card'
import { getAllPosts } from '@/lib/blog'
import { getDictionary } from '@/lib/dictionaries'
import { Locale, locales } from '@/lib/i18n'
import { getHighlightedText } from '@/lib/text-highlight'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return locales.map((locale) => ({
    lang: locale
  }));
}

export default async function BlogPage({params}: {params: {lang: Locale}}) {
  const posts = getAllPosts(params.lang)
  const dict = await getDictionary(params.lang);

  return (
    <Layout dict={dict}>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-responsive-xl font-bold text-foreground mb-6">
              <span dangerouslySetInnerHTML={{
                __html: getHighlightedText(dict.blog.pageTitle, params.lang)
              }} />
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {dict.blog.pageSubtitle}
            </p>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="section-padding">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {dict.blog.noPosts.title}
                </h3>
                <p className="text-muted-foreground mb-8">
                  {dict.blog.noPosts.description}
                </p>
                <div className="text-sm text-muted-foreground">
                  <p>
                    {dict.blog.noPosts.instructions.line1}{' '}
                    <code>{dict.blog.noPosts.instructions.directory}</code>{' '}
                    {dict.blog.noPosts.instructions.line2}
                  </p>
                  <p>{dict.blog.noPosts.instructions.line3}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} variant="wide" className="h-full" lang={params.lang} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  )
} 