/**
 * FAQ related type definitions
 * Centralized types for FAQ items and configurations
 */

export interface FAQ {
  question: string
  answer: string
}

export interface FAQConfig {
  faqs: FAQ[]
} 