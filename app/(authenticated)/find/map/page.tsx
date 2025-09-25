'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLocation } from '../../_contexts/LocationContext'
import { useSocketChatRequestHandler } from '../../_hooks/useSocketChatRequestHandler'
import UniversalToast from '../_components/UniversalToast'
import AIMatchButton from './_components/AIMatchButton'
import { useGlobalChatRequestModal } from './_components/ChatRequestModal'
import LocationLoadingSnackbar from './_components/LocationLoadingSnackbar'
import LocationPermissionModal from './_components/LocationPermissionModal'
import { useAIMatch } from './_hooks/useAIMatch'
import { useKakaoMap } from './_hooks/useKaKaoMap'
import { useLocationMarker } from './_hooks/useLocationMarker'
import { useNearbyUsers } from './_hooks/useNearbyUsers'
import { useNearbyUsersMarkers } from './_hooks/useNearbyUsersMarkers'
import { usePermissionModal } from './_hooks/usePermissionModal'

/**
 * MapPage 컴포넌트
 *
 * 카카오맵을 사용하여 사용자의 현재 위치를 표시하는 지도 페이지
 *
 * 주요 기능:
 * - 카카오맵 렌더링 및 초기화
 * - 사용자 현재 위치 추적 및 마커 표시
 * - 최초 위치 감지 시 지도 중심 이동 및 줌 레벨 조정
 * - 위치 권한 거부 시 권한 요청 모달 표시
 * - 마커 업데이트 및 메모리 관리
 */
const MapPage = () => {
  const router = useRouter()
  const map = useKakaoMap() // 카카오맵 인스턴스
  const { locationResult, requestPermission, isTracking } = useLocation() // 위치 컨텍스트

  // 현재 위치에서 위도/경도 추출
  const currentLatitude = locationResult?.data?.latitude
  const currentLongitude = locationResult?.data?.longitude

  // 위치 로딩 상태 판단
  const isLocationLoading =
    isTracking &&
    (!locationResult?.data || locationResult?.code === '') &&
    locationResult?.code !== 'permission-denied' &&
    locationResult?.code !== 'not-supported'

  // 근처 사용자 조회 훅
  const { data: nearbyUsersData } = useNearbyUsers({
    latitude: currentLatitude,
    longitude: currentLongitude,
    enabled: !!currentLatitude && !!currentLongitude, // 위치 정보가 있을 때만 활성화
  })

  // 위치 마커 관리 훅
  useLocationMarker(map, locationResult)

  // 근처 사용자 마커 관리 훅
  useNearbyUsersMarkers({
    map,
    nearbyUsers: nearbyUsersData || [],
  })

  // 권한 모달 관리 훅
  const {
    showPermissionModal,
    handlePermissionSettings,
    handlePermissionCancel,
  } = usePermissionModal({
    locationResult,
    requestPermission,
  })

  // 소켓 채팅 요청 알림 핸들러
  const { toastComponent } = useSocketChatRequestHandler()

  // 글로벌 채팅 요청 모달
  const { ChatRequestModalComponent } = useGlobalChatRequestModal()

  // AI 매칭 상태
  const [showAIMatchToast, setShowAIMatchToast] = useState(true)
  const [aiMatchResult, setAIMatchResult] = useState<any>(null)

  // AI 매칭 훅
  const { requestAIMatch, isLoading: isAIMatchLoading } = useAIMatch({
    onSuccess: (result) => {
      console.log('🎯 AI 매칭 성공:', result)
      setAIMatchResult({
        type: 'ai-match',
        ...result,
      })
      setShowAIMatchToast(true)
    },
    onError: (error) => {
      console.error('❌ AI 매칭 실패:', error)
      // TODO: 에러 토스트 표시
    },
    onEmpty: (message) => {
      console.log('ℹ️ AI 매칭 - 사용자 없음:', message)
      // 알림 토스트로 메시지 표시
      setAIMatchResult({
        type: 'notification',
        title: 'AI 매칭 결과',
        message,
      })
      setShowAIMatchToast(true)
    },
  })

  const handleAIMatch = async () => {
    await requestAIMatch()
  }

  const handleAIMatchToastClose = () => {
    setShowAIMatchToast(false)
    setAIMatchResult(null)
  }

  const handleStartChat = () => {
    if (aiMatchResult?.userId) {
      console.log('채팅 시작')
      // 대화요청 로직 추가 @gohoney, @iamlily
      // router.push(`/chat?userId=${aiMatchResult.userId}`)
    }
    handleAIMatchToastClose()
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <Box className="flex flex-col h-dvh w-full">
      {/* 위치 로딩 스낵바 */}
      <LocationLoadingSnackbar isVisible={isLocationLoading} />

      {/* 헤더 */}
      <Box className="flex items-center px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
        <IconButton
          onClick={handleBack}
          className="mr-3 p-2"
          aria-label="뒤로가기"
        >
          <ArrowBackIcon className="text-gray-700" />
        </IconButton>
        {/* <T variant="h6" className="font-semibold text-gray-800">
          지도에서 사용자 찾기
        </T> */}
      </Box>

      {/* 지도 영역 */}
      <Box className="flex-1 relative">
        <Box id="map" className="w-full h-full"></Box>

        {/* AI 매칭 버튼 */}
        <AIMatchButton
          onMatch={handleAIMatch}
          isLoading={isAIMatchLoading}
          disabled={!currentLatitude || !currentLongitude}
        />
      </Box>

      {/* 위치 권한 모달 */}
      <LocationPermissionModal
        open={showPermissionModal}
        onRequestPermission={handlePermissionSettings}
        onCancel={handlePermissionCancel}
      />

      {/* 채팅 요청 토스트 알림 */}
      {toastComponent}

      {/* AI 매칭 결과 토스트 */}
      {aiMatchResult && aiMatchResult.type === 'ai-match' && (
        <UniversalToast
          type="ai-match"
          isVisible={showAIMatchToast}
          nickname={aiMatchResult.nickname}
          score={aiMatchResult.score}
          reasons={aiMatchResult.reasons}
          onClose={handleAIMatchToastClose}
          onStartChat={handleStartChat}
          autoClose={false}
        />
      )}

      {/* AI 매칭 알림 토스트 */}
      {aiMatchResult && aiMatchResult.type === 'notification' && (
        <UniversalToast
          type="notification"
          isVisible={showAIMatchToast}
          title={aiMatchResult.title}
          message={aiMatchResult.message}
          onClose={handleAIMatchToastClose}
          autoClose={true}
          autoCloseDelay={3000}
        />
      )}

      {/* 채팅 요청 확인 모달 */}
      {ChatRequestModalComponent}
    </Box>
  )
}

export default MapPage
