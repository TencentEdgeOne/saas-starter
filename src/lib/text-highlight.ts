/**
 * Text highlighting utility for adding styled spans to specific keywords
 * 文字高亮工具，为特定关键词添加样式
 */

import { getDictionary, type Dictionary } from './dictionaries';
import { type Locale, locales } from './i18n';

interface HighlightConfig {
  en: string | string[];        // English keywords to highlight
  zh: string | string[];        // Chinese keywords to highlight
  [key: string]: string | string[] | undefined; // Support for additional languages dynamically
  className?: string;           // CSS class for highlighting (default: 'text-primary')
  tagName?: string;            // HTML tag to wrap highlighted text (default: 'span')
}

interface HighlightTextOptions {
  text: string;                // The text to process
  locale?: string;             // Current locale ('en', 'zh', etc.)
  highlights: HighlightConfig | HighlightConfig[]; // Keywords to highlight
}

/**
 * Highlights specific keywords in text with styled spans
 * 为文本中的特定关键词添加样式
 * 
 * @param options - Configuration object
 * @returns HTML string with highlighted keywords
 * 
 * @example
 * // Single keyword highlighting
 * const result = highlightText({
 *   text: "Build amazing SaaS applications",
 *   locale: "en",
 *   highlights: { en: "SaaS", zh: "SaaS应用" }
 * });
 * 
 * @example
 * // Multiple keywords with custom styling
 * const result = highlightText({
 *   text: "Ship Fast with Next.js",
 *   locale: "en", 
 *   highlights: [
 *     { en: "Ship Fast", zh: "快速发布" },
 *     { en: "Next.js", zh: "Next.js", className: "text-blue-600" }
 *   ]
 * });
 */
export function highlightText({ 
  text, 
  locale = 'en', 
  highlights 
}: HighlightTextOptions): string {
  if (!text) return '';
  
  // Normalize highlights to array
  const highlightArray = Array.isArray(highlights) ? highlights : [highlights];
  
  let processedText = text;
  
  // Process each highlight configuration
  for (const highlight of highlightArray) {
    const { className = 'text-primary', tagName = 'span', ...localeKeywords } = highlight;
    
    // Determine which keywords to use based on locale - dynamically support all languages
    let keywords: string[] = [];
    
    // First try to find exact locale match
    const localeKeywordsValue = localeKeywords[locale];
    if (localeKeywordsValue) {
      keywords = Array.isArray(localeKeywordsValue) ? localeKeywordsValue : [localeKeywordsValue];
    } else {
      // Fallback: try language prefix (e.g., 'en' for 'en-US')
      const languagePrefix = locale.split('-')[0];
      const prefixKeywords = localeKeywords[languagePrefix];
      if (prefixKeywords) {
        keywords = Array.isArray(prefixKeywords) ? prefixKeywords : [prefixKeywords];
      } else {
        // Final fallback: use English or first available language
        const fallbackKeywords = localeKeywords.en || localeKeywords[Object.keys(localeKeywords).find(key => key !== 'className' && key !== 'tagName') || ''];
        if (fallbackKeywords) {
          keywords = Array.isArray(fallbackKeywords) ? fallbackKeywords : [fallbackKeywords];
        }
      }
    }
    
    // Apply highlighting for each keyword
    for (const keyword of keywords) {
      if (keyword && processedText.includes(keyword)) {
        const regex = new RegExp(escapeRegExp(keyword), 'g');
        const replacement = `<${tagName} class="${className}">${keyword}</${tagName}>`;
        processedText = processedText.replace(regex, replacement);
      }
    }
  }
  
  return processedText;
}

/**
 * Escapes special regex characters in a string
 * 转义字符串中的特殊正则表达式字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate highlight configurations from dictionaries for all supported locales
 * 从所有支持的语言字典生成高亮配置
 */
