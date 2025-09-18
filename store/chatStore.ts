import { create } from 'zustand'

interface ChatState {
  chatRoomId: string | null
  setChatRoomId: (v: string) => void
}

export const chattingStore = create<ChatState>((set) => ({
  chatRoomId: null,
  setChatRoomId: (v) =>
    set(() => ({
      chatRoomId: v,
    })),
}))
