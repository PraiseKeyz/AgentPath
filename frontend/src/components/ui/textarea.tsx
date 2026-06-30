import { cn } from '@/utilities/ui'
import * as React from 'react'

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-16 w-full rounded border border-brand-grey-02 bg-brand-white px-3 py-2 text-base text-brand-black outline-none transition-colors placeholder:text-brand-black/45 selection:bg-brand-primary selection:text-brand-secondary focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
