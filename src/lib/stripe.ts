import Stripe from 'stripe'

// 创建 Stripe 客户端
export function createStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  }
  
  return  new Stripe(stripeSecretKey, {
    apiVersion: '2025-08-27.basil',
  })
}

// 获取重定向 URL
export function getRedirectUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}

// 解析 URL 查询参数
export function parseQueryParams(url: string) {
  const queryString = url.split('?').pop() || ''
  return queryString.split('&').reduce((prev, cur) => {
    const [key, value] = cur.split('=')
    if (key && value) {
      prev[key] = decodeURIComponent(value)
    }
    return prev
  }, {} as Record<string, string>)
}

/**
 * Create a Stripe Customer
 * @param {*} email 
 * @returns 
 */
export const createStripeCustomer = async (email, uuid) => {
    const stripe = createStripe();
    const params = {
      email,
      metadata: {
        supabaseUUID: uuid,
      }
    };
  
    const customer = await stripe.customers.create(params);
  
    return customer.id;
  };
  /**
   * Create a Stripe Portal Session
   * @param {*} customerId 
   */
  export const createStripePortalSession = async (customerId) => {
    const stripe = createStripe();
  
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'http://localhost:4321/',
    });
    return session;
  }