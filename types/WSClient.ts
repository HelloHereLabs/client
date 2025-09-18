export interface WSOptions {
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  timeout?: number
  query?: Record<string, string>
  protocols?: string | string[]
}

export interface WSHandlers {
  open?: () => void
  message?: (data: any, ev: MessageEvent) => void
  error?: (event: Event) => void
  close?: () => void
}

export interface ChatRoom {
  id: string
  participants: { sender: string; reciever: string }
  lastMessage?: string
  updateAt: number
  lastActivity: number
}

export interface ChatMessage {
  id: string
  userId: string
  roomId?: string
  message: string
  type: 'text' | 'voice'
  language: string
  targetLanguage?: string
  isSafe: boolean
  filteredMessage?: string
  timestamp: number
}
