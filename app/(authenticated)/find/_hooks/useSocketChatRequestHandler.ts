'use client'

import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useWebSocket } from '../../_contexts/WebSocketContext'
import ChatRequestToast from '../_components/ChatRequestToast'

interface ChatMessage {
  action: string
  chatId?: string
  senderId?: string
  senderName?: string
  receiverId?: string
  message?: string
  timestamp?: string
  [key: string]: any
}

interface ToastData {
  senderName: string
  senderId?: string
  chatId?: string
}

/**
 * useSocketChatRequestHandler Hook
 *
 * find 페이지와 map 페이지에서 공유하는 소켓 이벤트 핸들러 훅
 *
 * 주요 기능:
 * - receiveNewChat 액션 메시지 처리
 * - 토스트 알림 자동 표시
 * - 소켓 연결 상태 관리
 * - 메모리 누수 방지를 위한 자동 정리
 */
export const useSocketChatRequestHandler = () => {
  const { socket, isConnected } = useWebSocket()
  const router = useRouter()
  const [toastData, setToastData] = useState<ToastData | null>(null)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const handleReceiveNewChat = useCallback(async (data: any) => {
    try {
      console.log('Raw socket data received:', data)

      let message: ChatMessage
      if (typeof data === 'string') {
        message = JSON.parse(data)
      } else {
        message = data
      }

      console.log('Parsed message:', message)

      if (message.action === 'receiveNewChat') {
        console.log('New chat message received:', message)

        // senderId로 사용자 정보 조회
        const senderId = message.senderId
        const response = await axiosInstance.get(`api/users/${senderId}`)
        const senderNickname = response.data.nickname || '사용자'
        // 토스트 데이터 설정
        const newToastData: ToastData = {
          senderName: senderNickname,
          senderId: message.senderId,
          chatId: message.chatRoomId,
        }

        setToastData(newToastData)
        setIsToastVisible(true)
      }
    } catch (error) {
      console.error('Error parsing socket message:', error, data)
    }
  }, [])

  // 소켓 메시지 이벤트 핸들러
  const handleSocketMessage = useCallback(
    (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as ChatMessage
        console.log(
          '📨 [useSocketChatRequestHandler] Socket message received:',
          data,
        )

        // action이 receiveNewChat인 경우 처리
        if (data.action === 'receiveNewChat') {
          handleReceiveNewChat(data)
        }
      } catch (error) {
        console.error(
          '❌ [useSocketChatRequestHandler] Error parsing socket message:',
          error,
        )
      }
    },
    [handleReceiveNewChat],
  )

  // 토스트 닫기 핸들러
  const handleCloseToast = useCallback(() => {
    setIsToastVisible(false)
  }, [])

  // 대화 수락 핸들러 (채팅방으로 이동) @iamlily
  const handleToastClick = useCallback(() => {
    if (toastData?.senderId) {
      //   router.push(`/chat?userId=${toastData.senderId}`)
      setIsToastVisible(false)
    }
  }, [toastData?.senderId, router])

  // 소켓 이벤트 리스너 등록/해제
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log(
        '⚠️ [useSocketChatRequestHandler] Socket not available or not connected',
      )
      return
    }

    console.log(
      '🔌 [useSocketChatRequestHandler] Attaching socket message handler',
    )

    // 메시지 이벤트 리스너 등록
    socket.addEventListener('message', handleSocketMessage)

    // 정리 함수
    return () => {
      console.log(
        '🧹 [useSocketChatRequestHandler] Cleaning up socket message handler',
      )
      socket.removeEventListener('message', handleSocketMessage)
    }
  }, [socket, isConnected, handleSocketMessage])

  // 토스트 컴포넌트 렌더링 함수
  const renderToast = useCallback(() => {
    if (!isToastVisible || !toastData) return null

    return React.createElement(ChatRequestToast, {
      isVisible: true,
      senderName: toastData.senderName,
      onClose: handleCloseToast,
      onClick: handleToastClick,
    })
  }, [isToastVisible, toastData, handleCloseToast, handleToastClick])

  return {
    isConnected,
    socket,
    toastComponent: renderToast(),
    isToastVisible,
  }
}
