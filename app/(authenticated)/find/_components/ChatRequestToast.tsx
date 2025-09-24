'use client'

import Image from 'next/image'

interface ChatRequestToastProps {
  isVisible: boolean
  senderName?: string
  onClose: () => void
  onClick?: () => void
}

/**
 * ChatRequestToast 컴포넌트
 *
 * 새로운 채팅 메시지 수신 시 표시되는 토스트 알림
 *
 * 주요 기능:
 * - 새 채팅 메시지 알림 표시
 * - 자동 닫기 (5초)
 * - 클릭 시 채팅 페이지로 이동
 * - 수동 닫기 버튼
 */
const ChatRequestToast = ({
  isVisible,
  senderName = '새 사용자',
  onClose,
  onClick,
}: ChatRequestToastProps) => {
  if (!isVisible) return null

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down w-[80%]">
      <div
        className={`
          bg-white/90 border border-hh-primary border-2 rounded-lg shadow-lg p-4 w-full
          cursor-pointer transition-all
        `}
        onClick={onClick}
      >
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
                    onClose()
                  }}
                  className="text-hh-color4 bg-hh-primary px-5 rounded"
                >
                  확인
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                  }}
                  className="text-hh-color4 bg-hh-secondary px-5 rounded"
                >
                  거절
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRequestToast
