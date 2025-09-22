import { useWebSocket } from '@/app/(authenticated)/_contexts/WebSocketContext'
import { ChatStore } from '@/store/chatStore'
import { ChatMessage, ChatRoom } from '@/types/WSClient'
import useChatEvent from '../_hooks/useChatEvent'
import ChatRooms from './ChatRooms'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import { useEffect, useMemo, useState } from 'react'
import ChatInput from './ChatInput'
import MyChat from './MyChat'
import UrChat from './UrChat'

interface ChatRoomsProps {
  chatRooms?: ChatRoom[]
}

const ChatContainer = ({ chatRooms }: ChatRoomsProps) => {
  const { onEvent, sendMessage } = useWebSocket()

  const { chatRoomId, setChatRoomId } = ChatStore()
  const { chatMsgs, getChatHistory, sendChatMsg, leaveRoom } = useChatEvent()
  const [inputValue, setInputValue] = useState<string>('')

  // localStorage에서 userId 가져오기
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user-id')
    }
    return null
  }

  const currentRoom = useMemo(
    () => chatRooms?.find((r) => r.id === chatRoomId),
    [chatRooms, chatRoomId],
  )

  const theSender = useMemo(
    () => currentRoom?.participants?.receiver ?? null,
    [currentRoom],
  )

  // 채팅 히스토리
  useEffect(() => {
    const userId = getUserId()
    if (!chatRoomId || !userId) return

    getChatHistory(chatRoomId, userId)

    const unsubscribe = onEvent('newMsg', (msg: any) => {
      const { chatroomId } = msg.data
      if (chatroomId !== chatRoomId) return
      getChatHistory(chatRoomId, userId)
    })

    return unsubscribe
  }, [chatRoomId, getChatHistory, onEvent])

  // 메세지 보내기
  const sendMsg = () => {
    const userId = getUserId()
    if (!chatRoomId || !inputValue.trim() || !userId) return
    sendChatMsg(userId, chatRoomId, inputValue.trim())
    setInputValue('')
  }

  // 채팅방 나가기
  const leaveTheRoom = async (chatRoomId: string, userId: string) => {
    const ok = await leaveRoom(chatRoomId, userId)
    if (!ok) {
      alert('방 나가기를 다시 시도해주세요')
    }
    sendMessage({
      action: 'getChatRooms',
      data: { userId },
    })

    setChatRoomId('')
  }

  return (
    <div className="h-full w-full ">
      <div className="flex justify-between items-center h-13 rounded-t-4xl pt-1 px-6 bg-hh-secondary text-hh-color4 font-bold ">
        {theSender ? (
          <ArrowBackIcon onClick={() => setChatRoomId('')} className="mr-1" />
        ) : (
          ''
        )}
        {theSender ? theSender : 'Chats'}
        {chatRoomId ? (
          <Button
            className="text-hh-color4"
            onClick={() => {
              const userId = getUserId()
              if (!userId) return
              leaveTheRoom(chatRoomId, userId)
            }}
          >
            나가기
          </Button>
        ) : (
          ''
        )}
      </div>
      <div
        className={`relative flex flex-wrap flex-col items-center pb-15 bg-hh-color9 overflow-y-auto overflow-x-hidden ${chatRoomId ? '' : 'h-full'} flex-1 min-h-0 `}
      >
        {!chatRoomId
          ? chatRooms?.map((chatRoom: ChatRoom) => {
              const handleChatRoomClick = () => {
                if (chatRoom.id !== chatRoomId) {
                  setChatRoomId(chatRoom.id)
                }
              }
              return (
                <div
                  className="flex justify-center w-full"
                  key={chatRoom.id}
                  onClick={handleChatRoomClick}
                >
                  <ChatRooms key={chatRoom.id} chatRoom={chatRoom} />
                </div>
              )
            })
          : chatMsgs?.map((chatMsg: ChatMessage) => {
              return chatMsg.userId !== theSender ? (
                <MyChat
                  key={chatMsg.id}
                  chat={chatMsg}
                  // isRead={chat.isRead}
                />
              ) : (
                <UrChat
                  key={chatMsg.id}
                  chat={chatMsg}
                  // isRead={chat.isRead}
                />
              )
            })}
      </div>

      {chatRoomId ? (
        <ChatInput
          userId={getUserId()}
          chatroomId={chatRoomId}
          inputValue={inputValue}
          setInputValue={setInputValue}
          sendMsg={sendMsg}
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default ChatContainer
