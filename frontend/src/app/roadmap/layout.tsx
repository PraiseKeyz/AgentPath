import React from 'react'
import Link from 'next/link'
import { MessageSquare, Compass, Map, User } from 'lucide-react'

const navItems = [
  { href: '/chat', label: 'Chat', Icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', Icon: Compass },
  { href: '/roadmap', label: 'Roadmap', Icon: Map },
  { href: '/profile', label: 'Profile', Icon: User },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-56 border-r border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-5 border-b border-gray-200">
          <span className="font-bold text-green-700 text-lg">AgentPath</span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {navItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
