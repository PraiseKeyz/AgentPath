'use client'

import { clientFetch, apiUrl } from '@/lib/api/client'

export interface Conversation {
  _id: string
  userId: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  _id: string
  conversationId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export async function getConversations(): Promise<Conversation[]> {
  const res = await clientFetch<{ data: { conversations: Conversation[] } }>('/chat/conversations')
  return res.data.conversations
}

export async function createConversation(): Promise<Conversation> {
  const res = await clientFetch<{ data: { conversation: Conversation } }>('/chat/conversations', {
    method: 'POST',
  })
  return res.data.conversation
}

export async function getConversation(id: string): Promise<{ conversation: Conversation; messages: Message[] }> {
  const res = await clientFetch<{ data: { conversation: Conversation; messages: Message[] } }>(
    `/chat/conversations/${id}`,
  )
  return res.data
}

export async function deleteConversation(id: string): Promise<void> {
  await clientFetch(`/chat/conversations/${id}`, { method: 'DELETE' })
}

export function streamMessage(
  conversationId: string,
  content: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
): void {
  const token = localStorage.getItem('token')

  fetch(apiUrl(`/chat/conversations/${conversationId}/messages`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
  }).then(async (response) => {
    let isDoneCalled = false
    const safeOnDone = () => {
      if (!isDoneCalled) {
        isDoneCalled = true
        onDone()
      }
    }

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Failed to communicate with mentor' }))
      onChunk(`⚠️ Error: ${err.message || 'Mentor service is currently unavailable.'}`)
      safeOnDone()
      return
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      safeOnDone()
      return
    }

    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      
      // Keep the last part in buffer because it might be incomplete
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('data: ')) {
          try {
            const json = JSON.parse(trimmed.slice(6))
            if (json.chunk) onChunk(json.chunk)
            if (json.done) safeOnDone()
          } catch {
            // Wait for more chunks if JSON line is incomplete
          }
        }
      }
    }
    safeOnDone()
  }).catch((err) => {
    console.error('Stream network error:', err)
    onChunk('⚠️ Network error: Could not reach the mentor server.')
    onDone()
  })
}
