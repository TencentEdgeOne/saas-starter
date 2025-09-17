import React from 'react'
import { Check, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProcessedPricing } from '@/types/pricing'

interface PricingProps {
  pricingData?: ProcessedPricing[]
  dict?: {
    pricing: {
      mostPopular?: string,
      plans: {
        name: string
        description: string
        price: string
        period: string
        popular: boolean
        features: string[]
        buttonText: string
      }[]
    }
    common?: {
      pricing?: {
        perMonth?: string
        perYear?: string
      }
    }
  }
}

export function Pricing({ pricingData, dict }: PricingProps) {
  // 优先使用 Supabase 数据，如果没有则使用字典数据作为后备
  const pricingPlans = pricingData || dict?.pricing.plans || []
  
  return (
    <section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {pricingPlans.map((plan, index) => {
            // 处理不同的数据结构
            const isSupabaseData = 'priceId' in plan
            const planName = plan.name
            const planDescription = plan.description
            const planPrice = plan.price
            const planPeriod = isSupabaseData 
              ? plan.interval === 'month' ? dict?.common?.pricing?.perMonth : dict?.common?.pricing?.perYear
              : plan.period
            const planFeatures = plan.features
            const planButtonText = plan.buttonText
            const isPopular = plan.popular
            
            return (
              <Card 
                key={isSupabaseData ? plan.id : index} 
                className={`relative flex flex-col h-full ${
                  isPopular 
                    ? 'border-primary shadow-lg' 
                    : 'border-border'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" size="default" icon={Star} iconPosition="left">
                      {dict?.pricing?.mostPopular || "Most Popular"}  
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">{planName}</CardTitle>
                  <CardDescription>{planDescription}</CardDescription>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{planPrice}</span>
                    <span className="text-muted-foreground ml-2">{planPeriod}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-1">
                  <ul className="space-y-3 mb-6 flex-1">
                    {planFeatures?.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mr-3 mt-0.5" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-auto">
                    {isSupabaseData && plan.priceId ? (
                      <a 
                        href={`/api/checkout?plan=${encodeURIComponent(planName)}&price=${plan.priceId}`}
                        className={`w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                          isPopular 
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 btn-gradient text-white' 
                            : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2'
                        }`}
                      >
                        {planButtonText}
                      </a>
                    ) : (
                      <Button 
                        className={`w-full ${isPopular ? 'btn-gradient text-white' : ''}`}
                        variant={isPopular ? 'default' : 'outline'}
                      >
                        {planButtonText}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
} 