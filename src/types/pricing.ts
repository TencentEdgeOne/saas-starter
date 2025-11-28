/**
 * Pricing related type definitions
 * Centralized types for pricing plans, comparisons, and related data structures
 */

export interface PricingPlan {
  name: string
  price: string
  originalPrice?: string
  period: string
  description: string
  features: string[]
  limitations: string[]
  popular: boolean
  buttonText: string
  buttonVariant: string
}

export interface ComparisonFeature {
  name: string
  starter: string | boolean
  professional: string | boolean
  enterprise: string | boolean
}

export interface ComparisonFeatureItem {
  name: string
  starter: boolean | string
  professional: boolean | string
  enterprise: boolean | string
}

export interface ComparisonFeatureCategory {
  category: string
  items: ComparisonFeatureItem[]
}

export interface ComparisonData {
  title: string
  description: string
  tableHeaders?: {
    features: string
    starter: string
    professional: string
    enterprise: string
  }
  planPricing?: {
    starter: string
    professional: string
    enterprise: string
  }
  features: ComparisonFeatureCategory[]
}

export interface PricingConfig {
  plans: PricingPlan[]
  comparison: Array<{
    category: string
    features: ComparisonFeature[]
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

// 新增：Supabase 产品价格数据结构
export interface SupabaseProduct {
  id: string;
  active: boolean;
  name: string;
  description: string;
  image?: string;
  metadata?: Record<string, any>;
  marketing_features: Array<{ name: string }>;
  prices: SupabasePrice[];
}

export interface SupabasePrice {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  interval: 'day' | 'week' | 'month' | 'year';
  interval_count: number;
  trial_period_days?: number | null;
  type: 'one_time' | 'recurring';
}

// 新增：处理后的价格数据结构
export interface ProcessedPricing {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  priceId: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  currency: string;
  interval: string;
  originalPrice?: number;
  popular?: boolean;
} 