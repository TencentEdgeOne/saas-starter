import { createServerClient } from './supabase'
import { SupabaseProduct, ProcessedPricing } from '@/types/pricing'
import { getDictionary } from './dictionaries'
import { Locale } from './i18n'

/**
 * 从 Supabase 获取产品价格数据
 * 服务端函数，用于 SSR
 */
export async function getPricingData(locale: Locale = 'en'): Promise<ProcessedPricing[]> {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from("products")
      .select("*, prices(*)")
      .eq("active", true)
      .eq("prices.active", true);

    if (error) {
      console.error("获取价格数据失败:", error);
      return [];
    }

    // 获取国际化字典
    const dict = await getDictionary(locale)
    const pricingDict = dict.pricing
    const sortedData = data?.sort((a, b) => {
      const priceA = a.prices[0]?.unit_amount || 0
      const priceB = b.prices[0]?.unit_amount || 0
      return priceA - priceB
    }) ?? []
    const pricing = sortedData
      ?.map((item: SupabaseProduct, index: number) => {
        // 根据产品名称映射到字典中的对应计划
        // 直接使用索引映射，因为 Supabase 数据已经按价格排序
        const planData = pricingDict.plans[index] || pricingDict.plans[0]

        return {
          id: item.id,
          name: planData?.name || item.name,
          description: planData?.description || item.description,
          image: item.image,
          price: item.prices[0]?.unit_amount ? item.prices[0].unit_amount / 100 : 0,
          priceId: item.prices[0]?.id || '',
          features: planData?.features || item.marketing_features?.map((feature) => feature.name) || [],
          buttonText: planData?.buttonText || pricingDict.plans[0]?.buttonText || "Get Started",
          highlight: item.metadata?.highlight || planData?.popular || false,
          currency: item.prices[0]?.currency || 'USD',
          interval: item.prices[0]?.interval || 'month',
          originalPrice: item.metadata?.originalPrice,
          popular:  planData?.popular || false,
        };
      })

    return pricing;
  } catch (error) {
    console.error("获取价格数据时发生错误:", error);
    return [];
  }
}
