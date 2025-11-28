# Contentful → Markdown 导出工具

将 Contentful 空间内容批量导出为本地 Markdown 文件，支持自动下载图片、RichText 转换、多语言等。

## 功能特性

- ✅ **多语言支持** - 支持 `en`、`zh` 等多种语言，自动处理语言映射
- ✅ **RichText 转 Markdown** - 自动转换 Contentful RichText 为标准 Markdown
- ✅ **图片本地化** - 自动下载图片到 `public/images/contentful/` 并替换链接
- ✅ **时间格式化** - ISO8601 时间自动转为 `yyyy-MM-dd` 格式
- ✅ **嵌入资源处理** - 支持嵌入图片、文件、条目链接
- ✅ **Frontmatter 生成** - 自动生成符合项目标准的 frontmatter

## 快速开始

### 1. 创建 Contentful 空间

如果你还没有 Contentful 空间，请先：
1. 注册 [Contentful 账户](https://www.contentful.com/sign-up/)
2. 创建新的空间 (Space)

### 2. 导入数据结构

我们提供了完整的 Contentful 数据模型配置文件，包含博客和案例的内容类型结构。

#### 安装 Contentful CLI
```bash
npm install -g contentful-cli
```

#### 登录 Contentful
```bash
contentful login
```

#### 导入数据模型
```bash
# 在项目根目录运行
contentful space import --config cms/contentful/contentful-models-config.json
```

执行后会提示选择目标空间，选择你创建的空间即可。

**导入的内容类型包括**：
- **Blog**: 博客文章类型，包含标题、日期、摘要、作者、标签、图片、内容等字段
- **Case**: 案例展示类型，包含标题、描述、图片、外部链接、标签等字段

所有文本字段都支持多语言（英语和中文）。

### 3. 配置环境变量

创建 `.env` 文件并设置你的 Contentful 配置：

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

**获取访问令牌**：
- 进入 Contentful 控制台
- 选择你的空间 → Settings → API keys
- 创建或使用现有的 Content Delivery API key

### 4. 安装依赖
项目根目录下运行：
```bash
npm install
```

### 5. 数据同步
项目根目录下运行：
```bash
npm run contentful:export
```

## 数据模型说明

### Content Types（内容类型）

#### Blog（博客）
| 字段名 | 类型 | 多语言 | 必填 | 说明 |
|--------|------|--------|------|------|
| `title` | Symbol | ✅ | ✅ | 博客标题 |
| `date` | Date | ❌ | ❌ | 发布日期 |
| `excerpt` | Text | ✅ | ❌ | 文章摘要（最多1000字符） |
| `author` | Symbol | ❌ | ✅ | 作者名称 |
| `slug` | Symbol | ❌ | ✅ | URL标识符（唯一） |
| `tags` | Array[Symbol] | ✅ | ❌ | 标签数组 |
| `image` | Asset Link | ❌ | ❌ | 头图资源 |
| `content` | RichText | ✅ | ✅ | 文章正文内容 |

#### Case（案例）
| 字段名 | 类型 | 多语言 | 必填 | 说明 |
|--------|------|--------|------|------|
| `slug` | Symbol | ❌ | ✅ | URL标识符（唯一） |
| `title` | Symbol | ✅ | ✅ | 案例标题 |
| `description` | Text | ✅ | ❌ | 案例描述（最多600字符） |
| `image` | Asset Link | ❌ | ✅ | 案例图片 |
| `externalUrl` | Symbol | ❌ | ✅ | 外部链接（需要有效URL格式） |
| `tags` | Array[Symbol] | ✅ | ❌ | 标签数组 |

### 多语言支持
- **支持语言**: `en-US`（英语）、`zh-CN`（中文）
- **本地映射**: `en` → `en-US`，`zh` → `zh-CN`
- **标记为多语言的字段**: 可以为每种语言设置不同的内容

## 配置说明

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `CONTENTFUL_SPACE_ID` | Contentful 空间 ID | - |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful 访问令牌 | - |
| `CONTENTFUL_ENVIRONMENT` | 环境名称 | `master` |

### 脚本配置

在 `contentful2md.js` 中可修改：

```javascript
// 语言映射：本地语言 -> Contentful 语言代码
const LANG_MAPPING = {
  'en': 'en-US',    // 本地英语 → Contentful 英语
  'zh': 'zh-CN'     // 本地中文 → Contentful 中文
};

const LANGS = Object.keys(LANG_MAPPING); // 支持的本地语言
const CONTENT_TYPES = ['blog', 'case']; // 要导出的内容模型 ID
```

## 输出结构

```
content/
├── en/
│   ├── blog/
│   │   ├── article-1.md
│   │   └── article-2.md
│   └── cases/
│       ├── case-1.md
│       └── case-2.md
└── zh/
    ├── blog/
    │   ├── article-1.md
    │   └── article-2.md
    └── cases/
        ├── case-1.md
        └── case-2.md

public/images/contentful/
├── blog-image1.jpg
├── case-image1.png
└── shared-asset.jpg
```

## Markdown 输出格式

### Blog 文章格式
```markdown
---
title: "文章标题"
date: "2024-01-01"
excerpt: "文章摘要"
author: "作者"
tags: ["tag1", "tag2"]
image: "/images/contentful/blog-featured.jpg"
---

文章正文内容...

![图片描述](/images/contentful/content-image.jpg)
```

### Case 案例格式
```markdown
---
slug: "case-study-1"
title: "项目案例标题"
description: "项目描述和简介"
image: "/images/contentful/case-featured.jpg"
externalUrl: "https://example.com"
tags: ["项目类型", "技术栈"]
---

项目描述和简介
```

## 支持的 Contentful 字段

### Blog 内容类型字段映射
| Contentful 字段 | Markdown 输出 | 说明 |
|----------------|--------------|------|
| `title` | frontmatter.title | 文章标题 |
| `slug` | 文件名 | URL slug |
| `date` | frontmatter.date | 发布日期 |
| `excerpt` | frontmatter.excerpt | 文章摘要 |
| `author` | frontmatter.author | 作者 |
| `tags` | frontmatter.tags | 标签数组 |
| `image` | frontmatter.image | 头图（自动下载） |
| `content` | 正文 | RichText 或 Markdown |

### Case 内容类型字段映射
| Contentful 字段 | Markdown 输出 | 说明 |
|----------------|--------------|------|
| `slug` | 文件名 & frontmatter.slug | URL slug |
| `title` | frontmatter.title | 案例标题 |
| `description` | frontmatter.description & 正文 | 案例描述 |
| `image` | frontmatter.image | 案例图片（自动下载） |
| `externalUrl` | frontmatter.externalUrl | 外部链接 |
| `tags` | frontmatter.tags | 标签数组 |

## RichText 转换支持

- ✅ 标题（H1-H6）
- ✅ 段落、粗体、斜体
- ✅ 列表（有序/无序）
- ✅ 链接
- ✅ 代码块、内联代码
- ✅ 引用块
- ✅ 嵌入图片（自动下载）
- ✅ 嵌入文件（自动下载）
- ✅ 条目链接

## 故障排除

### 常见问题

1. **访问令牌错误**
   - 确保使用 Content Delivery API 令牌（只读）
   - 检查空间 ID 是否正确

2. **内容模型不匹配**
   - 确认 `CONTENT_TYPE` 与 Contentful 中的内容模型 ID 一致

3. **图片下载失败**
   - 检查网络连接
   - 确保 `public/images/contentful/` 目录可写

### 调试模式

修改脚本添加更多日志：

```javascript
console.log('Fields:', Object.keys(fields));
console.log('Content type:', typeof fields.content);
```

## 扩展定制

### 添加自定义字段

修改 frontmatter 生成逻辑：

```javascript
const frontmatter = {
  title,
  date,
  excerpt,
  author,
  tags,
  image,
  category: fields.category || '', // 新增字段
  seo: fields.seoDescription || '',
};
```

### 自定义 RichText 渲染

在 `renderOptions` 中添加自定义节点处理：

```javascript
[BLOCKS.QUOTE]: (node, next) => {
  return `<blockquote>${next(node.content)}</blockquote>`;
},
```

## 完整工作流程

### 初次设置 Contentful 空间

1. **创建 Contentful 账户和空间**
2. **导入数据结构**:
   ```bash
   contentful space import --config cms/contentful/contentful-models-config.json
   ```
3. **配置环境变量**（`.env` 文件）
4. **在 Contentful 控制台创建内容**
5. **导出到本地**:
   ```bash
   npm run contentful:export
   ```

### 日常内容更新流程

1. **在 Contentful 控制台编辑内容**
2. **同步到本地**:
   ```bash
   npm run contentful:export
   ```
3. **提交代码更新**

### 团队协作

- **共享数据结构**: 团队成员可以使用同一个 `contentful-models-config.json` 创建相同的数据结构
- **环境隔离**: 可以为不同环境（开发/生产）创建不同的 Contentful 空间
- **版本控制**: 导出的 Markdown 文件可以纳入 Git 版本控制

## 许可证

MIT License 