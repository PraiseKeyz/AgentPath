import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, Compass, Map, User } from 'lucide-react'

const navItems = [
  { href: '/chat', label: 'Chat', Icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', Icon: Compass },
  { href: '/roadmap', label: 'Roadmap', Icon: Map },
  { href: '/profile', label: 'Profile', Icon: User },
]

export default function OpportunitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="w-[240px] bg-[#F6F5F4] border-r border-[#E9E9E7] flex flex-col shrink-0">
        <div className="px-4 py-4 flex items-center gap-2">
          <Image src="/logo.png" alt="AgentPath" width={24} height={24} />
          <span className="font-bold text-[#000000] text-base">AgentPath</span>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 flex-1 pt-2">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F] transition-all duration-150"
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-white">{children}</main>
    </div>
  )
}
