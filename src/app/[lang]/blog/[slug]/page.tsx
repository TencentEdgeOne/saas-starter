import React from 'react'
import { notFound } from 'next/navigation'
import { Layout } from '@/components/layout/layout'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react'
import { getPostBySlug, getAllPosts } from '@/lib/blog'
import { getDictionary } from '@/lib/dictionaries'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

// 强制动态渲染，因为需要显示用户认证状态
// export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: Promise<{
    lang: string
    slug: string
  }>;
}

export async function generateStaticParams() {
  const langs = ['en', 'zh']

  const params = []
  for (const lang of langs) {
    const posts = getAllPosts(lang)
    for (const post of posts) {
      params.push({
        lang,
        slug: post.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { lang,slug } = await params;
  const post = await getPostBySlug(slug, lang)
  if (!post) {
    return {
      title: 'Blog Post Not Found',
    }
  }

  return {
    title: `${post.title}`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { lang,slug } = await params;
  const post = await getPostBySlug(slug, lang)
  const dict = await getDictionary(lang as 'en' | 'zh')

  if (!post) {
    notFound()
  }

  return (
    <Layout dict={dict}>
      <div className="pt-24">
        <main>
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link 
            href={`/${lang}/blog`}
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-responsive-lg font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{dict.blog.article.readTime.replace('{minutes}', post.readTime)}</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:text-muted-foreground prose-blockquote:border-primary"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-border pb-16">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                {dict.blog.article.thanksMessage}
              </p>
              <Link 
                href={`/${lang}/blog`}
                className="inline-flex items-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                {dict.blog.article.readMoreArticles}
              </Link>
            </div>
          </footer>
        </article>
        </main>
      </div>
    </Layout>
  )
} 