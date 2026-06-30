import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[4px] text-[11px] font-semibold leading-none tracking-tight opacity-100 transition-colors disabled:pointer-events-none disabled:opacity-50 shrink-0 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:outline-1 focus-visible:ring-4 ring-ring/10 cursor-pointer",
  {
    variants: {
      variant: {
        default: 'bg-brand-primary text-brand-secondary hover:brightness-110',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-[#E7E7E9] bg-brand-white text-brand-secondary hover:bg-brand-white/90',
        secondary: 'bg-brand-secondary text-white hover:brightness-125',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'h-auto w-auto px-0 py-0 text-brand-primary underline-offset-4 hover:underline',
      },
      size: {
        clear: '',
        default: 'h-[50px] w-[182px] px-10 py-3',
        sm: 'h-[50px] w-[182px] px-10 py-3',
        lg: 'h-[50px] w-[182px] px-10 py-3',
        icon: 'h-[50px] w-[50px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
