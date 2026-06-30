'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getConversation, streamMessage, type Message } from '@/services/chat.service'
import { Send } from 'lucide-react'

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getConversation(id)
      .then(({ messages }) => setMessages(messages))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent])

  function handleSend() {
    const content = input.trim()
    if (!content || streaming) return

    const userMsg: Message = {
      _id: Date.now().toString(),
      conversationId: id,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setStreaming(true)
    setStreamingContent('')

    streamMessage(
      id,
      content,
      (chunk) => setStreamingContent((prev) => prev + chunk),
      () => {
        setStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            _id: (Date.now() + 1).toString(),
            conversationId: id,
            role: 'assistant',
            content: streamingContent,
            createdAt: new Date().toISOString(),
          },
        ])
        setStreamingContent('')
      },
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {loading && <p className="text-gray-400 text-sm text-center">Loading…</p>}

        {!loading && messages.length === 0 && !streaming && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Say hello to get started.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-green-700 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm bg-gray-100 text-gray-800 whitespace-pre-wrap">
              {streamingContent}
              <span className="inline-block w-1 h-4 bg-gray-400 animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 p-4">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend() }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your mentor…"
            disabled={streaming}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-700 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="bg-green-700 text-white rounded-full p-2.5 hover:bg-green-800 disabled:opacity-40 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
