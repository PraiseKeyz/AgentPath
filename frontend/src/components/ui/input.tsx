import { cn } from '@/utilities/ui'
import * as React from 'react'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  type,
  ...props
}) => {
  return (
    <input
      data-slot="input"
      className={cn(
        'flex h-12 w-full min-w-0 cursor-text rounded border border-brand-grey-02 bg-brand-white px-3 py-2 text-base text-brand-black outline-none transition-colors placeholder:text-brand-black/45 selection:bg-brand-primary selection:text-brand-secondary file:inline-flex file:h-7 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:border-destructive',
        className,
      )}
      type={type}
      {...props}
    />
  )
}

export { Input }
