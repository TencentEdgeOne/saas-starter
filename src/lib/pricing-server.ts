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

    console.log("Supabase pricing data:", data);

    // 获取国际化字典
    const dict = await getDictionary(locale)
    const pricingDict = dict.pricing

    console.log(`获取 ${locale} 语言的价格字典:`, pricingDict.plans.map(p => p.name))

    const pricing = data
      ?.map((item: SupabaseProduct, index: number) => {
        // 根据产品名称映射到字典中的对应计划
        
        const planKey = {
          'Lite': '入门版',
          'Standard': '专业版', 
          'Pro': '企业版'
        }
        console.log(`映射 ${item.name} -> ${planKey}`)
        
        const planData = pricingDict.plans.find(plan => 
          plan.name.toLowerCase() === planKey[item.name]
        )
        
        console.log(`找到计划数据:`, planData?.name || '未找到',planData)

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
      .sort((a, b) => a.price - b.price) ?? [];

    return pricing;
  } catch (error) {
    console.error("获取价格数据时发生错误:", error);
    return [];
  }
}
