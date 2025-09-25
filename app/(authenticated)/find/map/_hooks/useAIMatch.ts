'use client'

import axiosInstance from '@/lib/axiosInstance'
import { useCallback, useState } from 'react'

interface AIMatchResult {
  userId: string
  userName: string
  matchScore: number
  reasons: string[]
  profileImage?: string
}

interface AIMatchResponse {
  success: boolean
  data: AIMatchResult
  message: string
}

interface UseAIMatchOptions {
  onSuccess?: (result: AIMatchResult) => void
  onError?: (error: Error) => void
}

/**
 * useAIMatch Hook
 *
 * AI 매칭 기능을 제공하는 커스텀 훅
 *
 * 주요 기능:
 * - AI 매칭 API 호출
 * - 로딩 상태 관리
 * - 에러 처리
 * - 성공/실패 콜백 지원
 */
export const useAIMatch = ({ onSuccess, onError }: UseAIMatchOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<AIMatchResult | null>(null)

  const requestAIMatch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🤖 [useAIMatch] Requesting AI match...')

      // AI 매칭 API 호출
      // 요청 경로, 응답 인터페이스 할당 @gohoney
      const response = await axiosInstance.post<AIMatchResponse>(
        '/api/ai/match',
        {},
        { withCredentials: false },
      )

      console.log('✅ [useAIMatch] AI match response:', response.data)

      if (response.data.success && response.data.data) {
        setResult(response.data.data)
        onSuccess?.(response.data.data)
      } else {
        throw new Error(response.data.message || 'AI 매칭에 실패했습니다.')
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('알 수 없는 오류가 발생했습니다.')
      console.error('❌ [useAIMatch] AI match error:', error)

      setError(error)
      onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [onSuccess, onError])

  const reset = useCallback(() => {
    setError(null)
    setResult(null)
  }, [])

  return {
    requestAIMatch,
    isLoading,
    error,
    result,
    reset,
  }
}
