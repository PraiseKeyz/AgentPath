'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getConversation, streamMessage, type Message } from '@/services/chat.service'
import { ArrowLeft, ArrowUp, Sparkles, Calendar, Compass, ClipboardList, BookOpen, ChevronDown } from 'lucide-react'

// Simple helper to escape HTML tags to prevent XSS in rendering
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Custom inline Markdown parser for Notion styling
function renderMarkdown(text: string) {
  if (!text) return ''
  
  // Escape HTML first for safety
  let html = escapeHtml(text)

  // 1. Code Blocks: ```code```
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-[#F6F5F4] border border-[#E9E9E7] p-3.5 rounded-lg text-xs font-mono my-3 overflow-x-auto text-[#37352F] leading-normal"><code>${code.trim()}</code></pre>`
  })

  // 2. Inline Code: `code`
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#F6F5F4] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#F64932] border border-[#E9E9E7]/60">$1</code>')

  // 3. Bold: **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong class="font-extrabold text-[#000000]">$1</strong>')

  // 4. Italic: *text*
  html = html.replace(/\*([\s\S]*?)\*/g, '<em class="italic text-gray-800">$1</em>')

  // 5. Links: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0075DE] font-semibold hover:text-[#005BAB] underline decoration-[#0075DE]/20 hover:decoration-[#005BAB]">$1</a>')

  // 6. Bullet lists: lines starting with "- " or "* "
  const lines = html.split('\n')
  let inList = false
  let processedLines: string[] = []

  for (let line of lines) {
    const bulletMatch = line.match(/^(\s*)[-*]\s+(.*)$/)
    if (bulletMatch) {
      if (!inList) {
        processedLines.push('<ul class="list-disc pl-5 my-2 flex flex-col gap-1 text-sm text-[#37352F]">')
        inList = true
      }
      processedLines.push(`<li class="leading-relaxed">${bulletMatch[2]}</li>`)
    } else {
      if (inList) {
        processedLines.push('</ul>')
        inList = false
      }
      processedLines.push(line)
    }
  }
  if (inList) {
    processedLines.push('</ul>')
  }
  html = processedLines.join('\n')

  // 7. Line breaks
  html = html.replace(/\n/g, '<br />')

  return html
}

const SUGGESTED_PROMPTS = [
  { text: 'Help me find scholarships', icon: Sparkles, color: 'text-[#0075DE] bg-[#E6F3FE]' },
  { text: 'What internships are available?', icon: Compass, color: 'text-[#AD6DED] bg-[#F3EDFF]' },
  { text: 'Plan my semester goals', icon: ClipboardList, color: 'text-[#FF8A33] bg-[#FFF5E0]' },
  { text: 'Review my application essay', icon: BookOpen, color: 'text-[#2A9D99] bg-[#E2F5F4]' },
]

