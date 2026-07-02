import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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
        'inline-flex items-center gap-1.5 text-sm font-semibold text-[#787774] no-underline hover:text-[#000000] transition-colors duration-150',
        className,
      )}
      href={href}
    >
      <ArrowLeft aria-hidden className="size-4 shrink-0" />
      {children}
    </Link>
  )
}

export function ForwardLink({ children, className, href }: NavLinkProps) {
  return (
    <Link
      className={cn(
        'inline-flex items-center gap-1.5 text-sm font-semibold text-[#787774] no-underline hover:text-[#000000] transition-colors duration-150',
        className,
      )}
      href={href}
    >
      {children}
      <ArrowRight aria-hidden className="size-4 shrink-0" />
    </Link>
  )
}
