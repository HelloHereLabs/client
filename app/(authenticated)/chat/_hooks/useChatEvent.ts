import { socket } from '@/lib/socket'
import { ChatMessage } from '@/types/WSClient'
import { useCallback, useState } from 'react'

const useChatEvent = () => {
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[] | null>(null)

  const createChatRoom = async () => {
    try {
      const res = await socket.sendAndWait(
        {
          action: 'createRoom',
          data: { sender: ``, receiver: `` },
        },
        (msg) => msg?.action === 'createdRoom',
      )

      console.log('✅ 서버 응답:', res)
    } catch (e) {
      console.error('❌ 실패:', e)
    }
  }

  const getChatHistory = useCallback(
    async (chatRoomId: string, userId: string, before?: number) => {
      if (!chatRoomId) return

      try {
        const res = await socket.sendAndWait(
          {
            action: 'getChatHistory',
            data: {
              chatroomId: chatRoomId,
              limit: 50,
              ...(before ? { before } : {}),
            },
          },
          (msg) => msg?.action === 'chatHistory',
        )

        const msgs = res?.data?.messages ?? []
        setChatMsgs(msgs)

        openChatRoom(chatRoomId, userId)
      } catch (e) {
        console.error('❌ 실패:', e)
      }
    },
    [],
  )

  const sendChatMsg = (
    sender: string,
    chatRoomId: string,
    inputValue: string,
  ) => {
    if (inputValue === '') return
    socket.send({
      action: 'sendChatMsg',
      data: {
        sender: `${sender}`,
        chatroomId: `${chatRoomId}`,
        message: `${inputValue}`,
      },
    })
  }

  const leaveRoom = (chatRoomId: string, userId: string) => {
    socket.send({
      action: 'leaveRoom',
      data: { chatroomId: `${chatRoomId}`, userId: `${userId}` },
    })
  }

  const openChatRoom = (chatroomId: string, userId: string) => {
    socket.send({
      action: 'openChatRoom',
      data: {
        chatroomId: `${chatroomId}`,
        userId: `${userId}`,
      },
    })
  }

  return {
    chatMsgs,
    createChatRoom,
    getChatHistory,
    sendChatMsg,
    leaveRoom,
    openChatRoom,
  }
}

export default useChatEvent
