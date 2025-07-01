# SaaS Starter Template

A modern, production-ready SaaS starter template built with Next.js 14, TypeScript, and Tailwind CSS. 

![SaaS Starter](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)

## ✨ Features

### 🎨 **Beautiful Design System**
- Clean, modern UI
- Fully responsive design
- Dark/Light mode support
- Customizable color schemes
- Beautiful animations and transitions

### 🔧 **Essential SaaS Components**
- **Authentication**: Login, register, password reset
- **Landing Pages**: Hero, features, pricing, testimonials, FAQ
- **Blog System**: Markdown-based blog with frontmatter
- **Case Studies**: Showcase your success stories
- **Dashboard**: User dashboard and analytics
- **Payment Integration**: Stripe-ready payment system

### 🛠 **Developer Experience**
- **TypeScript**: Full type safety
- **Next.js 14**: Latest App Router with SSG support
- **Tailwind CSS**: Utility-first CSS framework
- **Component Library**: Reusable UI components
- **ESLint & Prettier**: Code formatting and linting
- **Responsive Design**: Mobile-first approach

### 📊 **Content Management**
- **Markdown Blog**: Easy content creation with frontmatter
- **Case Studies**: Showcase client work and results
- **SEO Optimized**: Meta tags, structured data
- **Fast Performance**: Optimized for speed and SEO

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/saas-starter-template.git
cd saas-starter-template
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

4. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
saas-starter-template/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── about/          # About page
│   │   ├── blog/           # Blog pages
│   │   ├── cases/          # Case studies
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage
│   ├── components/         # React components
│   │   ├── ui/            # Basic UI components
│   │   ├── layout/        # Layout components
│   │   └── sections/      # Page sections
│   └── lib/               # Utility functions
├── content/               # Markdown content
│   ├── blog/             # Blog posts
│   └── cases/            # Case studies
├── public/               # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎨 Customization

### Colors and Theming

The template uses CSS custom properties for theming. You can customize colors in `src/app/globals.css`:

```css
:root {
  --primary: 142 76% 36%;        /* Green primary color */
  --primary-foreground: 355 7% 97%;
  --secondary: 240 4.8% 95.9%;
  /* ... more variables */
}
```

### Components

All components are built with TypeScript and Tailwind CSS. They're located in `src/components/`:

- `ui/` - Basic UI components (Button, Card, Badge, etc.)
- `layout/` - Layout components (Header, Footer)
- `sections/` - Page sections (Hero, Features, Pricing, etc.)

### AI Assistance
You can modify the code through dialogue in Cursor.

Here are some example Prompts:
- Change the theme color: Change the project's primary color to pink
- Add language support: Add French support to the project
- Modify the page: Modify the homepage, removing the xx module

### Local Content Management

#### Blog Posts
Create new blog posts in `content/blog/` with frontmatter:

```markdown
---
title: "Your Blog Post Title"
date: "2024-01-15"
excerpt: "A brief description of your post"
author: "Your Name"
tags: ["SaaS", "Next.js", "Tutorial"]
readTime: "5 min read"
---

# Your Blog Post Content

Write your content here in Markdown...
```

#### Case Studies
Create new case studies in `content/cases/`


### Contentful Integration

#### Quick Setup
1. **Import data structure to your Contentful space**:
   ```bash
   # Install Contentful CLI
   npm install -g contentful-cli
   
   # Login to Contentful
   contentful login
   
   # Import provided data models
   contentful space import --config cms/contentful/contentful-models-config.json
   ```

2. **Configure environment variables**:
   ```bash
   # In your .env file
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_ENVIRONMENT=master
   ```

3. **Export content to local markdown**:
   ```bash
   npm run contentful:export
   ```

**What's included**:
- **Data Models**: Pre-configured Blog and Case content types
- **Multi-language**: Support for English (`en-US`) and Chinese (`zh-CN`)
- **Rich Content**: RichText conversion to Markdown
- **Asset Management**: Automatic image download and localization
- **Language Mapping**: `en` → `en-US`, `zh` → `zh-CN`

**Output structure**:
```
content/
├── en/blog/*.md        # English blog posts
└── zh/blog/*.md        # Chinese blog posts
public/images/contentful/  # Downloaded images
```

For detailed setup and configuration, see `cms/contentful/README.md`. 


### Internationalization
Our project supports multiple languages, you can find all the translation files in the `dictionaries/` directory. For detailed internationalization setup and configuration, please see `dictionaries/README.md`.

### Data Analytics
The project has built-in support for Google Analytics data analytics.

1. Sign up for [Google Analytics](https://developers.google.com/analytics?hl=en-US) to get the tracking code
2. Set the tracking code in the environment variables
```
NEXT_PUBLIC_GA_ID=G-xxxxx
```

## 📱 Pages Included

- **Homepage** (`/`) - Complete landing page with all sections
- **About** (`/about`) - About page with team and company info
- **Blog** (`/blog`) - Blog listing and individual post pages
- **Cases** (`/cases`) - Case studies and success stories
- **Pricing** - Included in homepage with anchor links

## 🎯 SEO Features

- Meta tags optimization
- OpenGraph and Twitter Card support
- Structured data for better search results
- Sitemap generation ready
- Fast loading times
- Mobile-first responsive design

### robot.txt and sitemap.xml
The project provides scripts to automatically generate robot.txt and sitemap.xml.
You only need to modify the SITE_URL in the gen:seo command in package.json to your own site address, then run:
`npm run gen:seo` to generate them.

## 🚀 Deploy
[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=saas-starter)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)

## 📞 Support

If you have any questions or need help with the template:

- Create an issue on GitHub
- Email us at support@saas-starter.com
- Join our Discord community

---

**Happy building! 🚀** 
