'use client'

import { useWebSocket } from '@/app/(authenticated)/_contexts/WebSocketContext'
import { ChatRoom } from '@/types/WSClient'
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
    if (!userId) {
      setError('사용자 ID를 찾을 수 없습니다.')
      setLoading(false)
      return
    }

    // 채팅방 목록 요청
    sendMessage({
      action: 'getChatRooms',
      data: { userId },
    })

    // 채팅방 목록 수신 이벤트 구독
    const unsubscribe = onEvent('chatRoomsList', (msg: any) => {
      if (Array.isArray(msg.data?.rooms)) {
        const filteredRooms = (msg.data.rooms as ChatRoom[]).filter(
          (room) => room.status === 'accepted',
        )
        setChatRooms(filteredRooms as ChatRoom[])
        setLoading(false)
      }
    })

    return unsubscribe
  }, [isConnected, sendMessage, onEvent])

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
        <ChatContainer chatRooms={chatRooms} />
      ) : (
        <NoChat />
      )}
    </Container>
  )
}

export default ContainerBox
