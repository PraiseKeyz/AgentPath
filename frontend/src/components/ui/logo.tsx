import React from 'react'
import { cn } from '@/utilities/ui'

interface LogoMarkProps {
  size?: number
  color?: string
  className?: string
}

/** The AgentPath "Route" mark: a dot (where you are) connected to a ring (where you're going). */
export function LogoMark({ size = 24, color = '#0075DE', className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="40" r="3.5" fill={color} />
      <path d="M12 40 C 12 26, 36 34, 36 20" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <circle cx="36" cy="11.5" r="5" stroke={color} strokeWidth="4.5" />
    </svg>
  )
}

interface LogoProps {
  size?: number
  className?: string
  markClassName?: string
  textClassName?: string
  color?: string
}

/** Mark + wordmark lockup. The wordmark is live text so it always matches the UI font. */
export function Logo({ size = 24, className, markClassName, textClassName, color }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark size={size} color={color} className={markClassName} />
      <span className={cn('font-bold text-[#000000] text-base tracking-tight', textClassName)}>
        Agent<span className="text-[#0075DE]">Path</span>
      </span>
    </span>
  )
}
