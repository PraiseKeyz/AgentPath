import Link from 'next/link'
import type { ReactNode } from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

import { cn } from '@/utilities/ui'

type NavLinkProps = {
  children: ReactNode
  className?: string
  href: string
}

export function BackLink({ children, className, href }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary no-underline hover:text-brand-primary',
        className,
      )}
      href={href}
    >
      <FiArrowLeft aria-hidden className="size-4 shrink-0" />
      {children}
    </Link>
  )
}

export function ForwardLink({ children, className, href }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold text-brand-secondary no-underline hover:text-brand-primary',
        className,
      )}
      href={href}
    >
      {children}
      <FiArrowRight aria-hidden className="size-4 shrink-0" />
    </Link>
  )
}
