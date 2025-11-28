# Complete Translation System Guide

This document serves as a comprehensive guide to the project's translation system, covering quick references, detailed component mappings, usage examples, and best practices.

## 📚 Table of Contents
- [🚀 Quick Reference Table](#-quick-reference-table)
- [🎯 Page Classification](#-page-classification)  
- [🗂 Detailed Component Mapping](#-detailed-component-mapping)
- [📚 Translation Usage Examples](#-translation-usage-examples)
- [🎯 Best Practices](#-best-practices)
- [🔧 Tools and Tips](#-tools-and-tips)

---

## 🚀 Quick Reference Table

| Component | File Path | Translation Fields | Pages |
|-----------|-----------|-------------------|-------|
| **Hero** | `src/components/sections/hero.tsx` | `dict.hero.*` | Homepage |
| **Features** | `src/components/sections/features.tsx` | `dict.features.*` | Homepage, Features |
| **Pricing** | `src/components/sections/pricing.tsx` | `dict.pricing.plans[]` | Homepage, Pricing |
| **PricingComparison** | `src/components/sections/pricing-comparison.tsx` | `dict.pricing.comparison.*` | Pricing |
| **FAQ** | `src/components/sections/faq.tsx` | `dict.faq.*` | Homepage, Pricing |
| **Testimonials** | `src/components/sections/testimonials.tsx` | `dict.testimonials.*` | Homepage |
| **Header** | `src/components/layout/header.tsx` | `dict.header.*` | Global |
| **Footer** | `src/components/layout/footer.tsx` | `dict.footer.*` | Global |
| **ContactForm** | `src/components/ui/contact-form.tsx` | `dict.form.*` | Contact |
| **CTASection** | `src/components/ui/cta-section.tsx` | `dict.cta.*` | Multiple |

## 🎯 Page Classification

### Homepage (`src/app/[lang]/page.tsx`)
```typescript
dict.hero.*           // Hero section
dict.features.*       // Features section  
dict.pricing.*        // Pricing section
dict.testimonials.*   // Testimonials section
dict.faq.*           // FAQ section
```

### Pricing Page (`src/app/[lang]/pricing/page.tsx`)
```typescript
dict.pricing.badge           // Page badge
dict.pricing.pageTitle       // Page title
dict.pricing.pageSubtitle    // Page subtitle
dict.pricing.plans[]         // Pricing plans
dict.pricing.comparison.*    // Feature comparison table
dict.pricing.faqs[]          // FAQ list
dict.pricing.ctaTitle        // CTA title
dict.pricing.ctaDescription  // CTA description
```

### Features Page (`src/app/[lang]/features/page.tsx`)
```typescript
dict.features.page.*         // Page content
dict.features.heroFeatures[] // Main features
dict.features.featureCategories[] // Feature categories
dict.features.supportFeatures[]   // Support features
```

### Contact Page (`src/app/[lang]/contact/page.tsx`)
```typescript
dict.contact.*      // Page content
dict.form.*         // Form fields
```

### Common Translation Fields

#### Common Buttons (`dict.cta.*`)
```json
{
  "getStarted": "Get Started",
  "learnMore": "Learn More", 
  "startFreeTrial": "Start Free Trial",
  "contactSales": "Contact Sales"
}
```

#### Common Text (`dict.common.*`)
```json
{
  "loading": "Loading...",
  "error": "Something went wrong",
  "popular": "Popular",
  "unlimited": "Unlimited"
}
```

---

## 🗂 Detailed Component Mapping

### Layout Components

#### Header Component
- **File**: `src/components/layout/header.tsx`
- **Translation Fields**:
  ```json
  {
    "header": {
      "navigation": [],      // Navigation menu items
      "cta": {
        "text": "",         // CTA button text
        "href": ""          // CTA button link
      }
    }
  }
  ```

#### Footer Component  
- **File**: `src/components/layout/footer.tsx`
- **Translation Fields**:
  ```json
  {
    "footer": {
      "sections": [{
        "title": "",        // Section title
        "links": [{
          "name": "",       // Link name
          "href": ""        // Link URL
        }]
      }]
    },
    "social": [],           // Social media links
    "site": {
      "copyright": ""       // Copyright information
    }
  }
  ```

### Section Components

#### Hero Section
- **File**: `src/components/sections/hero.tsx`
- **Translation Fields**:
  ```json
  {
    "hero": {
      "badge": "",              // Top badge text
      "title": "",              // Main title
      "subtitle": "",           // Subtitle
      "getStartedFree": "",     // Primary CTA button
      "viewDemo": "",           // Secondary CTA button
      "socialProof": {
        "trustedByDevelopers": "",  // Social proof text
        "readyComponents": "",      // Component count
        "shipInMinutes": ""         // Time commitment
      }
    }
  }
  ```

#### PricingComparison Component
- **File**: `src/components/sections/pricing-comparison.tsx`
- **Translation Fields**:
  ```json
  {
    "pricing": {
      "mostPopular": "",        // "Most Popular" badge
      "comparison": {
        "title": "",            // Table title
        "description": "",      // Table description
        "tableHeaders": {
          "features": "",       // "Features" header
          "starter": "",        // "Starter" header
          "professional": "",   // "Professional" header
          "enterprise": ""      // "Enterprise" header
        },
        "planPricing": {
          "starter": "",        // Starter price
          "professional": "",   // Professional price
          "enterprise": ""      // Enterprise price
        },
        "features": [{
          "category": "",       // Feature category
          "items": [{
            "name": "",         // Feature name
            "starter": "",      // Starter support
            "professional": "", // Professional support
            "enterprise": ""    // Enterprise support
          }]
        }]
      }
    }
  }
  ```

---

## 📚 Translation Usage Examples

### PricingComparison Component Example

```typescript
// Component usage in page
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

### Hero Component Example

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

### Translation Field Structure Comparison

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
      }
    }
  }
}
```

---

## 🎯 Best Practices

### 1. Always Provide Default Values
```typescript
// ✅ Good practice
{dict?.section?.field || "Default Text"}

// ❌ Avoid this  
{dict.section.field} // May cause errors
```

### 2. Use Optional Chaining and Nullish Coalescing
```typescript
// ✅ Safe access method
const title = dict?.hero?.title ?? "Default Title";
const features = dict?.features?.main ?? [];
```

### 3. Handle Array-type Translations Safely
```typescript
// ✅ Safe array handling
const faqs = dict?.faq?.faqs || [];
faqs.map((faq, index) => (
  <div key={index}>
    <h3>{faq.question}</h3>
    <p>{faq.answer}</p>
  </div>
))
```

### 4. Conditional Rendering
```typescript
// ✅ Conditionally display content
{dict?.hero?.socialProof && (
  <div>
    <span>{dict.hero.socialProof.trustedByDevelopers}</span>
    <span>{dict.hero.socialProof.readyComponents}</span>
  </div>
)}
```

### 5. Multi-language Navigation
```typescript
// Maintain language when navigating between pages
const currentLang = usePathname().split('/')[1] || 'en';

<a href={`/${currentLang}/pricing`}>
  {dict?.nav?.pricing}
</a>
```

---

## 🔧 Tools and Tips

### Adding New Translation Fields
1. Add fields in both `en.json` and `zh.json`
2. Update type definitions in `src/lib/dictionaries.ts`  
3. Use `dict.section.field` format in components

### Debugging Translation Issues
1. Check if field path is correct
2. Confirm all language files have corresponding fields
3. Check console for error messages

### Debugging Code
```typescript
// Debug translation object
console.log('Dictionary:', dict);
console.log('Specific section:', dict?.section);

// Check for missing translation keys
const missingKeys = [];
if (!dict?.hero?.title) missingKeys.push('hero.title');
if (missingKeys.length > 0) {
  console.warn('Missing keys:', missingKeys);
}
```

### Validation Script
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

### Quick Commands
```bash
# Search for specific translation fields
grep -r "specificField" dictionaries/

# Check translation file format  
npx jsonlint dictionaries/en.json
npx jsonlint dictionaries/zh.json

# Find hardcoded text
grep -r "Hard coded text" src/components/
```

### Recommended VS Code Extensions
- **i18n Ally**: Translation file management
- **JSON Tools**: JSON formatting and validation
- **Auto Rename Tag**: HTML tag synchronous renaming

---

## ⚠️ Important Notes

1. **Hardcoded Text**: Some components still contain hardcoded English text that should be moved to translation files
2. **Field Consistency**: Ensure all language dictionary files maintain consistent structure  
3. **Type Safety**: Update type definitions in `src/lib/dictionaries.ts` when modifying translation structure
4. **Fallback Mechanism**: Components include default English text as fallback for missing translations
5. **Long Text**: Consider using array format for long paragraphs to improve maintainability

## 🚀 Optimization Suggestions

1. **Type Checking**: Use TypeScript to ensure translation field type safety
2. **Translation Tools**: Consider using i18n tools for translation management
3. **Automation**: Add scripts to check translation file completeness
4. **Documentation Sync**: Update documentation when modifying components

---

## 📁 File Structure

```
dictionaries/
├── en.json                    # English translations
├── zh.json                    # Chinese translations  
├── TRANSLATION_GUIDE.md       # Chinese guide
└── TRANSLATION_GUIDE.en.md    # English guide (this document)
```

This comprehensive guide provides everything needed to work with the translation system effectively! 