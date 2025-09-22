import { ChatRoom, ChatMessage } from '@/types/WSClient'
import ChatAlert from './ChatAlert'
import ChatRooms from './ChatRooms'
import PushToTalk from './PushToTalk'
import { ChatStore } from '@/store/chatStore'
import useChatEvent from '../_hooks/useChatEvent'

import { useEffect, useMemo, useRef, useState } from 'react'
import MyChat from './MyChat'
import UrChat from './UrChat'
import ChatInput from './ChatInput'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { socket } from '@/lib/socket'
import Button from '@mui/material/Button'

interface ChatRoomsProps {
  chatRooms?: ChatRoom[]
}

const ChatContainer = ({ chatRooms }: ChatRoomsProps) => {
  const { wsToken, setWsToken, userId } = ChatStore()
  const myId = '1e03b943-a484-4c5d-89dc-f4ffa86a2f58'

  const { chatRoomId, setChatRoomId } = ChatStore()
  const {
    chatMsgs,
    createChatRoom,
    getChatHistory,
    sendChatMsg,
    leaveRoom,
    openChatRoom,
  } = useChatEvent()
  const [inputValue, setInputValue] = useState<string>('')

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
    if (!chatRoomId) return

    getChatHistory(chatRoomId, myId)

    socket.onEvent('newMsg', (msg) => {
      const { chatroomId } = msg.data
      if (chatroomId !== chatRoomId) return
      getChatHistory(chatRoomId, myId)
    })
  }, [chatRoomId, getChatHistory])

  // 메세지 보내기
  const sendMsg = () => {
    if (!chatRoomId || !inputValue.trim()) return
    sendChatMsg(myId, chatRoomId, inputValue.trim())
    setInputValue('')
  }

  // 채팅방 나가기
  const leaveTheRoom = async (chatRoomId: string, userId: string) => {
    const ok = await leaveRoom(chatRoomId, myId)
    if (!ok) {
      alert('방 나가기를 다시 시도해주세요')
    }
    socket.send({
      action: 'getChatRooms',
      data: { userId: wsToken },
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
              leaveTheRoom(chatRoomId, myId)
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
          myId={myId}
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
