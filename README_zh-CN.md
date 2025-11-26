# SaaS AI 模板

一个使用 Next.js 14、TypeScript 和 Tailwind CSS 构建的现代、功能完善的 SaaS AI 模板。
![SaaS 启动模板](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC)

## ✨ 特性

### 🎨 **美丽的设计系统**

- 简洁、现代化 UI
- 完全响应式设计
- 暗/亮模式支持
- 可定制的颜色方案

### 🔧 **必要的 SaaS 组件**

- **身份验证**: 登录、注册、密码重置
- **第三方登录**: 支持 Google、GitHub OAuth 登录
- **积分系统**: 完整的积分管理，包括获得、消费、历史记录
- **AI 文生图**: 集成多种 AI 模型的图片生成功能
- **博客系统**: 基于 Markdown 的博客，带有前言
- **案例研究**: 展示你的成功故事
- **支付集成**: Stripe 准备好的支付系统

### 🛠 **开发者体验**

- **TypeScript**: 完全的类型安全
- **Next.js 14**: 最新的应用路由器，支持静态站点生成
- **Tailwind CSS**: 实用优先的 CSS 框架
- **组件库**: 可重用的 UI 组件
- **ESLint & Prettier**: 代码格式化和 linting
- **响应式设计**: 移动优先的方法

## 🚀 核心功能详解

### 💳 积分系统

完整的积分管理系统，支持用户积分的获得、消费和历史追踪：

**功能特性：**

- 新用户注册奖励：50 积分
- 购买套餐奖励：根据套餐等级给予不同积分
- 积分消费：AI 图片生成等功能消费积分
- 积分历史：完整的积分获得和消费记录
- 余额查询：实时查看当前积分余额

### 🔐 第三方登录

支持主流 OAuth 提供商的快速登录：

**支持的提供商：**

- Google OAuth 2.0
- GitHub OAuth

**功能特性：**

- 一键登录注册
- 自动账户关联
- 安全的回调处理
- 新用户注册奖励积分

**配置要求：**

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 应用配置
NEXT_PUBLIC_APP_URL=your-app-url
```

### 🎨 AI 文生图

集成多种 AI 模型的图片生成功能：

**支持的模型：**

- OpenAI DALL-E 3
- Stability AI (Stable Diffusion)
- 其他兼容模型

**功能特性：**

- 多种图片尺寸：256x256, 512x512, 768x768, 1024x1024, 1024x1792, 1792x1024
- 积分计费系统
- 实时余额检查
- 图片预览和下载
- 多语言提示词支持
- 错误处理和重试机制

**使用流程：**

1. 用户输入提示词
2. 选择模型和尺寸
3. 系统检查积分余额
4. 调用 AI 模型生成图片
5. 扣除相应积分
6. 返回生成的图片

**环境变量配置：**

```bash
# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stability AI
STABILITY_API_KEY=your-stability-api-key

# 其他 AI 提供商
# 根据需要添加相应的 API 密钥
```

## 🚀 快速开始

### 前提条件

- Node.js 18+
- npm 或 yarn

### 安装

1. **克隆仓库**

```bash
git clone https://github.com/your-username/saas-starter-template.git
cd saas-starter-template
```

2. **安装依赖项**

```bash
npm install
# 或
yarn install
```

3. **启动开发服务器**

```bash
edgeone pages dev
```

4. **打开浏览器**
   访问 [http://localhost:8088](http://localhost:8088) 查看你的应用。

## 📁 项目结构

```
saas-starter-template/
├── src/
│   ├── app/                 # Next.js 应用路由器
│   │   ├── ai/             # AI 文生图页面
│   │   ├── blog/           # 博客页面
│   │   ├── cases/          # 案例研究
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── ui/            # 基本 UI 组件
│   │   ├── layout/        # 布局组件
│   │   └── sections/      # 页面部分
│   └── lib/               # 实用函数
├── content/               # Markdown 内容
│   ├── blog/             # 博客文章
│   └── cases/            # 案例研究
├── public/               # 静态资产
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎨 定制

### 颜色和主题

模板使用 CSS 自定义属性进行主题化。你可以在 `src/app/globals.css` 中定制颜色：

```css
:root {
  --primary: 142 76% 36%; /* 绿色主色 */
  --primary-foreground: 355 7% 97%;
  --secondary: 240 4.8% 95.9%;
  /* ... 更多变量 */
}
```

