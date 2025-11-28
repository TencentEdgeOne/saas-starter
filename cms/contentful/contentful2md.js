// Contentful → Markdown 批量导出脚本
// 用法：node cms/contentful/contentful2md.js

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { createClient } = require('contentful');
const matter = require('gray-matter');
const { documentToHtmlString } = require('@contentful/rich-text-html-renderer');
const { BLOCKS, MARKS, INLINES } = require('@contentful/rich-text-types');
const TurndownService = require('turndown');

// === 配置区 ===
const SPACE_ID = process.env.CONTENTFUL_SPACE_ID || 'your_space_id';
const ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN || 'your_access_token';
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
// 语言映射：本地语言 -> Contentful 语言代码
const LANG_MAPPING = {
  'en': 'en-US',
  'zh': 'zh-CN'
};

const LANGS = Object.keys(LANG_MAPPING); // 支持的本地语言: ['en', 'zh']
const CONTENT_TYPES = ['blog', 'case']; // 要导出的内容模型 ID
const OUT_BASE = path.join(process.cwd(), 'content');
const IMG_OUT = path.join(process.cwd(), 'public', 'images', 'contentful');

// === 工具函数 ===
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toISOString().slice(0, 10); // yyyy-MM-dd
}

async function downloadImage(url, outDir) {
  if (!url) return '';
  const u = new URL(url);
  const filename = u.pathname.split('/').pop();
  const localPath = path.join(outDir, filename);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  if (!fs.existsSync(localPath)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to download ' + url);
    const buf = await res.buffer();
    fs.writeFileSync(localPath, buf);
  }
  return '/images/contentful/' + filename;
}

// RichText 转 Markdown
async function richTextToMarkdown(richTextDocument, assets = []) {
  // 创建资源映射
  const assetMap = {};
  assets.forEach(asset => {
    if (asset.sys && asset.fields) {
      assetMap[asset.sys.id] = asset.fields;
    }
  });

  // 配置 rich-text 渲染选项
  const renderOptions = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: async (node) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];
        if (asset && asset.file) {
          const imageUrl = 'https:' + asset.file.url;
          const localImagePath = await downloadImage(imageUrl, IMG_OUT);
          const alt = asset.title || asset.description || '';
          return `<img src="${localImagePath}" alt="${alt}" />`;
        }
        return '';
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        // 处理嵌入的条目（如引用其他文章）
        return `<!-- Embedded entry: ${node.data.target.sys.id} -->`;
      },
      [INLINES.ASSET_HYPERLINK]: async (node, next) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];
        if (asset && asset.file) {
          const fileUrl = 'https:' + asset.file.url;
          const localFilePath = await downloadImage(fileUrl, IMG_OUT);
          return `<a href="${localFilePath}">${next(node.content)}</a>`;
        }
        return next(node.content);
      },
      [INLINES.ENTRY_HYPERLINK]: (node, next) => {
        // 处理条目链接
        return `<a href="#entry-${node.data.target.sys.id}">${next(node.content)}</a>`;
      },
    },
  };

  // 将 RichText 转为 HTML
  const html = documentToHtmlString(richTextDocument, renderOptions);
  
  // 使用 Turndown 将 HTML 转为 Markdown
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });
  
  // 自定义规则处理特殊元素
  turndownService.addRule('preserveImageAttributes', {
    filter: 'img',
    replacement: (content, node) => {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || '';
      return `![${alt}](${src})`;
    }
  });

  const markdown = turndownService.turndown(html);
  return markdown;
}

// === 内容类型处理函数 ===
async function processBlog(item, outDir) {
  const fields = item.fields;
  const slug = fields.slug || item.sys.id;
  const title = fields.title || '';
  const date = formatDate(fields.date || item.sys.createdAt);
  const excerpt = fields.excerpt || '';
  const author = fields.author || '';
  const tags = fields.tags || [];

  // 处理头图
  let image = '';
  if (fields.image && fields.image.fields && fields.image.fields.file) {
    const imgUrl = 'https:' + fields.image.fields.file.url;
    image = await downloadImage(imgUrl, IMG_OUT);
  }

  // 处理正文内容
  let content = '';
  if (fields.content) {
    if (typeof fields.content === 'string') {
      content = fields.content;
    } else if (fields.content.nodeType === 'document') {
      console.log(`Converting RichText for blog: ${slug}`);
      content = await richTextToMarkdown(fields.content, []);
    }
  }

  const frontmatter = {
    title,
    date,
    excerpt,
    author,
    tags,
    image,
  };

  const md = matter.stringify(content, frontmatter);
  const outPath = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log('Exported:', outPath);
}

async function processCase(item, outDir) {
  const fields = item.fields;
  const slug = fields.slug || item.sys.id;
  const title = fields.title || '';
  const description = fields.description || '';
  const externalUrl = fields.externalUrl || '';
  const tags = fields.tags || [];

  // 处理图片
  let image = '';
  if (fields.image && fields.image.fields && fields.image.fields.file) {
    const imgUrl = 'https:' + fields.image.fields.file.url;
    image = await downloadImage(imgUrl, IMG_OUT);
  }

  // Cases 通常不需要正文内容，主要是 frontmatter 数据
  const content = description; // 使用 description 作为内容

  const frontmatter = {
    slug,
    title,
    description,
    image,
    externalUrl,
    tags,
  };

  const md = matter.stringify(content, frontmatter);
  const outPath = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log('Exported:', outPath);
}

// === 主逻辑 ===
(async () => {
  const client = createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN,
    environment: ENVIRONMENT,
  });

  for (const localLang of LANGS) {
    const contentfulLang = LANG_MAPPING[localLang];
    console.log(`\n=== Processing language: ${localLang} (Contentful: ${contentfulLang}) ===`);
    
    for (const contentType of CONTENT_TYPES) {
      console.log(`\n--- Processing content type: ${contentType} ---`);
      
      const entries = await client.getEntries({ 
        content_type: contentType, 
        locale: contentfulLang,
        include: 2 // 包含关联的资源
      });
      
      if (entries.items.length === 0) {
        console.log(`No ${contentType} entries found for ${localLang}`);
        continue;
      }

      // 根据内容类型确定输出目录
      const typeDir = contentType === 'case' ? 'cases' : contentType;
      const outDir = path.join(OUT_BASE, localLang, typeDir);
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      // 根据内容类型选择处理函数
      for (const item of entries.items) {
        try {
          if (contentType === 'blog') {
            await processBlog(item, outDir);
          } else if (contentType === 'case') {
            await processCase(item, outDir);
          }
        } catch (error) {
          console.error(`Error processing ${contentType} item ${item.sys.id}:`, error.message);
        }
      }
      
      console.log(`Processed ${entries.items.length} ${contentType} entries for ${localLang}`);
    }
  }
  console.log('\n🎉 All done!');
})(); 