export async function generateHighlightsFromDictionaries(): Promise<HighlightConfig[]> {
  try {
    // Load dictionaries for all supported locales
    const dictionaries = await Promise.all(
      locales.map(async (locale) => {
        try {
          const dict = await getDictionary(locale);
          return { locale, dict };
        } catch (error) {
          console.warn(`Failed to load dictionary for locale: ${locale}`, error);
          return null;
        }
      })
    );

    const validDictionaries = dictionaries.filter(Boolean) as Array<{ locale: Locale; dict: Dictionary }>;
    
    if (validDictionaries.length === 0) {
      throw new Error('No valid dictionaries found');
    }

    const highlights: HighlightConfig[] = [];
    
    // Use the first dictionary as the base (usually English)
    const baseDictionary = validDictionaries[0];
    if (!baseDictionary.dict.highlights?.keywords) {
      throw new Error('Base dictionary does not contain highlights');
    }

    const baseKeywords = baseDictionary.dict.highlights.keywords;
    
    // Create keyword maps for all other locales
    const keywordMaps = new Map<Locale, Map<string, string>>();
    
    validDictionaries.forEach(({ locale, dict }) => {
      if (dict.highlights?.keywords) {
        const keywordMap = new Map(dict.highlights.keywords.map(item => [item.key, item.value]));
        keywordMaps.set(locale, keywordMap);
      }
    });

    // Generate highlights for each base keyword
    baseKeywords.forEach(baseKeyword => {
      const highlight: HighlightConfig = {} as HighlightConfig;
      let hasAllTranslations = true;

      // Add translations for all supported locales
      for (const { locale } of validDictionaries) {
        const keywordMap = keywordMaps.get(locale);
        const translation = keywordMap?.get(baseKeyword.key);
        
        if (translation) {
          highlight[locale] = translation;
        } else {
          // Fallback to base keyword value if translation not found
          highlight[locale] = baseKeyword.value;
          if (locale !== baseDictionary.locale) {
            hasAllTranslations = false;
          }
        }
      }

      // Only add highlight if it has at least the base translation
      if (highlight[baseDictionary.locale]) {
        highlights.push(highlight);
      }
    });
    
    return highlights;
  } catch (error) {
    console.warn('Failed to generate highlights from dictionaries, using fallback', error);
    return getFallbackHighlights();
  }
}

/**
 * Fallback highlight configurations for common use cases
 * 常用场景的备用高亮配置
 */
export function getFallbackHighlights(): HighlightConfig[] {
  return [
    { en: 'SaaS', zh: 'SaaS' },
    { en: 'Developers', zh: '开发者' },
    { en: 'Questions', zh: '问题' },
    { en: 'Pricing', zh: '定价' },
    { en: 'Ship Fast', zh: '快速发布' },
    { en: 'Next.js', zh: 'Next.js' },
    { en: 'Features', zh: '功能' },
    { en: 'Analytics', zh: '分析' },
    { en: 'Dashboard', zh: '仪表板' },
    { en: 'Product', zh: '产品' },
    { en: 'Solution', zh: '解决方案' },
    { en: 'Technology', zh: '技术' },
    { en: 'Innovation', zh: '创新' },
    { en: 'Performance', zh: '性能' },
    { en: 'Security', zh: '安全' },
    { en: 'Scalability', zh: '可扩展性' },
    { en: 'Efficiency', zh: '效率' },
    { en: 'Succeed', zh: '成功' },
    { en: 'Blog', zh: '博客' },
  ];
}

/**
 * Pre-defined highlight configurations for common use cases (synchronous version)
 * 常用场景的预定义高亮配置（同步版本）
 * @deprecated Use generateHighlightsFromDictionaries() for dynamic loading from dictionaries
 */
export const commonHighlights: HighlightConfig[] = getFallbackHighlights();

/**
 * Helper to get highlighted text for React components with automatic keyword detection
 * React组件的高亮文本辅助函数，支持自动关键词检测
 * 
 * @example
 * // Use with specific highlights
 * const highlightedText = getHighlightedText(dict.hero.title, locale, { en: "SaaS", zh: "SaaS应用" });
 * 
 * @example
 * // Use with automatic common highlights detection
 * const highlightedText = getHighlightedText(dict.hero.title, locale);
 * 
 * @param text - The text to process
 * @param locale - Current locale ('en', 'zh', etc.)
 * @param highlights - Optional specific highlights, if not provided will use commonHighlights
 * @returns HTML string with highlighted keywords
 */
