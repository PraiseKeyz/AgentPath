'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getConversations, createConversation, deleteConversation, type Conversation } from '@/services/chat.service'
import { MessageSquarePlus, Trash2 } from 'lucide-react'

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
        <h1 className="text-2xl font-bold">Conversations</h1>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          <MessageSquarePlus size={16} />
          New chat
        </button>
      </div>

      {loading && <p className="text-gray-400 text-sm">Loading…</p>}

      {!loading && conversations.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No conversations yet.</p>
          <button
            onClick={handleNew}
            className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-800 transition-colors"
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
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div>
                <p className="font-medium text-sm">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(c.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(c._id, e)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
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
