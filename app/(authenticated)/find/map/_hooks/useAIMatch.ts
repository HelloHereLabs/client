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
  recommendedUsers: AIMatchResult[]
  message?: string
}

interface UseAIMatchOptions {
  onSuccess?: (result: AIMatchResult) => void
  onError?: (error: Error) => void
  onEmpty?: (message: string) => void
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
export const useAIMatch = ({
  onSuccess,
  onError,
  onEmpty,
}: UseAIMatchOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<AIMatchResult | null>(null)

  const requestAIMatch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log('🤖 [useAIMatch] Requesting AI match...')
      const userId = localStorage.getItem('user-id')
      console.log(userId)
      // AI 매칭 API 호출
      // 요청 경로, 응답 인터페이스 할당 @gohoney
      const response = await axiosInstance.post<AIMatchResponse>(
        '/api/matching/recommendations',
        { userId },
        { withCredentials: false },
      )

      console.log('✅ [useAIMatch] AI match response:', response.data)

      // 추천 사용자가 있는 경우
      if (
        response.data.recommendedUsers &&
        response.data.recommendedUsers.length > 0
      ) {
        const firstMatch = response.data.recommendedUsers[0]
        setResult(firstMatch)
        onSuccess?.(firstMatch)
      }
      // 추천 사용자가 없는 경우 (빈 배열)
      else if (
        response.data.recommendedUsers &&
        response.data.recommendedUsers.length === 0
      ) {
        const message =
          response.data.message || '주변에 활성 사용자가 없습니다.'
        console.log('ℹ️ [useAIMatch] No users found:', message)
        onEmpty?.(message)
      }
      // 예상치 못한 응답 구조
      else {
        throw new Error('예상치 못한 응답 형식입니다.')
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
  }, [onSuccess, onError, onEmpty])

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
