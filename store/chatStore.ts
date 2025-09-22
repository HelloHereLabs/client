import { create } from 'zustand'

interface ChatState {
  wsToken: string | null
  setWsToken: (v: string) => void
  userId: string | null
  setUserId: (v: string) => void
  chatRoomId: string | null
  setChatRoomId: (v: string) => void
}

// const testWs =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZTAzYjk0My1hNDg0LTRjNWQtODlkYy1mNGZmYTg2YTJmNTgiLCJ0eXBlIjoid2Vic29ja2V0IiwiaWF0IjoxNzU4Mjg5MTc2LCJleHAiOjE3NTg1NDgzNzZ9.wAmABIhpBit9RvPMP0ppXWcikiMLDLxoaSlPZ2Q5doE'

export const ChatStore = create<ChatState>((set) => ({
  // wsToken: testWs,
  wsToken: null,
  setWsToken: (v) =>
    set(() => ({
      wsToken: v,
    })),
  userId: null,
  setUserId: (v) =>
    set(() => ({
      userId: v,
    })),
  chatRoomId: null,
  setChatRoomId: (v) =>
    set(() => ({
      chatRoomId: v,
    })),
}))
