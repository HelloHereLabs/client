// contexts/WebSocketContext.tsx
'use client'

import axiosInstance from '@/lib/axiosInstance'
import { socketMessageHandler } from '@/lib/socketMessageHandler'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import T from '@mui/material/Typography'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useLocationUpdater } from '../_hooks/useLocationUpdater'
import { useLocation } from './LocationContext'

// WebSocket 컨텍스트 타입 정의
interface WebSocketContextType {
  socket: WebSocket | null
  isConnected: boolean
  sendMessage: (message: any) => boolean
  onEvent: (event: string, callback: (data: any) => void) => () => void
  sendAndWait: (
    payload: any,
    match: (msg: any) => boolean,
    timeout?: number,
  ) => Promise<any>
}

const WebSocketContext = createContext<WebSocketContextType | null>(null)

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // 이벤트 구독자들을 저장할 ref
  const subscribersRef = useRef<Record<string, ((msg: any) => void)[]>>({})

  // 위치 추적용 (Location Context에서 가져옴)
  const { locationResult } = useLocation()

  const WS_TOKEN_URL = '/api/auth/websocket-token'
  const WS_BASE_URL =
    'wss://eqgyhfgc4i.execute-api.us-west-1.amazonaws.com/dev/'

  // 메시지 전송 함수
  const sendMessage = useCallback((message: any): boolean => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        const messageString =
          typeof message === 'string' ? message : JSON.stringify(message)
        socketRef.current.send(messageString)
        console.log('📤 WebSocket message sent:', message)
        return true
      } catch (error) {
        console.error('❌ Failed to send message:', error)
        return false
      }
    } else {
      console.error('❌ WebSocket is not connected')
      return false
    }
  }, [])

  // 이벤트 구독 함수
  const onEvent = useCallback(
    (event: string, callback: (data: any) => void): (() => void) => {
      if (!subscribersRef.current[event]) {
        subscribersRef.current[event] = []
      }
      subscribersRef.current[event].push(callback)

      // 구독 해제 함수 반환
      return () => {
        subscribersRef.current[event] = subscribersRef.current[event]?.filter(
          (cb) => cb !== callback,
        )
      }
    },
    [],
  )

  // 메시지 전송 후 응답 대기 함수
  const sendAndWait = useCallback(
    (
      payload: any,
      match: (msg: any) => boolean,
      timeout: number = 8000,
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (
          !socketRef.current ||
          socketRef.current.readyState !== WebSocket.OPEN
        ) {
          return reject(new Error('WebSocket is not connected'))
        }

        const timer = window.setTimeout(() => {
          cleanup()
          reject(new Error('sendAndWait timeout'))
        }, timeout)

        const onMessage = (event: MessageEvent) => {
          let msg: any = event.data
          if (typeof event.data === 'string') {
            try {
              msg = JSON.parse(event.data)
            } catch {}
          }

          if (match(msg)) {
            cleanup()
            resolve(msg)
          }
        }

        const cleanup = () => {
          clearTimeout(timer)
          socketRef.current?.removeEventListener('message', onMessage)
        }

        socketRef.current.addEventListener('message', onMessage)

        // 메시지 전송
        sendMessage(payload)
      })
    },
    [sendMessage],
  )

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

      // 2. 토큰과 함께 웹소켓 연결
      const wsUrl = `${WS_BASE_URL}?token=${encodeURIComponent(response.data.token)}`
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
      setIsConnected(true)
      setIsLocationTracking(true)
      console.log('🌍 Location tracking started via WebSocket connection')
    }

    socket.onmessage = (event) => {
      let data: any = event.data
      try {
        data = JSON.parse(event.data)
      } catch {
        // JSON 파싱 실패 시 원본 데이터 사용
      }

      // 기존 socketMessageHandler 호출
      socketMessageHandler(data)

      // 이벤트 구독자들에게 메시지 전달
      if (data?.action && subscribersRef.current[data.action]) {
        subscribersRef.current[data.action].forEach((callback) => {
          callback(data)
        })
      }
    }

    socket.onclose = () => {
      console.log('❌ WebSocket disconnected')
      setIsConnected(false)
      if (!hasError) {
        setIsLoading(false)
        setHasError(true)
      }
    }

    socket.onerror = () => {
      console.log('🔥 WebSocket error')
      setIsConnected(false)
      setIsLoading(false)
      setHasError(true)
    }
  }

  // 위치 정보 업데이트 커스텀 훅 사용
  useLocationUpdater({
    socketRef,
    isLocationTracking,
    locationResult,
  })

  useEffect(() => {
    connectWithToken()

    return () => {
      socketRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // WebSocket 컨텍스트 값 생성
  const contextValue: WebSocketContextType = {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    onEvent,
    sendAndWait,
  }

  return (
    <WebSocketContext.Provider value={contextValue}>
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
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider')
  }
  return context
}
