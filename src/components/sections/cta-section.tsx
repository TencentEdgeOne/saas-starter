"use client";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface CTAButton {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "primary" | "success" | "warning";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  href?: string;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
}

export interface TrustIndicator {
  text: string;
  icon?: ReactNode;
}

export interface CTASectionProps {
  title: string;
  description?: string;
  buttons: CTAButton[];
  variant?: "primary" | "secondary" | "gradient" | "minimal" | "custom";
  className?: string;
  children?: ReactNode;
  icon?: LucideIcon;
  iconClassName?: string;
  trustIndicators?: TrustIndicator[];
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "6xl" | "full";
}

export function CTASection({
  title,
  description,
  buttons,
  variant = "primary",
  className = "",
  children,
  icon: Icon,
  iconClassName = "",
  trustIndicators = [],
  maxWidth = "4xl"
}: CTASectionProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground";
      case "secondary":
        return "bg-secondary text-secondary-foreground";
      case "gradient":
        return "bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground";
      case "minimal":
        return "bg-muted/30 text-foreground";
      case "custom":
        return "";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getDescVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return "text-muted-foreground";
      default:
        return "text-white";
    }
  };

  const getTitleVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return "text-primary";
      default:
        return "text-white";
    }
  };

  const getMaxWidthClass = () => {
    const widthMap = {
      sm: "max-w-sm",
      md: "max-w-md", 
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "4xl": "max-w-4xl",
      "6xl": "max-w-6xl",
      full: "max-w-full"
    };
    return widthMap[maxWidth];
  };

  const getDefaultButtonVariant = (index: number): CTAButton["variant"] => {
    // Determine default variant based on CTA variant and button position
    if (variant === "minimal") {
      return index === 0 ? "default" : "secondary";
    } else if (variant === "gradient" || variant === "primary") {
      return "secondary"
    } else {
      return "outline";
    }
  };

  const handleButtonClick = (button: CTAButton) => {
    if (button.href) {
      window.open(`${button.href}`, '_blank')
    } else if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <section className={`py-20 px-4 text-white ${getVariantClasses()} ${className}`}>
      <div className={`${getMaxWidthClass()} mx-auto text-center`}>
        {/* Icon */}
        {Icon && (
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8 ${iconClassName}`}>
            <Icon className="w-8 h-8" />
          </div>
        )}

        {/* Title */}
        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${getTitleVariantClasses()}`}>
          {title}
        </h2>
        
        {/* Description */}
        {description && (
          <p className={`text-xl mb-8 opacity-90 leading-relaxed ${getDescVariantClasses()}`}>
            {description}
          </p>
        )}
        
        {/* Custom Children */}
        {children && (
          <div className="mb-8">
            {children}
          </div>
        )}
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {buttons.map((button, index) => (
            <Button
              key={index}
              size={button.size || "lg"}
              variant={button.variant || getDefaultButtonVariant(index)}
              className={button.className}
              onClick={() => handleButtonClick(button)}
              icon={button.icon}
              iconPosition={button.iconPosition}
              loading={button.loading}
              fullWidth={button.fullWidth}
            >
              {button.text}
            </Button>
          ))}
        </div>

        {/* Trust Indicators */}
        {trustIndicators.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex items-center">
                {indicator.icon || (
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                )}
                <span>{indicator.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Preset CTA variants
export function PrimaryCTA({ 
  title, 
  description, 
  primaryText, 
  secondaryText,
  primaryHref,
  secondaryHref,
  className = "",
  dict
}: {
  title: string;
  description?: string;
  primaryText?: string;
  secondaryText?: string;
  primaryHref?: string;
  secondaryHref?: string;
  className?: string;
  dict?: any; // Simplified type to avoid circular references
}) {
  const defaultPrimaryText = primaryText || dict?.cta?.getStarted || "Get Started";
  const defaultSecondaryText = secondaryText || dict?.cta?.learnMore || "Learn More";
  
  return (
    <CTASection
      title={title}
      description={description}
      variant="primary"
      className={className}
      buttons={[
        { text: defaultPrimaryText, href: primaryHref },
        { text: defaultSecondaryText, href: secondaryHref }
      ]}
    />
  );
}

export function GradientCTA({ 
  title, 
  description, 
  primaryText, 
  secondaryText,
  className = "",
  icon,
  trustIndicators,
  dict
}: {
  title: string;
  description?: string;
  primaryText?: string;
  secondaryText?: string;
  className?: string;
  icon?: LucideIcon;
  trustIndicators?: TrustIndicator[];
  dict?: any; // Simplified type to avoid circular references
}) {
  const defaultPrimaryText = primaryText || dict?.cta?.startFreeTrial || "Start Free Trial";
  const defaultSecondaryText = secondaryText || dict?.cta?.scheduleDemo || "Schedule Demo";
  
  return (
    <CTASection
      title={title}
      description={description}
      variant="gradient"
      className={className}
      icon={icon}
      trustIndicators={trustIndicators}
      buttons={[
        { text: defaultPrimaryText },
        { text: defaultSecondaryText }
      ]}
    />
  );
}

export function MinimalCTA({ 
  title, 
  description, 
  buttonText,
  href,
  className = "",
  dict
}: {
  title: string;
  description?: string;
  buttonText?: string;
  href?: string;
  className?: string;
  dict?: any; // Simplified type to avoid circular references
}) {
  const defaultButtonText = buttonText || dict?.cta?.getStarted || "Get Started";
  
  return (
    <CTASection
      title={title}
      description={description}
      variant="minimal"
      className={`${className}`}
      buttons={[
        { text: defaultButtonText, href }
      ]}
    />
  );
} 