### 组件

所有组件都是使用 TypeScript 和 Tailwind CSS 构建的。它们位于 `src/components/`：

- `ui/` - 基本 UI 组件 (按钮、卡片、徽章等)
- `layout/` - 布局组件 (头部、尾部)
- `sections/` - 页面部分 (英雄、特征、定价等)

### AI 辅助

你可以在 Cursor 中通过对话修改代码。

以下是一些示例 Prompt：

- 修改主题色：把项目的主色调改成粉色
- 增加语种：给项目增加法语支持
- 修改页面：修改主页，去掉 xx 模块

### 内容管理

#### 博客文章

在 `content/blog/` 中创建新博客文章，带有前言：

```markdown
---
title: "你的博客文章标题"
date: "2024-01-15"
excerpt: "你的文章简短描述"
author: "你的名字"
tags: ["SaaS", "Next.js", "教程"]
readTime: "5 分钟读取"
---

# 你的博客文章内容

在这里用 Markdown 写你的内容...
```

#### 案例研究

在 `content/cases/` 中创建新案例

### Contentful 集成

#### 快速设置

1. **将数据结构导入到你的 Contentful 空间**：

   ```bash
   # 安装Contentful CLI
   npm install -g contentful-cli

   # 登录到Contentful
   contentful login

   # 导入提供的数据模型
   contentful space import --config cms/contentful/contentful-models-config.json
   ```

2. **配置环境变量**：

   ```bash
   # 在你的.env文件中
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   CONTENTFUL_ENVIRONMENT=master
   NEXT_PUBLIC_SUPABASE_URL=your-supabse-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-anon-service-role-key

   STRIPE_WEBHOOK_SECRET=your-stripe-webhooksecret
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_CALLBACK_URL=site-url

   NEXT_PUBLIC_APP_URL=site-url
   ```

3. **将内容导出到本地 Markdown**：
   ```bash
   npm run contentful:export
   ```

**包含什么**：

- **数据模型**: 预配置的博客和案例内容类型
- **多语言支持**: 支持英语（`en-US`）和中文（`zh-CN`）
- **富文本内容**: RichText 转换为 Markdown
- **资产管理**: 自动图像下载和本地化
- **语言映射**: `en` → `en-US`, `zh` → `zh-CN`

**输出结构**：

```
content/
├── en/blog/*.md        # 英语博客文章
└── zh/blog/*.md        # 中文博客文章
public/images/contentful/  # 下载的图像
```

详细的设置和配置，请见 `cms/contentful/README.md`.

### 国际化

我们的项目支持多语言，你可以在 `dictionaries/` 目录中找到所有的翻译文件。详细的国际化设置和配置，请见 `dictionaries/README.md`。

### 数据统计

项目内置支持 Google Analytics 数据统计。

1. 开通 [Google Analytics](https://developers.google.com/analytics?hl=zh-cn)，得到统计代码
2. 把统计代码设置到环境变量中

```
NEXT_PUBLIC_GA_ID=G-xxxxx
```

## 🎯 SEO 特性

- 元标签优化
- OpenGraph 和 Twitter Card 支持
- 结构化数据，提高搜索结果
- 站点地图生成准备
- 快速加载时间
- 移动优先的响应式设计

### robot.txt 和 sitemap.xml

项目提供了自动生成 robot.txt 和 sitemap.xml 的脚本。
只需要在 package.json 中修改 gen:seo 命令的 SITE_URL 为您自己的站点地址，然后运行：
`npm run gen:seo`即可。

## 🚀 部署

[![使用 EdgeOne Pages 部署](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://console.cloud.tencent.com/edgeone/pages/new?template=saas-starter)

## 🤝 贡献

1. 分叉仓库
2. 创建你的特征分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m '添加一些惊人的特征'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个拉取请求

## 📄 许可

本项目根据 MIT 许可证进行许可 - 请查看 [LICENSE](https://github.com/TencentEdgeOne/saas-starter/blob/main/LICENSE) 文件了解详情。

## 🙏 鸣谢

- 使用 [Next.js](https://nextjs.org/) 构建
- 使用 [Tailwind CSS](https://tailwindcss.com/) 样式
- 来自 [Lucide React](https://lucide.dev/) 的图标

---

**祝你愉快的构建！ 🚀**
