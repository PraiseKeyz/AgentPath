'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { MessageSquare, Compass, Map, User, Menu, X, LogOut } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

interface AppShellProps {
  children: React.ReactNode
  user: {
    name: string
    email: string
  } | null
  logout: () => void
}

const navItems = [
  { href: '/chat', label: 'Chat', Icon: MessageSquare },
  { href: '/opportunities', label: 'Opportunities', Icon: Compass },
  { href: '/roadmap', label: 'Roadmap', Icon: Map },
  { href: '/profile', label: 'Profile', Icon: User },
]

export default function AppShell({ children, user, logout }: AppShellProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Get user initials
  function getInitials(name?: string) {
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
  }

  // Check if link is active (exact match or prefix for nested paths)
  function isActive(href: string) {
    if (href === '/chat') {
      return pathname.startsWith('/chat')
    }
    if (href === '/opportunities') {
      return pathname.startsWith('/opportunities')
    }
    return pathname === href
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F6F5F4] border-r border-[#E9E9E7]">
      {/* Brand Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-[#E9E9E7]/60 md:border-none">
        <Link href="/" className="flex items-center">
          <Logo size={22} />
        </Link>
        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden p-1 rounded hover:bg-[#EFEEEC] text-[#787774] hover:text-[#37352F]"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 px-2 flex-1 pt-4">
        {navItems.map(({ href, label, Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'bg-[#EFEEEC] text-[#37352F] font-semibold'
                  : 'text-[#787774] hover:bg-[#EFEEEC] hover:text-[#37352F]'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User profile footer */}
      {user && (
        <div className="p-3 border-t border-[#E9E9E7] flex flex-col gap-2 bg-[#F6F5F4]">
          <div className="flex items-center gap-2.5 px-2 py-1">
            <div className="size-8 rounded-full bg-gradient-to-br from-[#0075DE] to-[#62AEF0] text-white flex items-center justify-center text-xs font-semibold select-none shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#37352F] truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-[#787774] truncate leading-none mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              logout()
            }}
            className="flex items-center justify-between w-full text-left px-2 py-1.5 rounded-md text-xs text-[#F64932] hover:bg-[#FEF3F1] font-semibold transition-colors duration-150 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <LogOut size={12} />
              Sign out
            </span>
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[240px] shrink-0 h-full">
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-[240px] md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main layout container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Navbar Header */}
        <header className="md:hidden h-12 border-b border-[#E9E9E7] flex items-center px-4 justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 rounded hover:bg-[#F6F5F4] text-[#37352F]"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-[#000000] text-sm">AgentPath</span>
          </div>
          {user && (
            <div className="size-6 rounded-full bg-gradient-to-br from-[#0075DE] to-[#62AEF0] text-white flex items-center justify-center text-[10px] font-semibold select-none">
              {getInitials(user.name)}
            </div>
          )}
        </header>

        {/* Page Content area */}
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
