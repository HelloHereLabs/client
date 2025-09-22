'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { socket } from '@/lib/socket'
import axiosInstance from '@/lib/axiosInstance'
import type { ChatRoom } from '@/types/WSClient'
import { useStore } from 'zustand'
import { ChatStore } from '@/store/chatStore'
import axios from 'axios'
import { BASE_URL } from './config'

type UseChatWSOpts = {
  wsTokenUrl?: string
  actionList?: string
}

export const useChatWS = (opts: UseChatWSOpts = {}) => {
  const { wsToken, setWsToken, setUserId } = ChatStore()

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isConnectingRef = useRef(false)
  const isConnectedRef = useRef(false)

  // 1. Token 발급 + WS 토큰 발급
  const getTokens = useCallback(async () => {
    try {
      setLoading(true)
      const token = await axiosInstance.post(
        '/api/auth/start',
        {},
        { withCredentials: true },
      )
      setUserId(token.data.user.userId)

      const res = await axios.get(`${BASE_URL}auth/websocket-token`, {
        withCredentials: true,
      })

      if (!res) throw new Error('웹소켓 토큰 요청 실패')

      const wsToken = res.data.wsToken
      if (!wsToken) throw new Error('토큰 응답 없음')
      // setWsToken(token)
      setError(null)
    } catch (e: any) {
      setError(e?.message ?? ' 실패')
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. 연결
  useEffect(() => {
    if (!wsToken) return
    if (isConnectedRef.current || isConnectingRef.current) return

    isConnectingRef.current = true

    socket.connect(
      {
        open: () => {
          isConnectedRef.current = true
          isConnectingRef.current = false

          // 3. 채팅 목록 수신
          socket.send({
            action: 'getChatRooms',
            data: { userId: wsToken },
          })
        },
        message: (msg: { action: string; data: { rooms: ChatRoom[] } }) => {
          if (
            msg?.action === 'chatRoomsList' &&
            Array.isArray(msg.data.rooms)
          ) {
            setChatRooms(msg.data.rooms as ChatRoom[])
          } else if (Array.isArray(msg.data.rooms)) {
            setChatRooms(msg.data?.rooms as ChatRoom[])
          }
        },
        error: () => {
          setError('웹소켓 에러')
        },
        close: () => {
          isConnectedRef.current = false
        },
      },
      wsToken,
    )

    console.log(chatRooms)

    return () => {
      isConnectedRef.current = false
      isConnectingRef.current = false
      socket.close()
    }
  }, [wsToken])

  return {
    loading,
    error,
    chatRooms,
    getTokens,
  }
}
