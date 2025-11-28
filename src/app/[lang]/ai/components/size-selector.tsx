"use client"

import { useState } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

interface SizeSelectorProps {
  value: string
  onChange: (value: string) => void
  availableSizes: string[]
  label: string
  placeholder: string
}

export function SizeSelector({ value, onChange, availableSizes, label, placeholder }: SizeSelectorProps) {
  const [open, setOpen] = useState(false)
  
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </label>
      <Select.Root value={value} onValueChange={onChange} open={open} onOpenChange={setOpen}>
        <Select.Trigger className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-4 py-1.5 text-left text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary h-9">
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="ml-2">
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Content 
          className="z-50 w-[var(--radix-select-trigger-width)] rounded-lg border border-border bg-background shadow-lg ring-1 ring-black/5 focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
          position="popper"
          sideOffset={2}
        >
          <Select.Viewport>
            {availableSizes.map((sizeOption, index) => {
              const isFirst = index === 0
              const isLast = index === availableSizes.length - 1
              const roundedClass = isFirst ? 'rounded-t-lg' : isLast ? 'rounded-b-lg' : ''
              return (
                <Select.Item
                  key={sizeOption}
                  value={sizeOption}
                  className={`relative cursor-pointer select-none ${roundedClass} px-4 py-2 text-sm outline-none border-none data-[highlighted]:bg-primary/10 data-[highlighted]:text-primary data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary`}
                >
                  <Select.ItemText>
                    <span className="font-medium">{sizeOption}</span>
                  </Select.ItemText>
                  <Select.ItemIndicator className="absolute inset-y-0 right-0 flex items-center pr-2 text-primary">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>
              )
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

