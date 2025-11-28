# 翻译系统完整指南 / Complete Translation Guide

这个文档是项目翻译系统的完整指南，包含快速查阅、详细映射关系、使用示例和最佳实践。

## 📚 目录
- [🚀 快速查找表](#-快速查找表)
- [🎯 按页面分类](#-按页面分类)
- [🗂 详细组件映射](#-详细组件映射)
- [📚 翻译使用示例](#-翻译使用示例)
- [🎯 最佳实践](#-最佳实践)
- [🔧 工具和技巧](#-工具和技巧)

---

## 🚀 快速查找表

| 组件名称 | 文件路径 | 主要翻译字段 | 页面使用 |
|---------|----------|-------------|----------|
| **Hero** | `src/components/sections/hero.tsx` | `dict.hero.*` | 首页 |
| **Features** | `src/components/sections/features.tsx` | `dict.features.*` | 首页、功能页 |
| **Pricing** | `src/components/sections/pricing.tsx` | `dict.pricing.plans[]` | 首页、定价页 |
| **PricingComparison** | `src/components/sections/pricing-comparison.tsx` | `dict.pricing.comparison.*` | 定价页 |
| **FAQ** | `src/components/sections/faq.tsx` | `dict.faq.*` | 首页、定价页 |
| **Testimonials** | `src/components/sections/testimonials.tsx` | `dict.testimonials.*` | 首页 |
| **Header** | `src/components/layout/header.tsx` | `dict.header.*` | 全局 |
| **Footer** | `src/components/layout/footer.tsx` | `dict.footer.*` | 全局 |
| **ContactForm** | `src/components/ui/contact-form.tsx` | `dict.form.*` | 联系页 |
| **CTASection** | `src/components/ui/cta-section.tsx` | `dict.cta.*` | 多页面 |

## 🎯 按页面分类

### 首页 (`src/app/[lang]/page.tsx`)
```typescript
dict.hero.*           // Hero区块
dict.features.*       // 功能区块  
dict.pricing.*        // 定价区块
dict.testimonials.*   // 推荐区块
dict.faq.*           // FAQ区块
```

### 定价页 (`src/app/[lang]/pricing/page.tsx`)
```typescript
dict.pricing.badge           // 页面徽章
dict.pricing.pageTitle       // 页面标题
dict.pricing.pageSubtitle    // 页面副标题
dict.pricing.plans[]         // 定价套餐
dict.pricing.comparison.*    // 功能比较表
dict.pricing.faqs[]          // FAQ列表
dict.pricing.ctaTitle        // CTA标题
dict.pricing.ctaDescription  // CTA描述
```

### 功能页 (`src/app/[lang]/features/page.tsx`)
```typescript
dict.features.page.*         // 页面内容
dict.features.heroFeatures[] // 主要功能
dict.features.featureCategories[] // 功能分类
dict.features.supportFeatures[]   // 支持功能
```

### 联系页 (`src/app/[lang]/contact/page.tsx`)
```typescript
dict.contact.*      // 页面内容
dict.form.*         // 表单字段
```

### 常用翻译字段

#### 通用按钮 (`dict.cta.*`)
```json
{
  "getStarted": "Get Started / 立即开始",
  "learnMore": "Learn More / 了解更多", 
  "startFreeTrial": "Start Free Trial / 开始免费试用",
  "contactSales": "Contact Sales / 联系销售"
}
```

#### 通用文本 (`dict.common.*`)
```json
{
  "loading": "Loading... / 加载中...",
  "error": "Something went wrong / 出现了一些错误",
  "popular": "Popular / 热门",
  "unlimited": "Unlimited / 无限制"
}
```

---

## 🗂 详细组件映射

### 📑 Layout Components (布局组件)

#### 1. Header Component
- **文件路径**: `src/components/layout/header.tsx`
- **使用的翻译字段**:
  ```json
  {
    "header": {
      "navigation": [],      // 导航菜单项
      "cta": {
        "text": "",         // CTA按钮文字
        "href": ""          // CTA按钮链接
      }
    }
  }
  ```

#### 2. Footer Component  
- **文件路径**: `src/components/layout/footer.tsx`
- **使用的翻译字段**:
  ```json
  {
    "footer": {
      "sections": [{
        "title": "",        // 栏目标题
        "links": [{
          "name": "",       // 链接名称
          "href": ""        // 链接地址
        }]
      }]
    },
    "social": [],           // 社交媒体链接
    "site": {
      "copyright": ""       // 版权信息
    }
  }
  ```

### 🎯 Section Components (页面区块组件)

#### 1. Hero Section
- **文件路径**: `src/components/sections/hero.tsx`
- **使用的翻译字段**:
  ```json
  {
    "hero": {
      "badge": "",              // 顶部徽章文字
      "title": "",              // 主标题
      "subtitle": "",           // 副标题
      "getStartedFree": "",     // 主要CTA按钮
      "viewDemo": "",           // 次要CTA按钮
      "socialProof": {
        "trustedByDevelopers": "",  // 社会化证明文字
        "readyComponents": "",      // 组件数量
        "shipInMinutes": ""         // 时间承诺
      }
    }
  }
  ```

#### 2. Features Section
- **文件路径**: `src/components/sections/features.tsx`
- **使用的翻译字段**:
  ```json
  {
    "features": {
      "title": "",              // 区块标题
      "description": "",        // 区块描述
      "andMoreText": "",        // "更多"文字
      "componentsLinkText": "", // 组件链接文字
      "main": [{
        "icon": "",             // 图标名称
        "title": "",            // 功能标题
        "description": ""       // 功能描述
      }]
    }
  }
  ```

#### 3. Pricing Section
- **文件路径**: `src/components/sections/pricing.tsx`
- **使用的翻译字段**:
  ```json
  {
    "pricing": {
      "title": "",              // 区块标题
      "description": "",        // 区块描述
      "mostPopular": "",        // "最受欢迎"标签
      "plans": [{
        "name": "",             // 套餐名称
        "price": "",            // 价格
        "period": "",           // 计费周期
        "description": "",      // 套餐描述
        "features": [],         // 功能列表
        "buttonText": "",       // 按钮文字
        "popular": false        // 是否为热门套餐
      }]
    }
  }
  ```

#### 4. PricingComparison Component
- **文件路径**: `src/components/sections/pricing-comparison.tsx`
- **使用的翻译字段**:
  ```json
  {
    "pricing": {
      "mostPopular": "",        // "最受欢迎"徽章文字
      "comparison": {
        "title": "",            // 比较表标题
        "description": "",      // 比较表描述
        "tableHeaders": {
          "features": "",       // "功能"列标题
          "starter": "",        // "入门版"列标题
          "professional": "",   // "专业版"列标题
          "enterprise": ""      // "企业版"列标题
        },
        "planPricing": {
          "starter": "",        // 入门版价格
          "professional": "",   // 专业版价格
          "enterprise": ""      // 企业版价格
        },
        "features": [{
          "category": "",       // 功能分类名称
          "items": [{
            "name": "",         // 功能名称
            "starter": "",      // 入门版支持情况
            "professional": "", // 专业版支持情况
            "enterprise": ""    // 企业版支持情况
          }]
        }]
      }
    }
  }
  ```

#### 5. FAQ Section
- **文件路径**: `src/components/sections/faq.tsx`
- **使用的翻译字段**:
  ```json
  {
    "faq": {
      "title": "",              // FAQ标题
      "description": "",        // FAQ描述
      "stillHaveQuestions": "", // "还有问题"文字
      "contactSupport": "",     // "联系支持"链接文字
      "faqs": [{
        "question": "",         // 问题
        "answer": ""            // 答案
      }]
    }
  }
  ```

#### 6. Testimonials Section
- **文件路径**: `src/components/sections/testimonials.tsx`
- **使用的翻译字段**:
  ```json
  {
    "testimonials": {
      "title": "",              // 区块标题
      "description": "",        // 区块描述
      "testimonials": [{
        "name": "",             // 推荐人姓名
        "role": "",             // 推荐人职位
        "avatar": "",           // 头像
        "content": "",          // 推荐内容
        "rating": 5             // 评分
      }],
      "stats": [{
        "value": "",            // 统计数值
        "label": ""             // 统计标签
      }]
    }
  }
  ```

### 🧩 UI Components (UI组件)

#### 1. Contact Form
- **文件路径**: `src/components/ui/contact-form.tsx`
- **使用的翻译字段**:
  ```json
  {
    "form": {
      "labels": {
        "fullName": "",         // 姓名标签
        "emailAddress": "",     // 邮箱标签
        "company": "",          // 公司标签
        "subject": "",          // 主题标签
        "message": ""           // 消息标签
      },
      "placeholders": {
        "fullName": "",         // 姓名占位符
        "email": "",            // 邮箱占位符
        "company": "",          // 公司占位符
        "selectSubject": "",    // 选择主题占位符
        "message": ""           // 消息占位符
      },
      "optional": "",           // "可选"文字
      "required": "",           // "必填"标记
      "sending": "",            // "发送中"文字
      "sendMessage": ""         // "发送消息"按钮文字
    },
    "contact": {
      "form": {
        "subjects": []          // 主题选项列表
      }
    }
  }
  ```

#### 2. CTA Section
- **文件路径**: `src/components/ui/cta-section.tsx`
- **使用的翻译字段**:
  ```json
  {
    "cta": {
      "getStarted": "",         // "立即开始"按钮
      "learnMore": "",          // "了解更多"按钮
      "startFreeTrial": "",     // "开始免费试用"按钮
      "scheduleDemo": "",       // "预约演示"按钮
      "viewDocumentation": "",  // "查看文档"按钮
      "contactSales": ""        // "联系销售"按钮
    }
  }
  ```

---

## 📚 翻译使用示例

### 1. PricingComparison 组件完整示例

#### 组件使用方式
```typescript
// 在页面中使用
import { PricingComparison } from '@/components/sections/pricing-comparison';

export default function PricingPage({ dict }) {
  return (
    <PricingComparison 
      comparison={dict.pricing.comparison}
      mostPopularText={dict.pricing.mostPopular}
    />
  );
}
```

#### 翻译字段结构对比
```json
// en.json
{
  "pricing": {
    "mostPopular": "Most Popular",
    "comparison": {
      "title": "Compare Key Features",
      "description": "See the main differences between plans",
      "tableHeaders": {
        "features": "Features",
        "starter": "Starter", 
        "professional": "Professional",
        "enterprise": "Enterprise"
      },
      "planPricing": {
        "starter": "$9/month",
        "professional": "$29/month", 
        "enterprise": "$99/month"
      }
    }
  }
}
```

```json
// zh.json  
{
  "pricing": {
    "mostPopular": "最受欢迎",
    "comparison": {
      "title": "主要功能对比", 
      "description": "查看套餐间的主要差异",
      "tableHeaders": {
        "features": "功能",
        "starter": "入门版",
        "professional": "专业版", 
        "enterprise": "企业版"
      },
      "planPricing": {
        "starter": "￥69/月",
        "professional": "￥199/月",
        "enterprise": "￥699/月" 
      }
    }
  }
}
```

### 2. Hero 组件示例

#### 组件使用方式
```typescript
// src/components/sections/hero.tsx
export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section>
      <div className="badge">
        {dict?.hero?.badge || "🚀 Default Badge"}
      </div>
      <h1>
        {dict?.hero?.title || "Default Title"}
      </h1>
      <p>
        {dict?.hero?.subtitle || "Default subtitle"}
      </p>
      <div className="buttons">
        <button>{dict?.hero?.getStartedFree || "Get Started"}</button>
        <button>{dict?.hero?.viewDemo || "View Demo"}</button>
      </div>
    </section>
  );
}
```

### 3. FAQ 组件示例

#### 组件使用方式
```typescript
// src/components/sections/faq.tsx
export function FAQ({ dict }: { dict: Dictionary }) {
  const faqs = dict?.faq?.faqs || [];
  
  return (
    <section>
      <h2>{dict?.faq?.title || "FAQ"}</h2>
      <p>{dict?.faq?.description || "Common questions"}</p>
      
      {faqs.map((faq, index) => (
        <div key={index}>
          <h3>{faq.question}</h3>
          <p>{faq.answer}</p>
        </div>
      ))}
      
      <div className="bottom-cta">
        <p>{dict?.faq?.stillHaveQuestions}</p>
        <a href="mailto:support@example.com">
          {dict?.faq?.contactSupport}
        </a>
      </div>
    </section>
  );
}
```

---

## 🎯 最佳实践

### 1. 始终提供默认值
```typescript
// ✅ 好的做法
{dict?.section?.field || "Default Text"}

// ❌ 避免这样做  
{dict.section.field} // 可能导致错误
```

### 2. 使用可选链和空值合并
```typescript
// ✅ 安全的访问方式
const title = dict?.hero?.title ?? "Default Title";
const features = dict?.features?.main ?? [];
```

### 3. 处理数组类型的翻译
```typescript
// ✅ 安全的数组处理
const faqs = dict?.faq?.faqs || [];
faqs.map((faq, index) => (
  <div key={index}>
    <h3>{faq.question}</h3>
    <p>{faq.answer}</p>
  </div>
))
```

### 4. 条件渲染翻译内容
```typescript
// ✅ 有条件地显示内容
{dict?.hero?.socialProof && (
  <div>
    <span>{dict.hero.socialProof.trustedByDevelopers}</span>
    <span>{dict.hero.socialProof.readyComponents}</span>
  </div>
)}
```

### 5. 动态文本替换
```typescript
// 对于包含变量的文本
const title = dict?.hero?.title?.replace('SaaS', '<span class="text-primary">SaaS</span>');

// 使用 dangerouslySetInnerHTML
<h1 dangerouslySetInnerHTML={{ __html: title }} />
```

### 6. 多语言链接处理
```typescript
// 在页面间导航时保持语言
const currentLang = usePathname().split('/')[1] || 'en';

<a href={`/${currentLang}/pricing`}>
  {dict?.nav?.pricing}
</a>
```

### 7. 表单验证消息
```typescript
// 表单组件中的错误消息
const errorMessage = dict?.form?.errorMessage || "Something went wrong";
const successMessage = dict?.form?.thankYouMessage || "Thank you!";
```

---

## 🔧 工具和技巧

### 使用指南

#### 1. 添加新翻译字段
1. 在 `en.json` 和 `zh.json` 中添加字段
2. 更新 `src/lib/dictionaries.ts` 类型定义
3. 在组件中使用 `dict.section.field` 格式

#### 2. 查找特定文字
1. 全局搜索文字内容
2. 检查是否在翻译文件中
3. 如果硬编码，考虑移到翻译文件

#### 3. 调试翻译问题
1. 检查字段路径是否正确
2. 确认所有语言文件都有对应字段
3. 查看控制台是否有错误信息

### 调试技巧
```typescript
// 调试翻译对象
console.log('Dictionary:', dict);
console.log('Specific section:', dict?.section);

// 检查缺失的翻译键
const missingKeys = [];
if (!dict?.hero?.title) missingKeys.push('hero.title');
if (missingKeys.length > 0) {
  console.warn('Missing keys:', missingKeys);
}

// 开发环境中记录缺失的翻译
if (process.env.NODE_ENV === 'development' && !dict?.section?.field) {
  console.warn(`Missing translation: section.field`);
}
```

### 翻译验证脚本
```javascript
// scripts/validate-translations.js
const en = require('../dictionaries/en.json');
const zh = require('../dictionaries/zh.json');

function validateTranslations(obj1, obj2, path = '') {
  for (const key in obj1) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in obj2)) {
      console.error(`Missing key in zh.json: ${currentPath}`);
    }
  }
}

validateTranslations(en, zh);
```

### 快速命令

```bash
# 搜索特定翻译字段
grep -r "specificField" dictionaries/

# 检查翻译文件格式
npx jsonlint dictionaries/en.json
npx jsonlint dictionaries/zh.json

# 查找硬编码文字
grep -r "Hard coded text" src/components/
```

### VS Code 扩展推荐
- **i18n Ally**: 翻译文件管理
- **JSON Tools**: JSON格式化和验证
- **Auto Rename Tag**: HTML标签同步重命名

---

## ⚠️ 注意事项

1. **硬编码文字**: 一些组件中仍有硬编码的英文文字，建议逐步移到翻译文件中
2. **字段一致性**: 确保所有语言的字典文件结构保持一致
3. **类型安全**: 修改翻译结构时，同时更新 `src/lib/dictionaries.ts` 中的类型定义
4. **回退机制**: 组件中都有默认的英文文字作为回退，防止翻译缺失时页面出错
5. **长文本处理**: 对于长段落，考虑使用数组格式便于维护

## 🚀 优化建议

1. **类型检查**: 使用 TypeScript 确保翻译字段的类型安全
2. **翻译工具**: 考虑使用 i18n 工具进行翻译管理
3. **自动化**: 添加脚本检查翻译文件的完整性
4. **文档同步**: 修改组件时及时更新本文档

---

## 📁 文件结构

```
dictionaries/
├── en.json           # 英文翻译
├── zh.json           # 中文翻译
└── TRANSLATION_GUIDE.md  # 本完整指南
```

这个综合指南包含了翻译系统的所有信息，从快速查找到详细说明，再到实际使用示例，应该能满足所有开发需求！ 