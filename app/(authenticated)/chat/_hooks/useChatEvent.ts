import { useWebSocket } from '@/app/(authenticated)/_contexts/WebSocketContext'
import { ChatMessage } from '@/types/WSClient'
import { useCallback, useState } from 'react'

const useChatEvent = () => {
  const { sendMessage, sendAndWait } = useWebSocket()
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[] | null>(null)

  const openChatRoom = useCallback(
    (chatroomId: string, userId: string) => {
      sendMessage({
        action: 'openChatRoom',
        data: {
          chatroomId: `${chatroomId}`,
          userId: `${userId}`,
        },
      })
    },
    [sendMessage],
  )

  const createChatRoom = async () => {
    try {
      const res = await sendAndWait(
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
        const res = await sendAndWait(
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
    [sendAndWait, openChatRoom],
  )

  const sendChatMsg = (
    sender: string,
    chatRoomId: string,
    inputValue: string,
  ) => {
    if (inputValue === '') return
    sendMessage({
      action: 'sendChatMsg',
      data: {
        sender: `${sender}`,
        chatroomId: `${chatRoomId}`,
        message: `${inputValue}`,
      },
    })
  }

  const leaveRoom = async (chatRoomId: string, userId: string) => {
    const res = await sendAndWait(
      {
        action: 'leaveChatRoom',
        data: { chatroomId: `${chatRoomId}`, userId: `${userId}` },
      },
      (msg: any) =>
        msg?.action === 'leaveRoomResponse' && msg?.data?.success === true,
      8000,
    )
    return res.data.success
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
