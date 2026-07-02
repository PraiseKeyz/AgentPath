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
  const streamRef = useRef('')

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
    streamRef.current = ''

    streamMessage(
      id,
      content,
      (chunk) => {
        streamRef.current += chunk
        setStreamingContent((prev) => prev + chunk)
      },
      () => {
        setStreaming(false)
        setMessages((prev) => [
          ...prev,
          {
            _id: (Date.now() + 1).toString(),
            conversationId: id,
            role: 'assistant',
            content: streamRef.current,
            createdAt: new Date().toISOString(),
          },
        ])
        setStreamingContent('')
        streamRef.current = ''
      },
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
        {loading && (
          <div className="flex items-center gap-2 text-[#B4B4B0] text-sm justify-center py-8">
            <div className="w-4 h-4 border-2 border-[#E9E9E7] border-t-[#0075DE] rounded-full animate-spin" />
            Loading…
          </div>
        )}

        {!loading && messages.length === 0 && !streaming && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F3FE] flex items-center justify-center text-[#0075DE]">
              <Send size={20} />
            </div>
            <p className="text-[#787774] text-sm">Say hello to get started.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0075DE] text-white rounded-br-md'
                  : 'bg-[#F6F5F4] text-[#37352F] rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {streaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-[#F6F5F4] text-[#37352F] whitespace-pre-wrap leading-relaxed">
              {streamingContent}
              <span className="inline-block w-0.5 h-4 bg-[#0075DE] animate-pulse ml-0.5 align-middle rounded-full" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[#E9E9E7] p-4 bg-white">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend() }}
          className="flex items-center gap-2 max-w-3xl mx-auto"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message your mentor…"
            disabled={streaming}
            className="flex-1 border border-[#E9E9E7] rounded-full px-5 py-2.5 text-sm bg-white text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none focus:ring-2 focus:ring-[#0075DE] focus:border-[#0075DE] disabled:opacity-50 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className="bg-[#0075DE] text-white rounded-full p-2.5 hover:bg-[#097FE8] disabled:opacity-40 transition-all duration-200 cursor-pointer"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  )
}
