export interface Product {
  id: string
  name: string
  description?: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Price {
  id: string
  product_id: string
  active: boolean
  currency: string
  description?: string
  type: 'one_time' | 'recurring'
  unit_amount: number
  interval?: 'day' | 'week' | 'month' | 'year'
  interval_count?: number
  trial_period_days?: number
  created_at: string
  updated_at: string
  products?: Product
}

export interface Subscription {
  id: string
  user_id: string
  status: 'incomplete' | 'incomplete_expired' | 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
  price_id: string
  quantity?: number
  cancel_at_period_end: boolean
  created: string
  current_period_start: string
  current_period_end: string
  ended_at?: string
  cancel_at?: string
  canceled_at?: string
  trial_start?: string
  trial_end?: string
  created_at: string
  updated_at: string
  prices?: Price
}
