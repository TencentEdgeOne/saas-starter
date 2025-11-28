import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

import type { 
  ComparisonFeatureItem, 
  ComparisonFeatureCategory, 
  ComparisonData 
} from '@/types/pricing'

interface PricingComparisonProps {
  comparison: ComparisonData;
  mostPopularText: string;
  className?: string;
}

export function PricingComparison({ 
  comparison, 
  mostPopularText,
  className = "" 
}: PricingComparisonProps) {
  return (
    <section className={`py-20 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {comparison.title}
          </h2>
          <p className="text-xl text-muted-foreground">
            {comparison.description}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 mb-8 pt-8">
              <div className="p-4">
                <h3 className="font-semibold text-lg">
                  {comparison.tableHeaders?.features || "Features"}
                </h3>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">
                  {comparison.tableHeaders?.starter || "Starter"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {comparison.planPricing?.starter || "$80/month"}
                </p>
              </div>
              <div className="p-4 text-center relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground whitespace-nowrap">
                    {mostPopularText}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mt-2">
                  {comparison.tableHeaders?.professional || "Professional"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {comparison.planPricing?.professional || "$150/month"}
                </p>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">
                  {comparison.tableHeaders?.enterprise || "Enterprise"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {comparison.planPricing?.enterprise || "$300/month"}
                </p>
              </div>
            </div>

            {/* Feature Categories */}
            {comparison.features.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h4 className="font-semibold text-lg mb-4 px-4 py-2 bg-background rounded-lg">
                  {category.category}
                </h4>
                
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="grid grid-cols-4 gap-4 py-3 border-b border-border/50">
                    <div className="p-4">
                      <span className="font-medium">{item.name}</span>
                    </div>
                    
                    {/* Starter Column */}
                    <div className="p-4 text-center">
                      {typeof item.starter === 'boolean' ? (
                        item.starter ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{item.starter}</span>
                      )}
                    </div>
                    
                    {/* Professional Column */}
                    <div className="p-4 text-center">
                      {typeof item.professional === 'boolean' ? (
                        item.professional ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{item.professional}</span>
                      )}
                    </div>
                    
                    {/* Enterprise Column */}
                    <div className="p-4 text-center">
                      {typeof item.enterprise === 'boolean' ? (
                        item.enterprise ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{item.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 