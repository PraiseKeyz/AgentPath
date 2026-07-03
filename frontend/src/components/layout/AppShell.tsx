'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, Compass, Map, User, Menu, X, LogOut } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { usePageTitle } from '@/providers/PageTitleProvider'

interface AppShellProps {
  children: React.ReactNode
  user: { name: string; email: string } | null
  logout: () => void
}

const navItems = [
  { href: '/chat', label: 'AI Mentor', Icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', Icon: Compass },
  { href: '/roadmap', label: 'Roadmap', Icon: Map },
  { href: '/profile', label: 'Profile', Icon: User },
]

const STATIC_TITLES: Record<string, string> = {
  '/chat': 'AI Mentor',
  '/opportunities': 'Opportunities',
  '/roadmap': 'Roadmap',
  '/profile': 'Profile',
}

function getContentTitle(pathname: string, contextTitle: string): string {
  if (pathname.startsWith('/chat/') && contextTitle) return contextTitle
  if (pathname.startsWith('/chat/')) return 'New conversation'
  for (const [prefix, label] of Object.entries(STATIC_TITLES)) {
    if (pathname.startsWith(prefix)) return label
  }
  return 'AgentPath'
}

export default function AppShell({ children, user, logout }: AppShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { title: contextTitle } = usePageTitle()

  function getInitials(name?: string) {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const contentTitle = getContentTitle(pathname, contextTitle)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F6F5F4] border-r border-[#E9E9E7]">
      {/* Brand */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <Link href="/chat" className="flex items-center">
          <Logo size={22} />
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1 rounded hover:bg-[#EFEEEC] text-[#787774] hover:text-[#37352F]"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1 pt-1">
        <p className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-widest px-3 py-2 select-none">
          Workspace
        </p>
        {navItems.map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'bg-[#0075DE]/10 text-[#0075DE] font-semibold'
                  : 'text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={active ? 2.2 : 1.8}
                className={active ? 'text-[#0075DE]' : ''}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="p-3 border-t border-[#E9E9E7] flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
            <div className="size-8 rounded-full bg-gradient-to-br from-[#0075DE] to-[#62AEF0] text-white flex items-center justify-center text-xs font-bold select-none shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#37352F] truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#787774] truncate leading-none mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => { setIsMobileMenuOpen(false); logout() }}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-[#F64932] hover:bg-[#FEF3F1] font-semibold transition-colors duration-150 cursor-pointer"
          >
            <LogOut size={12} />
            Sign out
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[220px] md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main content column */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Content header — shows page/conversation title */}
        <header className="h-[52px] border-b border-[#E9E9E7] flex items-center px-5 shrink-0 bg-white gap-3">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1 -ml-1 rounded hover:bg-[#F6F5F4] text-[#787774] shrink-0"
          >
            <Menu size={18} />
          </button>

          <h1 className="text-[15px] font-semibold text-[#000000] tracking-tight truncate">
            {contentTitle}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
