'use client'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CircularProgress from '@mui/material/CircularProgress'
import Fab from '@mui/material/Fab'
import { useState } from 'react'

interface AIMatchButtonProps {
  onMatch: () => Promise<void>
  isLoading?: boolean
  disabled?: boolean
}

/**
 * AIMatchButton 컴포넌트
 *
 * AI 매칭 기능을 실행하는 원형 플로팅 액션 버튼
 *
 * 주요 기능:
 * - 우측 하단 fixed 위치에 배치
 * - 터치 시 AI 매칭 API 호출
 * - 로딩 중 circular progress 표시
 * - 비활성화 상태 지원
 */
const AIMatchButton = ({
  onMatch,
  isLoading = false,
  disabled = false,
}: AIMatchButtonProps) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = async () => {
    if (disabled || isLoading) return

    try {
      setIsPressed(true)
      await onMatch()
    } catch (error) {
      console.error('AI 매칭 중 오류가 발생했습니다:', error)
    } finally {
      setIsPressed(false)
    }
  }

  return (
    <Fab
      color="primary"
      aria-label="AI 매칭"
      onClick={handleClick}
      disabled={disabled}
      className={`
        !fixed bottom-30 right-6 z-40
        !w-16 !h-16
        !bg-gradient-to-r !from-purple-500 !to-pink-500
        hover:!from-purple-600 hover:!to-pink-600
        disabled:!from-gray-400 disabled:!to-gray-500
        !shadow-lg hover:!shadow-xl
        !transition-all !duration-300
        ${isPressed ? '!scale-95' : '!scale-100'}
      `}
      size="large"
    >
      {isLoading ? (
        <CircularProgress size={24} className="!text-white" thickness={4} />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <AutoAwesomeIcon className="!text-white !text-lg mb-0.5" />
          <span className="!text-white !text-xs font-bold">AI</span>
        </div>
      )}
    </Fab>
  )
}

export default AIMatchButton
