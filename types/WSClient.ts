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
  participants: { sender: string; receiver: string }
  lastMessage?: string
  updateAt: number
  lastActivity: number
}

export interface ChatMessage {
  id: string
  chatroomId: string
  sender: string
  senderNickname: string
  message: string
  timestamp: number
  read?: boolean
  type?: 'text' | 'image' | 'system'
  attachments?: string[]
}

export interface ChatEvent<T = any> {
  action: string
  data?: T
}
