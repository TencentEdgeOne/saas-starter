import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from 'lucide-react'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "primary" | "gradient"
  size?: "sm" | "default" | "lg"
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ 
  className, 
  variant = "default", 
  size = "default",
  icon: Icon,
  iconPosition = "left",
  removable = false,
  onRemove,
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    primary: "bg-primary text-white hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200",
    warning: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200",
    gradient: "bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-md"
  }
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  }

  const renderIcon = () => {
    if (Icon) {
      const iconClasses = cn(
        size === "sm" ? "h-3 w-3" : "h-4 w-4",
        children && iconPosition === "left" && "mr-1",
        children && iconPosition === "right" && "ml-1"
      )
      return <Icon className={iconClasses} />
    }
    return null
  }

  const renderRemoveButton = () => {
    if (removable && onRemove) {
      return (
        <button
          onClick={onRemove}
          className="ml-1 h-3 w-3 rounded-full hover:bg-black/20 flex items-center justify-center"
          aria-label="Remove"
        >
          ×
        </button>
      )
    }
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
      {renderRemoveButton()}
    </div>
  )
})
Badge.displayName = "Badge"

// Preset badge combinations
export const PrimaryBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => <Badge variant="primary" {...props} ref={ref} />
)
PrimaryBadge.displayName = "PrimaryBadge"

export const SuccessBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => <Badge variant="success" {...props} ref={ref} />
)
SuccessBadge.displayName = "SuccessBadge"

export const WarningBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => <Badge variant="warning" {...props} ref={ref} />
)
WarningBadge.displayName = "WarningBadge"

export const InfoBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => <Badge variant="info" {...props} ref={ref} />
)
InfoBadge.displayName = "InfoBadge"

export const TagBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'removable'>>(
  (props, ref) => <Badge variant="secondary" removable {...props} ref={ref} />
)
TagBadge.displayName = "TagBadge"

export const StatusBadge = React.forwardRef<HTMLDivElement, Omit<BadgeProps, 'size'>>(
  (props, ref) => <Badge size="sm" {...props} ref={ref} />
)
StatusBadge.displayName = "StatusBadge"

export { Badge } 