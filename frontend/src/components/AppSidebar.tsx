'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Compass, Map, User } from 'lucide-react'

const navItems = [
  { href: '/chat', label: 'Chat', Icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', Icon: Compass },
  { href: '/roadmap', label: 'Roadmap', Icon: Map },
  { href: '/profile', label: 'Profile', Icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[220px] bg-[#F6F5F4] border-r border-[#E9E9E7] flex flex-col shrink-0 h-screen sticky top-0">
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-[#E9E9E7]">
        <img src="/logo.png" alt="AgentPath" width={22} height={22} className="object-contain" />
        <span className="font-bold text-[#000000] text-[15px] tracking-tight">AgentPath</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2 pt-3 flex-1">
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] text-[#000000] font-semibold border border-[#E9E9E7]'
                  : 'text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] font-medium'
              }`}
            >
              <Icon
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? 'text-[#0075DE]' : ''}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[#E9E9E7]">
        <p className="text-[10px] text-[#B4B4B0] text-center font-medium">AgentPath · JAF 2026</p>
      </div>
    </aside>
  )
}
