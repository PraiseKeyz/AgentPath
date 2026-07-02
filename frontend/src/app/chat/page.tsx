'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getConversations, createConversation, deleteConversation, type Conversation } from '@/services/chat.service'
import { MessageSquarePlus, Trash2, MessageCircle } from 'lucide-react'

export default function ChatListPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .finally(() => setLoading(false))
  }, [])

  async function handleNew() {
    const conversation = await createConversation()
    router.push(`/chat/${conversation._id}`)
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault()
    await deleteConversation(id)
    setConversations((prev) => prev.filter((c) => c._id !== id))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#000000]">Conversations</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-[#0075DE] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#097FE8] transition-all duration-200 cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <MessageSquarePlus size={16} />
          New chat
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-[#B4B4B0] text-sm py-8 justify-center">
          <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
          Loading…
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E6F3FE] text-[#0075DE] mb-4">
            <MessageCircle size={24} />
          </div>
          <p className="text-[#787774] mb-4 text-sm">No conversations yet.</p>
          <button
            onClick={handleNew}
            className="bg-[#0075DE] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#097FE8] transition-all duration-200 cursor-pointer"
          >
            Start your first conversation
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {conversations.map((c) => (
          <li key={c._id}>
            <Link
              href={`/chat/${c._id}`}
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#E9E9E7] hover:border-[#D3D3D0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-200 group"
            >
              <div>
                <p className="font-medium text-sm text-[#000000]">{c.title}</p>
                <p className="text-xs text-[#B4B4B0] mt-0.5">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(c._id, e)}
                className="opacity-0 group-hover:opacity-100 text-[#B4B4B0] hover:text-[#F64932] transition-all duration-150 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
