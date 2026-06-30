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
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) return

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const text = decoder.decode(value)
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))

      for (const line of lines) {
        try {
          const json = JSON.parse(line.slice(6))
          if (json.chunk) onChunk(json.chunk)
          if (json.done) onDone()
        } catch {
          // partial chunk
        }
      }
    }
  })
}
