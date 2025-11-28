/**
 * Statistics related type definitions
 * Centralized types for statistics and metrics
 */

export interface StatItem {
  value: string | number
  label: string
  description?: string
  icon?: any // LucideIcon type
  suffix?: string
  prefix?: string
  color?: "primary" | "secondary" | "success" | "warning" | "destructive"
}

export interface BasicStat {
  value: string
  label: string
  suffix?: string
  prefix?: string
  color?: string
} 