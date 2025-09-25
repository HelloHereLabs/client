'use client'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import { useEffect } from 'react'

export type ToastType = 'chat-request' | 'ai-match' | 'notification'

interface BaseToastProps {
  isVisible: boolean
  type: ToastType
  onClose: () => void
  onClick?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
}

interface ChatRequestToastProps extends BaseToastProps {
  type: 'chat-request'
  senderName: string
  onAccept?: () => void
  onReject?: () => void
}

interface AIMatchToastProps extends BaseToastProps {
  type: 'ai-match'
  userName: string
  matchScore: number
  reasons?: string[]
  onViewProfile?: () => void
  onStartChat?: () => void
}

interface NotificationToastProps extends BaseToastProps {
  type: 'notification'
  title: string
  message: string
  icon?: React.ReactNode
}

type UniversalToastProps =
  | ChatRequestToastProps
  | AIMatchToastProps
  | NotificationToastProps

/**
 * UniversalToast 컴포넌트
 *
 * 다양한 타입의 토스트 알림을 표시하는 범용 컴포넌트
 *
 * 지원 타입:
 * - chat-request: 채팅 요청 알림
 * - ai-match: AI 매칭 결과 알림
 * - notification: 일반 알림
 */
const UniversalToast = (props: UniversalToastProps) => {
  const {
    isVisible,
    type,
    onClose,
    onClick,
    autoClose = true,
    autoCloseDelay = 5000,
  } = props

  // 자동 닫기 기능
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, autoClose, autoCloseDelay])

  if (!isVisible) return null

  const renderContent = () => {
    switch (type) {
      case 'chat-request': {
        const { senderName, onAccept, onReject } =
          props as ChatRequestToastProps
        return (
          <div className="flex items-start justify-between flex-1">
            <div className="flex justify-center items-center gap-3 w-full">
              <Image
                src="/icons/male-icon.svg"
                alt="채팅"
                width={16}
                height={16}
                className="w-5 h-5"
              />
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="text-center font-medium text-gray-900 text-sm break-words whitespace-pre-wrap">
                  근처의 {senderName} 님이 대화를 요청했어요.
                  <br />
                  수락하시겠습니까?
                </div>
                <div className="flex w-[80%] items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAccept?.()
                    }}
                    className="text-hh-color4 bg-hh-primary px-5 rounded"
                  >
                    확인
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onReject?.()
                    }}
                    className="text-hh-color4 bg-hh-secondary px-5 rounded"
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      case 'ai-match': {
        const { userName, matchScore, reasons, onStartChat } =
          props as AIMatchToastProps
        return (
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-full">
                <AutoAwesomeIcon className="text-purple-600 text-sm" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  🎯 AI 매칭 결과
                </div>
                <div className="text-gray-700 text-sm mb-2">
                  <strong>{userName}</strong>님과 <br />
                  {matchScore * 100}% 매칭되었습니다!
                </div>
                {reasons && reasons.length > 0 && (
                  <div className="text-xs text-gray-600 mb-3">
                    매칭 이유: {reasons.slice(0, 2).join(', ')}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onStartChat?.()
                    }}
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 flex-1"
                  >
                    확인
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose()
                    }}
                    className="text-xs px-3 py-1 bg-pink-100 text-pink-700 rounded-full hover:bg-pink-200 flex-1"
                  >
                    거절
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      case 'notification': {
        const { title, message, icon } = props as NotificationToastProps
        return (
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                {icon || <ChatIcon className="text-blue-600 text-sm" />}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm">{title}</div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {message}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="닫기"
            >
              <CloseIcon fontSize="small" />
            </button>
          </div>
        )
      }

      default:
        return null
    }
  }

  const getToastStyles = () => {
    switch (type) {
      case 'chat-request':
        return 'bg-white/90 border-hh-primary border-2 w-[80%]'
      case 'ai-match':
        return 'bg-white border border-gray-200 min-w-[320px] max-w-[400px]'
      case 'notification':
        return 'bg-white border border-gray-200 min-w-[300px] max-w-[400px]'
      default:
        return 'bg-white border border-gray-200'
    }
  }

  const getPositionStyles = () => {
    switch (type) {
      case 'chat-request':
        return 'top-8 left-1/2 transform -translate-x-1/2'
      default:
        return 'top-20 left-1/2 transform -translate-x-1/2'
    }
  }

  return (
    <div className={`fixed ${getPositionStyles()} z-50 animate-slide-down`}>
      <div
        className={`
          ${getToastStyles()}
          rounded-lg shadow-lg p-4
          cursor-pointer transition-all hover:shadow-xl
        `}
        onClick={onClick}
      >
        {renderContent()}
      </div>
    </div>
  )
}

export default UniversalToast
