"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { LucideIcon } from 'lucide-react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient" | "primary" | "success" | "warning"
  size?: "default" | "sm" | "lg" | "xl" | "icon"
  loading?: boolean
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "default", 
    loading = false,
    icon: Icon,
    iconPosition = "left",
    fullWidth = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      primary: "bg-primary text-white hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      secondary: "bg-white text-primary hover:bg-secondary/90",
      outline: "border border-input text-primary bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      gradient: "btn-gradient text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
      success: "bg-green-600 text-white hover:bg-green-700",
      warning: "bg-amber-600 text-white hover:bg-amber-700"
    }
    
    const sizeClasses = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-11 rounded-md px-8 text-base",
      xl: "h-12 rounded-md px-10 text-lg",
      icon: "h-10 w-10"
    }

    const LoadingSpinner = () => (
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
    )

    const renderIcon = () => {
      if (loading) {
        return <LoadingSpinner />
      }
      if (Icon) {
        const iconClasses = cn(
          "h-4 w-4",
          children && iconPosition === "left" && "mr-2",
          children && iconPosition === "right" && "ml-2"
        )
        return <Icon className={iconClasses} />
      }
      return null
    }

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {iconPosition === "left" && renderIcon()}
        {children}
        {iconPosition === "right" && renderIcon()}
      </button>
    )
  }
)
Button.displayName = "Button"

// Preset button combinations
export const PrimaryButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="primary" ref={ref} {...props} />
)
PrimaryButton.displayName = "PrimaryButton"

export const GradientButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="gradient" ref={ref} {...props} />
)
GradientButton.displayName = "GradientButton"

export const LinkButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => <Button variant="link" ref={ref} {...props} />
)
LinkButton.displayName = "LinkButton"

export { Button } 