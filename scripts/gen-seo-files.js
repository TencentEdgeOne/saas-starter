#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// 自动读取 src/lib/i18n.ts 的 locales
function getLangs() {
  const i18nPath = path.join(process.cwd(), 'src', 'lib', 'i18n.ts');
  const content = fs.readFileSync(i18nPath, 'utf8');
  const match = content.match(/locales\s*=\s*\[([^\]]+)\]/);
  if (match) {
    return match[1]
      .split(',')
      .map((s) => s.replace(/['\"\s]/g, ''))
      .filter(Boolean);
  }
  return ['en'];
}

const DOMAIN = process.env.SITE_URL || process.argv[2] || 'https://your-domain.com';
const LANGS = getLangs();
const STATIC_ROUTES = [
  '', // home
  'blog',
  'cases',
  'features',
  'contact',
  'pricing',
  'about',
];

// 2. 生成 robots.txt
function genRobotsTxt(domain) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`;
}

// 3. 生成 sitemap.xml
function genSitemapXml(domain, langs, staticRoutes, blogSlugs) {
  let urls = [];

  // 静态页面
  for (const route of staticRoutes) {
    const pathPart = route ? `/${route}` : '';
    for (const lang of langs) {
      urls.push({
        loc: `${domain}/${lang}${pathPart}`,
        alternates: langs.map(
          (alt) => ({
            hreflang: alt,
            href: `${domain}/${alt}${pathPart}`,
          })
        ),
      });
    }
  }

  // 动态 blog
  for (const slug of blogSlugs) {
    for (const lang of langs) {
      urls.push({
        loc: `${domain}/${lang}/blog/${slug}`,
        alternates: langs.map(
          (alt) => ({
            hreflang: alt,
            href: `${domain}/${alt}/blog/${slug}`,
          })
        ),
      });
    }
  }

  // 生成 xml
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${u.loc}</loc>\n` +
          u.alternates
            .map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`
            )
            .join('\n') +
          `\n  </url>`
      )
      .join('\n') +
    `\n</urlset>\n`;
  return xml;
}

// 4. 扫描内容目录
function getSlugs(contentDir, type, langs) {
  const slugs = [];
  for (const lang of langs) {
    const files = glob.sync(
      path.join(contentDir, lang, type, '*.md')
    );
    for (const file of files) {
      const slug = path.basename(file, '.md');
      if (!slugs.includes(slug)) slugs.push(slug);
    }
  }
  return slugs;
}

// 5. 主流程
function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const blogSlugs = getSlugs(contentDir, 'blog', LANGS);

  // robots.txt
  const robots = genRobotsTxt(DOMAIN);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'robots.txt'), robots, 'utf8');
  console.log('✅ robots.txt generated');

  // sitemap.xml
  const sitemap = genSitemapXml(DOMAIN, LANGS, STATIC_ROUTES, blogSlugs);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap, 'utf8');
  console.log('✅ sitemap.xml generated');
}

main(); 