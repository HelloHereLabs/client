'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'
import { useLocation } from '../../_contexts/LocationContext'
import LocationPermissionModal from './_components/LocationPermissionModal'
import { useKakaoMap } from './_hooks/useKaKaoMap'
import { useLocationMarker } from './_hooks/useLocationMarker'
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
  const { locationResult, requestPermission } = useLocation() // 위치 컨텍스트

  // 위치 마커 관리 훅
  useLocationMarker(map, locationResult)

  // 권한 모달 관리 훅
  const {
    showPermissionModal,
    handlePermissionSettings,
    handlePermissionCancel,
  } = usePermissionModal({
    locationResult,
    requestPermission,
  })

  const handleBack = () => {
    router.back()
  }

  return (
    <Box className="flex flex-col h-dvh w-full">
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
      <Box className="flex-1">
        <Box id="map" className="w-full h-full"></Box>
      </Box>

      {/* 위치 권한 모달 */}
      <LocationPermissionModal
        open={showPermissionModal}
        onRequestPermission={handlePermissionSettings}
        onCancel={handlePermissionCancel}
      />
    </Box>
  )
}

export default MapPage
