/**
 * usePermissionModal 훅
 *
 * 위치 권한 모달의 상태와 핸들러를 관리하는 커스텀 훅
 *
 * 주요 기능:
 * - 위치 권한 거부 감지 시 모달 자동 표시
 * - 권한 재요청 핸들러 제공
 * - 모달 취소 시 이전 페이지로 돌아가기
 * - 모달 상태 관리
 *
 * @param {LocationResult} locationResult - 위치 정보 결과 객체
 * @param {() => void} requestPermission - 권한 재요청 함수
 * @param {() => void} onCancel - 취소 시 실행할 함수 (선택적)
 * @returns {object} 모달 상태 및 핸들러 함수들
 */

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface LocationData {
  latitude: number
  longitude: number
  timestamp: number
}

interface LocationResult {
  code: string
  data: LocationData | null
  error?: string
}

interface UsePermissionModalProps {
  locationResult: LocationResult
  requestPermission: () => void
  onCancel?: () => void
}

interface UsePermissionModalReturn {
  showPermissionModal: boolean
  handlePermissionSettings: () => void
  handlePermissionCancel: () => void
}

export const usePermissionModal = ({
  locationResult,
  requestPermission,
  onCancel,
}: UsePermissionModalProps): UsePermissionModalReturn => {
  const router = useRouter()
  const [showPermissionModal, setShowPermissionModal] = useState(false)

  // 위치 권한 거부 감지 시 모달 표시
  useEffect(() => {
    if (locationResult.code === 'denied') {
      console.log('Location access denied by user.')
      setShowPermissionModal(true)
    }
  }, [locationResult.code])

  /**
   * 위치 권한 재요청 핸들러
   * 모달을 닫고 LocationContext의 requestPermission을 호출하여 권한 재요청
   */
  const handlePermissionSettings = () => {
    setShowPermissionModal(false)
    requestPermission()
  }

  /**
   * 위치 권한 취소 핸들러
   * 모달을 닫고 onCancel 함수 실행 또는 이전 페이지로 돌아가기
   */
  const handlePermissionCancel = () => {
    setShowPermissionModal(false)
    if (onCancel) {
      onCancel()
    } else {
      router.back() // 기본적으로 이전 페이지로 돌아가기
    }
  }

  return {
    showPermissionModal,
    handlePermissionSettings,
    handlePermissionCancel,
  }
}
