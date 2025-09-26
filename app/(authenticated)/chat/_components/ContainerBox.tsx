'use client'

import { useWebSocket } from '@/app/(authenticated)/_contexts/WebSocketContext'
import { ChatRoom, ReceiveNewChat } from '@/types/WSClient'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import ChatContainer from './ChatContainer'
import NoChat from './NoChat'

const ContainerBox = () => {
  const { sendMessage, onEvent, isConnected } = useWebSocket()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRooms, setPendingRooms] = useState<ReceiveNewChat[]>([])

  // localStorage에서 userId 가져오기
  const getUserId = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user-id')
    }
    return null
  }

  // 채팅방 목록 요청 및 수신
  useEffect(() => {
    if (!isConnected) return

    const userId = getUserId()
    if (!userId) return

    sendMessage({ action: 'getChatRooms', data: { userId } })

    const pushPending = (e: ReceiveNewChat) =>
      setPendingRooms((prev) => {
        const id = e.chatroomId
        if (!id) return prev
        if (prev.some((r) => r.chatroomId === id)) return prev
        return [...prev, { ...e, chatroomId: id }]
      })

    const offReceive = onEvent('receiveNewChat', pushPending)
    const offRequest = onEvent('requestNewChat', pushPending)

    const offCreated = onEvent('roomCreated', (e: ReceiveNewChat) => {
      const id = e.chatroomId
      const sender = e.sender
      const receiver = e.receiver
      const mine = [sender, receiver].includes(userId)
      if (!id || !mine) return

      // pending에서 제거
      setPendingRooms((prev) => prev.filter((r) => r.chatroomId !== id))

      // 목록 갱신
      sendMessage({ action: 'getChatRooms', data: { userId } })
    })

    const offList = onEvent('chatRoomsList', (msg: any) => {
      if (Array.isArray(msg.data?.rooms)) {
        const filtered = (msg.data.rooms as ChatRoom[]).filter(
          (r) => r.status === 'accepted',
        )
        setChatRooms(filtered)
        setLoading(false)
      }
    })

    setLoading(false)

    return () => {
      offReceive?.()
      offRequest?.()
      offCreated?.()
      offList?.()
    }
  }, [isConnected, onEvent, sendMessage])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // WebSocket이 연결되어 있다면 채팅방 목록 재요청
    if (isConnected) {
      const userId = getUserId()
      if (userId) {
        sendMessage({
          action: 'getChatRooms',
          data: { userId },
        })
      }
    }
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Container className="h-full w-full p-0 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleRetry} variant="contained">
            다시 시도
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container className="h-full w-full p-0 pb-15 flex justify-center">
      {loading ? (
        <Button fullWidth loading loadingPosition="start" />
      ) : chatRooms.length > 0 ? (
        <ChatContainer
          chatRooms={chatRooms}
          pendingRooms={pendingRooms}
          setPendingRooms={setPendingRooms}
        />
      ) : (
        <NoChat />
      )}
    </Container>
  )
}

export default ContainerBox
