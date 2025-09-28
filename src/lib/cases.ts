/**
 * Case showcase data for success stories - now loaded from dictionary files
 * 成功案例展示数据 - 现在从字典文件加载
 */

import { type Locale, locales } from './i18n';
import type { CaseShowcaseItem } from '@/types/cases';
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getContentDirectory } from './path-utils'

// CaseShowcaseItem type is now in @/types/cases
export type { CaseShowcaseItem }

// Cache for loaded case data
const casesCache = new Map<Locale, CaseShowcaseItem[]>();

/**
 * Load case data from dictionary files
 * 从字典文件加载案例数据
 */
async function loadCaseData(locale: Locale): Promise<CaseShowcaseItem[]> {
  // Check cache first
  if (casesCache.has(locale)) {
    return casesCache.get(locale)!;
  }

  try {
    // Dynamically import the case data for the specified locale
    const caseData = await import(`../../dictionaries/case-${locale}.json`);
    const cases = caseData.default || caseData;
    
    // Cache the loaded data
    casesCache.set(locale, cases);
    
    return cases;
  } catch (error) {
    console.warn(`Failed to load case data for locale: ${locale}`, error);
    
    
    
    return [];
  }
}

/**
 * Get all case data for all locales
 * 获取所有语言的案例数据
 */
async function loadAllCasesData(): Promise<Record<string, CaseShowcaseItem[]>> {
  const casesData: Record<string, CaseShowcaseItem[]> = {};
  
  await Promise.all(
    locales.map(async (locale) => {
      casesData[locale] = await loadCaseData(locale);
    })
  );
  
  return casesData;
}

/**
 * Get case data for a specific locale
 * 获取特定语言的案例数据
 */
export async function getCases(locale: string = 'en'): Promise<CaseShowcaseItem[]> {
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en';
  return await loadCaseData(validLocale);
}

/**
 * Get all cases data (async version for compatibility)
 * 获取所有案例数据（异步版本以保持兼容性）
 */
export async function getAllCasesAsync(): Promise<Record<string, CaseShowcaseItem[]>> {
  return await loadAllCasesData();
}

/**
 * Get a specific case by slug and locale
 * 根据 slug 和语言获取特定案例
 */
export async function getCaseBySlug(slug: string, locale: string = 'en'): Promise<CaseShowcaseItem | null> {
  const cases = await getCases(locale);
  return cases.find(case_ => case_.slug === slug) || null;
}

/**
 * Sync version for backward compatibility
 * 同步版本以保持向后兼容性
 * @deprecated Use getCases() for better performance with dynamic loading
 */
export const casesData: Record<string, CaseShowcaseItem[]> = {};

// Initialize with empty data for sync compatibility
locales.forEach(locale => {
  casesData[locale] = [];
});

// For backward compatibility, export a function that loads sync data
let syncDataLoaded = false;

/**
 * Load data synchronously for backward compatibility
 * 为向后兼容性同步加载数据
 * @deprecated Use async functions instead
 */
export async function initializeCasesData(): Promise<void> {
  if (syncDataLoaded) return;
  
  const allData = await loadAllCasesData();
  Object.assign(casesData, allData);
  syncDataLoaded = true;
}

/**
 * Backward compatible sync version
 * 向后兼容的同步版本
 * @deprecated Use getCases() async function instead
 */
export function getAllCases(lang: string = 'en'): CaseShowcaseItem[] {
  const casesDirectory = getCasesDirectory(lang)
  if (!fs.existsSync(casesDirectory)) {
    fs.mkdirSync(casesDirectory, { recursive: true })
    return []
  }
  const fileNames = fs.readdirSync(casesDirectory)
  const allCasesData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(casesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      return {
        slug,
        title: matterResult.data.title || '',
        description: matterResult.data.description || '',
        image: matterResult.data.image || '',
        externalUrl: matterResult.data.externalUrl || '',
        tags: matterResult.data.tags || [],
      }
    })
  return allCasesData
}

function getCasesDirectory(lang: string = 'en') {
  return getContentDirectory(lang, 'cases')
}

export function getAllCasesByLocale(): Record<string, CaseShowcaseItem[]> {
  const result: Record<string, CaseShowcaseItem[]> = {}
  locales.forEach((locale) => {
    result[locale] = getAllCases(locale)
  })
  return result
}


