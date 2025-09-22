// contexts/WebSocketContext.tsx
'use client'

import axiosInstance from '@/lib/axiosInstance'
import { socketMessageHandler } from '@/lib/socketMessageHandler'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import T from '@mui/material/Typography'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useLocation } from './LocationContext'

const WebSocketContext = createContext<WebSocket | null>(null)

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isLocationTracking, setIsLocationTracking] = useState(false)

  // 위치 추적용 (Location Context에서 가져옴)
  const { locationResult } = useLocation()

  const WS_TOKEN_URL = '/api/auth/websocket-token'
  const WS_BASE_URL =
    'wss://eqgyhfgc4i.execute-api.us-west-1.amazonaws.com/dev/'

  const handleCloseError = async () => {
    setHasError(false)
    setIsLoading(true)
    // 재연결 시도
    await connectWithToken()
  }

  const connectWithToken = async () => {
    try {
      // 1. 웹소켓 토큰 요청
      const response = await axiosInstance.get(WS_TOKEN_URL)
      const wsToken = response.data.token

      // 2. 토큰과 함께 웹소켓 연결
      const wsUrl = `${WS_BASE_URL}?token=${encodeURIComponent(wsToken)}`
      socketRef.current = new WebSocket(wsUrl)
      setupSocketEvents(socketRef.current)
    } catch (error) {
      console.error('Failed to get WebSocket token:', error)
      setIsLoading(false)
      setHasError(true)
    }
  }

  const setupSocketEvents = (socket: WebSocket) => {
    socket.onopen = () => {
      console.log('✅ WebSocket connected')
      setIsLoading(false)
      setHasError(false)
      setIsLocationTracking(true)
      console.log('🌍 Location tracking started via WebSocket connection')
    }
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      socketMessageHandler(data)
    }
    socket.onclose = () => {
      console.log('❌ WebSocket disconnected')
      if (!hasError) {
        setIsLoading(false)
        setHasError(true)
      }
    }
    socket.onerror = () => {
      console.log('🔥 WebSocket error')
      setIsLoading(false)
      setHasError(true)
    }
  }

  // 30초마다 위치 정보를 WebSocket으로 전송
  useEffect(() => {
    if (!isLocationTracking || !socketRef.current) return

    const sendLocationUpdate = () => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN &&
        locationResult.code === 'OK' &&
        locationResult.data
      ) {
        const message = {
          action: 'updateLocation',
          data: {
            latitude: locationResult.data.latitude,
            longitude: locationResult.data.longitude,
            updatedAt: new Date().toISOString(),
          },
        }

        socketRef.current.send(JSON.stringify(message))
        console.log('📍 Location update sent via WebSocket:', message.data)
      }
    }

    // 즉시 한 번 전송
    sendLocationUpdate()

    // 30초마다 반복 전송
    const intervalId = setInterval(sendLocationUpdate, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isLocationTracking, locationResult])

  useEffect(() => {
    connectWithToken()

    return () => {
      socketRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <WebSocketContext.Provider value={socketRef.current}>
      {isLoading && (
        <Box
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <Box className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <CircularProgress size={40} className="text-hh-primary" />
            <T className="text-lg font-semibold text-gray-800">
              서버에 연결 중...
            </T>
            <T className="text-sm text-gray-600 text-center">
              잠시만 기다려주세요
            </T>
          </Box>
        </Box>
      )}
      {hasError && (
        <Box
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <Box className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl max-w-sm mx-4">
            <T className="text-lg font-semibold text-red-600">연결 오류</T>
            <T className="text-sm text-gray-600 text-center">
              서버에 연결할 수 없습니다.
              <br />
              네트워크 상태를 확인해주세요.
            </T>
            <Button
              variant="contained"
              onClick={handleCloseError}
              className="bg-hh-primary hover:bg-hh-primary/90 text-white px-6 py-2 rounded-lg font-medium"
            >
              다시 시도
            </Button>
          </Box>
        </Box>
      )}
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => {
  const socket = useContext(WebSocketContext)
  if (!socket) throw new Error('WebSocket is not available')
  return socket
}
