import { ChatRoom, ChatMessage } from '@/types/WSClient'
import ChatAlert from './ChatAlert'
import ChatRooms from './ChatRooms'
import PushToTalk from './PushToTalk'
import { chattingStore } from '@/store/chatStore'

import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import MyChat from './MyChat'
import UrChat from './UrChat'
import ChatInput from './ChatInput'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface ChatRoomsProps {
  chatRooms?: ChatRoom[]
}

const ChatContainer = ({ chatRooms }: ChatRoomsProps) => {
  const { chatRoomId, setChatRoomId } = chattingStore()
  const [chatMsgs, setChatMsgs] = useState<ChatMessage[] | null>(null)
  console.log(chatRoomId)

  const currentRoom = useMemo(
    () => chatRooms?.find((r) => r.id === chatRoomId),
    [chatRooms, chatRoomId],
  )

  const theSender = useMemo(
    () => currentRoom?.participants?.sender ?? null,
    [currentRoom],
  )

  const getChatMsgs = async (chatRoomId: string) => {
    const res = await axios.get(`api/chat/${chatRoomId}`)
    setChatMsgs(res.data)
  }

  useEffect(() => {
    if (!chatRoomId) return

    getChatMsgs(chatRoomId)
  }, [chatRoomId])

  return (
    <div className="h-screen w-full">
      <div className="h-13 rounded-t-4xl pt-4 px-6 bg-hh-secondary text-hh-color4 font-bold flex items-base">
        {theSender ? (
          <ArrowBackIcon onClick={() => setChatRoomId('')} className="mr-1" />
        ) : (
          ''
        )}
        {theSender ? theSender : 'Chats'}
      </div>
      <div className="flex flex-wrap flex-col items-center h-full bg-hh-color9">
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
        {chatRoomId ? <ChatInput /> : ''}
      </div>
    </div>
  )
}

export default ChatContainer
