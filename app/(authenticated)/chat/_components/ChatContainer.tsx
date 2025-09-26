import { useWebSocket } from '@/app/(authenticated)/_contexts/WebSocketContext'
import { ChatStore } from '@/store/chatStore'
import { ChatMessage, ChatRoom, ReceiveNewChat } from '@/types/WSClient'
import useChatEvent from '../_hooks/useChatEvent'
import ChatRooms from './ChatRooms'
import ChatAlert from './ChatAlert'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import { useEffect, useMemo, useRef, useState } from 'react'
import ChatInput from './ChatInput'
import MyChat from './MyChat'
import UrChat from './UrChat'
import { useSocketChatRequestHandler } from '../../_hooks/useSocketChatRequestHandler'
import PushToTalk from './PushToTalk'

interface ChatRoomsProps {
  chatRooms?: ChatRoom[]
}

const ChatContainer = ({ chatRooms }: ChatRoomsProps) => {
  const { toastComponent } = useSocketChatRequestHandler()

  const { onEvent, sendMessage } = useWebSocket()
  const chatContainerRef = useRef(null)

  const { chatRoomId, setChatRoomId } = ChatStore()
  const { chatMsgs, getChatHistory, sendChatMsg, leaveRoom } = useChatEvent()
  const [inputValue, setInputValue] = useState<string>('')

  const [target, setTarget] = useState<string | null>('')
  const [type, setType] = useState<string>('chat')
  const [newRoom, setNewRoom] = useState<ReceiveNewChat | null>(null)

  const getTarget = () => {
    if (typeof window !== 'undefined') {
      setTarget(localStorage.getItem('target'))
    }
  }

  useEffect(() => {
    getTarget()
  }, [])

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

  // scroll
  // useEffect(() => {
  //   if (!chatRoomId) return
  //   if (!chatMsgs?.length) return
  //   if (chatContainerRef.current) return
  //   const el = chatContainerRef
  //   requestAnimationFrame(() => {
  //     chatContainerRef.scrollTop = el.scrollHeight
  //   })
  // }, [chatMsgs, chatRoomId])

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

    const scribe = onEvent('receiveNewChat', (msg: ReceiveNewChat) => {
      setNewRoom(msg)
      return msg
    })

    scribe()

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
    <div className="h-full w-full flex flex-col ">
      <div className="flex-none flex justify-between items-center h-13 rounded-t-4xl pt-1 px-6 bg-hh-secondary text-hh-color4 font-bold">
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
        className={`relative flex flex-col flex-1 min-h-0 items-center pb-2 bg-hh-color9 overflow-y-auto overflow-x-hidden flex-1 min-h-0 `}
        ref={chatContainerRef}
      >
        {!chatRoomId && newRoom ? (
          <ChatAlert newRoom={newRoom} setNewRoom={setNewRoom} />
        ) : (
          ''
        )}
        {!chatRoomId ? (
          chatRooms?.map((chatRoom: ChatRoom) => {
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
                <ChatRooms
                  key={chatRoom.id}
                  chatRoom={chatRoom}
                  setType={setType}
                />
              </div>
            )
          })
        ) : type === 'chat' ? (
          chatMsgs?.map((chatMsg: ChatMessage) => {
            return chatMsg.sender === getUserId() ? (
              <MyChat key={chatMsg.id} chat={chatMsg} />
            ) : (
              <UrChat
                key={chatMsg.id}
                chat={chatMsg}
                target={target}
                userId={getUserId()}
                chatroomId={chatRoomId}
              />
            )
          })
        ) : (
          <PushToTalk
            type={type}
            target={target}
            userId={getUserId()}
            chatroomId={chatRoomId}
          />
        )}
      </div>

      {chatRoomId ? (
        <div className="flex-none">
          <ChatInput
            userId={getUserId()}
            chatroomId={chatRoomId}
            inputValue={inputValue}
            setInputValue={setInputValue}
            sendMsg={sendMsg}
            type={type}
            setType={setType}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default ChatContainer
