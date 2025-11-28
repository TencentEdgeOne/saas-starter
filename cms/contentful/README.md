# Contentful to Markdown Export Tool

Exports Contentful space content in bulk to local Markdown files, supporting automatic image downloads, RichText conversion, and multilingual capabilities.

## Features

- ✅ **Multilingual Support** - Supports multiple languages such as `en` and `zh`, automatically handling language mappings
- ✅ **RichText to Markdown** - Automatically converts Contentful RichText to standard Markdown
- ✅ **Image Localization** - Automatically downloads images to `public/images/contentful/` and replaces links
- ✅ **Time Formatting** - Automatically converts ISO8601 time to `yyyy-MM-dd` format
- ✅ **Embedded Resource Handling** - Supports embedded images, files, and entry links
- ✅ **Frontmatter Generation** - Automatically generates frontmatter conforming to project standards

## Quick Start

### 1. Create a Contentful Space

If you don't have a Contentful space, please:
1. Register for a [Contentful account](https://www.contentful.com/sign-up/)
2. Create a new space (Space)

### 2. Import Data Structure

We provide a complete Contentful data model configuration file, including content type structures for blogs and cases.

#### Install Contentful CLI
```bash
npm install -g contentful-cli
```

#### Log in to Contentful
```bash
contentful login
```

#### Import Data Model
```bash
# Run in the project root directory
contentful space import --config cms/contentful/contentful-models-config.json
```

After execution, you will be prompted to select the target space. Select the space you created.

**The imported content types include**:
- **Blog**: Blog post type, including fields such as title, date, excerpt, author, tags, image, and content
- **Case**: Case study type, including fields such as title, description, image, external link, and tags

All text fields support multiple languages (English and Chinese).

### 3. Configure Environment Variables

Create a `.env` file and set your Contentful configuration:

```bash
CONTENTFUL_SPACE_ID=your_space_id_here
CONTENTFUL_ACCESS_TOKEN=your_access_token_here
CONTENTFUL_ENVIRONMENT=master
```

**Getting the Access Token**:
- Go to the Contentful console
- Select your space → Settings → API keys
- Create or use an existing Content Delivery API key

### 4. Install Dependencies
Run in the project root directory:
```bash
npm install
```

### 5. Data Synchronization
Run in the project root directory:
```bash
npm run contentful:export
```

## Data Model Explanation

### Content Types (Content Types)

#### Blog (Blog)
| Field Name | Type | Multilingual | Required | Description |
|------------|------|-------------|----------|-------------|
| `title` | Symbol | ✅ | ✅ | Blog title |
| `date` | Date | ❌ | ❌ | Publication date |
| `excerpt` | Text | ✅ | ❌ | Article summary (up to 1000 characters) |
| `author` | Symbol | ❌ | ✅ | Author name |
| `slug` | Symbol | ❌ | ✅ | URL identifier (unique) |
| `tags` | Array[Symbol] | ✅ | ❌ | Tag array |
| `image` | Asset Link | ❌ | ❌ | Header image resource |
| `content` | RichText | ✅ | ✅ | Article body content |

#### Case (Case Study)
| Field Name | Type | Multilingual | Required | Description |
|------------|------|-------------|----------|-------------|
| `slug` | Symbol | ❌ | ✅ | URL identifier (unique) |
| `title` | Symbol | ✅ | ✅ | Case study title |
| `description` | Text | ✅ | ❌ | Case study description (up to 600 characters) |
| `image` | Asset Link | ❌ | ✅ | Case study image |
| `externalUrl` | Symbol | ❌ | ✅ | External link (requires valid URL format) |
| `tags` | Array[Symbol] | ✅ | ❌ | Tag array |

### Multilingual Support
- **Supported Languages**: `en-US` (English), `zh-CN` (Chinese)
- **Local Mapping**: `en` → `en-US`, `zh` → `zh-CN`
- **Fields marked as multilingual**: Can set different content for each language

## Configuration Explanation

### Environment Variables

| Variable Name | Description | Default Value |
|---------------|-------------|---------------|
| `CONTENTFUL_SPACE_ID` | Contentful space ID | - |
| `CONTENTFUL_ACCESS_TOKEN` | Contentful access token | - |
| `CONTENTFUL_ENVIRONMENT` | Environment name | `master` |

### Script Configuration

In `contentful2md.js`, you can modify:

```javascript
// Language mapping: local language -> Contentful language code
const LANG_MAPPING = {
  'en': 'en-US',    // Local English → Contentful English
  'zh': 'zh-CN'     // Local Chinese → Contentful Chinese
};

const LANGS = Object.keys(LANG_MAPPING); // Supported local languages
const CONTENT_TYPES = ['blog', 'case']; // IDs of content models to export
```

## Output Structure

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

## Markdown Output Format

### Blog Post Format
```markdown
---
title: "Article Title"
date: "2024-01-01"
excerpt: "Article Summary"
author: "Author"
tags: ["tag1", "tag2"]
image: "/images/contentful/blog-featured.jpg"
---

Article body content...

![Image Description](/images/contentful/content-image.jpg)
```

### Case Study Format
```markdown
---
slug: "case-study-1"
title: "Case Study Title"
description: "Case study description and introduction"
image: "/images/contentful/case-featured.jpg"
externalUrl: "https://example.com"
tags: ["project type", "tech stack"]
---

Case study description and introduction
```

## Supported Contentful Fields

### Blog Content Type Field Mapping
| Contentful Field | Markdown Output | Description |
|-----------------|-----------------|-------------|
| `title` | frontmatter.title | Article title |
| `slug` | File name | URL slug |
| `date` | frontmatter.date | Publication date |
| `excerpt` | frontmatter.excerpt | Article summary |
| `author` | frontmatter.author | Author |
| `tags` | frontmatter.tags | Tag array |
| `image` | frontmatter.image | Header image (automatically downloaded) |
| `content` | Body | RichText or Markdown |

### Case Content Type Field Mapping
| Contentful Field | Markdown Output | Description |
|-----------------|-----------------|-------------|
| `slug` | File name & frontmatter.slug | URL slug |
| `title` | frontmatter.title | Case study title |
| `description` | frontmatter.description & Body | Case study description |
| `image` | frontmatter.image | Case study image (automatically downloaded) |
| `externalUrl` | frontmatter.externalUrl | External link |
| `tags` | frontmatter.tags | Tag array |

## RichText Conversion Support

- ✅ Headings (H1-H6)
- ✅ Paragraphs, bold, italic
- ✅ Lists (ordered/unordered)
- ✅ Links
- ✅ Code blocks, inline code
- ✅ Blockquotes
- ✅ Embedded images (automatically downloaded)
- ✅ Embedded files (automatically downloaded)
- ✅ Entry links

## Troubleshooting

### Common Issues

1. **Access Token Error**
   - Ensure using Content Delivery API token (read-only)
   - Check if the space ID is correct

2. **Content Model Mismatch**
   - Ensure `CONTENT_TYPE` matches the content model ID in Contentful

3. **Image Download Failure**
   - Check network connection
   - Ensure `public/images/contentful/` directory is writable

### Debug Mode

Modify the script to add more logs:

```javascript
console.log('Fields:', Object.keys(fields));
console.log('Content type:', typeof fields.content);
```

## Customization Extensions

### Adding Custom Fields

Modify frontmatter generation logic:

```javascript
const frontmatter = {
  title,
  date,
  excerpt,
  author,
  tags,
  image,
  category: fields.category || '', // New field
  seo: fields.seoDescription || '',
};
```

### Custom RichText Rendering

In `renderOptions`, add custom node handling:

```javascript
[BLOCKS.QUOTE]: (node, next) => {
  return `<blockquote>${next(node.content)}</blockquote>`;
},
```

## Complete Workflow

### Initial Setup of Contentful Space

1. **Create Contentful account and space**
2. **Import data structure**:
   ```bash
   contentful space import --config cms/contentful/contentful-models-config.json
   ```
3. **Configure environment variables** (.env file)
4. **Create content in Contentful console**
5. **Export to local**:
   ```bash
   npm run contentful:export
   ```

### Daily Content Update Process

1. **Edit content in Contentful console**
2. **Synchronize to local**:
   ```bash
   npm run contentful:export
   ```
3. **Commit code updates**

### Team Collaboration

- **Share data structure**: Team members can use the same `contentful-models-config.json` to create the same data structure
- **Environment isolation**: Can create different Contentful spaces for different environments (development/production)
- **Version control**: Exported Markdown files can be included in Git version control

## License

MIT License 