export default function ChatPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [conversationTitle, setConversationTitle] = useState('Chat')

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef('')

  useEffect(() => {
    getConversation(id)
      .then(({ conversation, messages }) => {
        setMessages(messages)
        setConversationTitle(conversation?.title || 'Mentor Chat')
      })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  // Scroll listener to show/hide "scroll to bottom" button
  function handleScroll() {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    // Show button if user scrolled up more than 300px
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 300
    setShowScrollBtn(!isNearBottom)
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSend(textToSend?: string) {
    const content = (textToSend || input).trim()
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

    // If first message, auto-set tentative conversation title
    if (messages.length === 0) {
      setConversationTitle(content.substring(0, 40) + (content.length > 40 ? '...' : ''))
    }

    try {
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
    } catch {
      setStreaming(false)
      setStreamingContent('')
    }
  }

  // Format time (e.g. "10:34 AM")
  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Top Header Bar */}
      <header className="h-12 border-b border-[#E9E9E7] flex items-center px-4 justify-between bg-white shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/chat')}
            className="p-1 rounded-lg hover:bg-[#F6F5F4] text-[#787774] hover:text-[#37352F] transition-colors cursor-pointer"
            aria-label="Back to conversations"
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
          </button>
          <h1 className="font-bold text-sm text-[#37352F] truncate">
            {conversationTitle}
          </h1>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5"
      >
        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2.5">
            <div className="w-5 h-5 border-2 border-[#0075DE] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#787774] font-medium">Loading chat history...</p>
          </div>
        )}

        {/* Empty Conversation State */}
        {!loading && messages.length === 0 && !streaming && (
          <div className="flex-1 flex flex-col items-center justify-center py-10 max-w-md mx-auto animate-slide-up">
            <div className="size-12 rounded-full bg-[#E6F3FE] text-[#0075DE] flex items-center justify-center mb-4 shadow-[0_1px_3px_rgba(0,117,222,0.1)]">
              <Sparkles size={20} />
            </div>
            <h2 className="text-lg font-extrabold text-[#000000] tracking-tight mb-2 text-center">
              What's on your mind this semester?
            </h2>
            <p className="text-xs text-[#787774] text-center mb-8 font-medium leading-relaxed">
              Your AI mentor is ready to guide you. Select a prompt below or type your own question to start chatting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {SUGGESTED_PROMPTS.map((prompt) => {
                const IconComp = prompt.icon
                return (
                  <button
                    key={prompt.text}
                    onClick={() => handleSend(prompt.text)}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-[#F6F5F4]/60 border border-[#E9E9E7] hover:border-[#62AEF0] hover:shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl text-left text-xs font-semibold text-[#37352F] transition-all duration-150 cursor-pointer"
                  >
                    <span className={`p-2 rounded-lg ${prompt.color} shrink-0`}>
                      <IconComp size={14} />
                    </span>
                    <span className="leading-tight">{prompt.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.filter((msg) => msg.content && msg.content.trim() !== '').map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed border transition-all duration-150 ${
                msg.role === 'user'
                  ? 'bg-[#E6F3FE] text-[#37352F] border-[#D3E5EF] rounded-br-md shadow-[0_1px_2px_rgba(0,117,222,0.02)]'
                  : 'bg-white text-[#37352F] border-[#E9E9E7] rounded-bl-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              }`}
            >
              {msg.role === 'user' ? (
                // Keep plain text / whitespace pre-wrap for user messages
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                // Safely render parsed markdown for AI responses
                <div
                  className="prose prose-sm max-w-none text-[#37352F] break-words"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              )}
            </div>
            
            {/* Timestamp visible on bubble hover */}
            <span className="text-[10px] font-bold text-[#B4B4B0] mt-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {formatTime(msg.createdAt)}
            </span>
          </div>
        ))}

        {/* Streaming / Typing Indicator */}
        {streaming && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-white text-[#37352F] border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
              {streamingContent ? (
                <>
                  <div
                    className="prose prose-sm max-w-none text-[#37352F] break-words"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingContent) }}
                  />
                  {/* Streaming blinking cursor */}
                  <span className="inline-block w-1 h-3.5 bg-[#0075DE] animate-pulse ml-1 align-middle rounded-full" />
                </>
              ) : (
                /* Bouncing Dots Loading Indicator */
                <div className="flex items-center gap-1 py-1 px-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Floating Scroll to Bottom Indicator */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 z-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-[#E9E9E7] bg-white text-[#37352F] hover:bg-[#F6F5F4] rounded-full p-2 flex items-center justify-center transition-all duration-150 cursor-pointer animate-fade-in"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={18} className="text-[#787774]" />
        </button>
      )}

      {/* Bottom Message Input Bar */}
      <div className="border-t border-[#E9E9E7] p-4 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-end gap-2 max-w-3xl mx-auto border border-[#E9E9E7] rounded-xl px-4 py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] focus-within:ring-2 focus-within:ring-[#0075DE]/20 focus-within:border-[#0075DE] transition-all duration-150 bg-white"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask your mentor anything..."
            disabled={streaming}
            rows={1}
            style={{ height: 'auto', maxHeight: '120px' }}
            className="flex-1 text-sm bg-transparent text-[#000000] placeholder:text-[#B4B4B0] focus:outline-none resize-none min-h-[20px] max-h-[120px] py-0.5 leading-relaxed disabled:opacity-50"
            ref={(el) => {
              if (el) {
                // Auto resize textarea height
                el.style.height = 'auto'
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || streaming}
            className={`rounded-lg p-1.5 transition-all duration-150 shrink-0 ${
              input.trim() && !streaming
                ? 'bg-[#0075DE] text-white hover:bg-[#097FE8] cursor-pointer'
                : 'bg-[#F6F5F4] text-[#B4B4B0] cursor-not-allowed'
            }`}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </form>
        <p className="text-[10px] text-center text-[#B4B4B0] mt-2 font-medium">
          Press Enter to send. Shift + Enter for new line.
        </p>
      </div>
    </div>
  )
}
