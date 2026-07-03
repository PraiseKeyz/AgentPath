'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getConversations, createConversation, deleteConversation, type Conversation } from '@/services/chat.service'
import { MessageSquare, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react'

export default function ChatListPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadConversations()
  }, [])

  async function loadConversations() {
    setError('')
    setLoading(true)
    try {
      const data = await getConversations()
      // Sort conversations: newest first
      const sorted = [...data].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      setConversations(sorted)
    } catch (err: any) {
      setError(err.message ?? 'Failed to load conversations.')
    } finally {
      setLoading(false)
    }
  }

  async function handleNew() {
    try {
      const conversation = await createConversation()
      router.push(`/chat/${conversation._id}`)
    } catch (err: any) {
      setError(err.message ?? 'Failed to create a new chat.')
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeletingId(id)
    try {
      await deleteConversation(id)
      setConversations((prev) => prev.filter((c) => c._id !== id))
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete conversation.')
    } finally {
      setDeletingId(null)
    }
  }

  // Format date helper: "Today", "Yesterday", or "July 3"
  function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - d.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const isToday = d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()

    if (isToday) return 'Today'
    if (diffDays <= 1) return 'Yesterday'
    
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-[#E9E9E7] pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#F6F5F4] text-[#37352F] border border-[#E9E9E7]">
            <MessageSquare size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#000000] tracking-tight">AI Mentor Chat</h1>
            <p className="text-xs text-[#787774] font-medium">Discuss goals, scholarships, and applications</p>
          </div>
        </div>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-1.5 bg-[#0075DE] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#097FE8] active:bg-[#005BAB] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          <Plus size={14} strokeWidth={2.5} />
          New chat
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 flex items-start gap-2.5 bg-[#FEF3F1] border border-[#F77463]/20 text-[#F64932] text-xs px-4 py-3 rounded-lg animate-fade-in">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{error}</p>
            <button
              onClick={loadConversations}
              className="mt-1 font-bold underline hover:text-[#F77463] cursor-pointer"
            >
              Try reloading
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-20 bg-white border border-[#E9E9E7] rounded-xl p-4 flex flex-col justify-between"
            >
              <div className="h-4 bg-[#F6F5F4] rounded w-2/3 animate-pulse" />
              <div className="h-3 bg-[#F6F5F4] rounded w-1/4 animate-pulse mt-2" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && conversations.length === 0 && (
        <div className="text-center py-16 px-4 bg-white border border-[#E9E9E7] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] animate-slide-up">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E6F3FE] text-[#0075DE] mb-4 shadow-[0_1px_3px_rgba(0,117,222,0.1)]">
            <Sparkles size={20} />
          </div>
          <h2 className="text-base font-extrabold text-[#000000] tracking-tight mb-2">
            Start your first conversation
          </h2>
          <p className="text-[#787774] text-xs font-medium max-w-sm mx-auto mb-6 leading-relaxed">
            Your AI mentor is ready to help you discover opportunities, review essays, and plan your academic journey.
          </p>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 bg-[#0075DE] text-white px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-[#097FE8] active:bg-[#005BAB] transition-all duration-150 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            Say hello to your mentor
          </button>
        </div>
      )}

      {/* Conversation List */}
      {!loading && conversations.length > 0 && (
        <ul className="flex flex-col gap-3">
          {conversations.map((c) => (
            <li key={c._id} className="animate-slide-up">
              <Link
                href={`/chat/${c._id}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E9E9E7] hover:border-[#62AEF0] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all duration-200 group"
              >
                <div className="min-w-0 pr-4">
                  <h3 className="font-bold text-sm text-[#37352F] group-hover:text-black transition-colors truncate">
                    {c.title || 'Untitled Conversation'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-[#B4B4B0] uppercase tracking-wider">
                      {formatDate(c.updatedAt)}
                    </span>
                  </div>
                </div>

                <button
                  disabled={deletingId === c._id}
                  onClick={(e) => handleDelete(c._id, e)}
                  className="opacity-0 group-hover:opacity-100 text-[#B4B4B0] hover:text-[#F64932] p-1.5 rounded-md hover:bg-[#FEF3F1] transition-all duration-150 cursor-pointer shrink-0 disabled:opacity-50"
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