export function getHighlightedText(
  text: string, 
  locale: string, 
  highlights?: HighlightConfig | HighlightConfig[]
): string {
  // If no specific highlights provided, use all common highlights
  const highlightsToUse = highlights || commonHighlights;
  return highlightText({ text, locale, highlights: highlightsToUse });
}

/**
 * Async helper to get highlighted text using dictionary-based highlights
 * 使用基于字典的高亮的异步辅助函数
 * 
 * @example
 * const highlightedText = await getHighlightedTextAsync(dict.hero.title, locale);
 * 
 * @param text - The text to process
 * @param locale - Current locale ('en', 'zh', etc.)
 * @param highlights - Optional specific highlights, if not provided will load from dictionaries
 * @returns Promise<HTML string with highlighted keywords>
 */
export async function getHighlightedTextAsync(
  text: string, 
  locale: string, 
  highlights?: HighlightConfig | HighlightConfig[]
): Promise<string> {
  // If specific highlights provided, use them
  if (highlights) {
    return highlightText({ text, locale, highlights });
  }
  
  // Otherwise, load highlights from dictionaries
  const dictionaryHighlights = await generateHighlightsFromDictionaries();
  return highlightText({ text, locale, highlights: dictionaryHighlights });
}

/**
 * Convenient wrapper for common highlighting patterns
 * 常用高亮模式的便捷包装器
 */
export function createHighlighter(locale: string = 'en') {
  return {
    /**
     * Highlights a single keyword
     */
    highlight: (text: string, keyword: HighlightConfig) => 
      highlightText({ text, locale, highlights: keyword }),
    
    /**
     * Highlights multiple keywords
     */
    highlightMultiple: (text: string, keywords: HighlightConfig[]) =>
      highlightText({ text, locale, highlights: keywords }),
    
    /**
     * Highlights using all common presets (automatic detection)
     */
    highlightCommon: (text: string) =>
      highlightText({ text, locale, highlights: commonHighlights }),
      
    /**
     * Highlights using specific common keyword by index
     */
    highlightSpecificCommon: (text: string, index: number) => {
      if (index >= 0 && index < commonHighlights.length) {
        return highlightText({ text, locale, highlights: commonHighlights[index] });
      }
      return text;
    },

    /**
     * Async highlights using dictionary-based keywords
     */
    highlightCommonAsync: async (text: string) => {
      const dictionaryHighlights = await generateHighlightsFromDictionaries();
      return highlightText({ text, locale, highlights: dictionaryHighlights });
    },
  };
}

/**
 * Async version of createHighlighter that loads highlights from dictionaries
 * 异步版本的 createHighlighter，从字典加载高亮配置
 */
export async function createHighlighterAsync(locale: string = 'en') {
  const dictionaryHighlights = await generateHighlightsFromDictionaries();
  
  return {
    /**
     * Highlights a single keyword
     */
    highlight: (text: string, keyword: HighlightConfig) => 
      highlightText({ text, locale, highlights: keyword }),
    
    /**
     * Highlights multiple keywords
     */
    highlightMultiple: (text: string, keywords: HighlightConfig[]) =>
      highlightText({ text, locale, highlights: keywords }),
    
    /**
     * Highlights using dictionary-loaded common presets
     */
    highlightCommon: (text: string) =>
      highlightText({ text, locale, highlights: dictionaryHighlights }),
      
    /**
     * Highlights using specific dictionary keyword by index
     */
    highlightSpecificCommon: (text: string, index: number) => {
      if (index >= 0 && index < dictionaryHighlights.length) {
        return highlightText({ text, locale, highlights: dictionaryHighlights[index] });
      }
      return text;
    },

    /**
     * Get all loaded highlights
     */
    getHighlights: () => dictionaryHighlights,
  };
} 