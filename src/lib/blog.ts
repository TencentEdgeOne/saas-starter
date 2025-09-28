import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { getDictionary } from './dictionaries'
import { getContentDirectory } from './path-utils'

function getPostsDirectory(lang: string = 'en') {
  return getContentDirectory(lang, 'blog')
}

// BlogPost type is now in @/types/blog
import type { BlogPost } from '@/types/blog'
export type { BlogPost }

function estimateReadTime(text: string): number {
  // 以每分钟 200 单词为基准
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function getAllPosts(lang: string = 'en'): BlogPost[] {
  const postsDirectory = getPostsDirectory(lang)
  console.log('postsDirectory', postsDirectory)
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
    return []
  }
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const content = matterResult.content || ''
      const minutes = estimateReadTime(content)
      // readTime 字段国际化
      // 注意：getDictionary 为异步，如需同步可在页面/组件层处理
      return {
        slug,
        title: matterResult.data.title || '',
        date: matterResult.data.date || '',
        excerpt: matterResult.data.excerpt || '',
        author: matterResult.data.author || '',
        tags: matterResult.data.tags || [],
        readTime: String(minutes), // 页面渲染时格式化
        image: matterResult.data.image || '',
        imageAlt: matterResult.data.imageAlt || '',
      }
    })
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string, lang: string = 'en'): Promise<BlogPost | null> {
  try {
    const postsDirectory = getPostsDirectory(lang)
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()
    const minutes = estimateReadTime(matterResult.content || '')
    return {
      slug,
      title: matterResult.data.title || '',
      date: matterResult.data.date || '',
      excerpt: matterResult.data.excerpt || '',
      author: matterResult.data.author || '',
      tags: matterResult.data.tags || [],
      readTime: String(minutes), // 页面渲染时格式化
      content: contentHtml,
      image: matterResult.data.image || '',
      imageAlt: matterResult.data.imageAlt || '',
    }
  } catch (error) {
    return null
  }
}

export function getPostsByTag(tag: string, lang: string = 'en'): BlogPost[] {
  const allPosts = getAllPosts(lang)
  return allPosts.filter((post) => post.tags.includes(tag))
}

export function getAllTags(lang: string = 'en'): string[] {
  const allPosts = getAllPosts(lang)
  const tags = allPosts.flatMap((post) => post.tags)
  return Array.from(new Set(tags))
} 