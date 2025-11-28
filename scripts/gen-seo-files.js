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

// 5. 安全写入文件（强制覆盖）
function writeFileSafely(filePath, content) {
  try {
    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // 强制覆盖文件
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return false;
  }
}

// 6. 主流程
function main() {
  const contentDir = path.join(process.cwd(), 'content');
  const blogSlugs = getSlugs(contentDir, 'blog', LANGS);

  console.log(`🌐 Domain: ${DOMAIN}`);
  console.log(`🌍 Languages: ${LANGS.join(', ')}`);
  console.log(`📝 Blog posts found: ${blogSlugs.length}`);
  console.log('');

  // robots.txt
  const robots = genRobotsTxt(DOMAIN);
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (writeFileSafely(robotsPath, robots)) {
    console.log('✅ robots.txt generated/updated');
  }

  // sitemap.xml
  const sitemap = genSitemapXml(DOMAIN, LANGS, STATIC_ROUTES, blogSlugs);
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (writeFileSafely(sitemapPath, sitemap)) {
    console.log('✅ sitemap.xml generated/updated');
  }

  console.log('');
  console.log('🎉 SEO files generation completed!');
  console.log(`📊 Total URLs in sitemap: ${STATIC_ROUTES.length * LANGS.length + blogSlugs.length * LANGS.length}`);
}

main(); 