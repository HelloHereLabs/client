'use client'

import LocationOnIcon from '@mui/icons-material/LocationOn'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'

interface LocationLoadingSnackbarProps {
  isVisible: boolean
  message?: string
}

/**
 * LocationLoadingSnackbar 컴포넌트
 *
 * 위치 정보를 확인하는 동안 화면 상단에 표시되는 스낵바 컴포넌트
 *
 * 주요 기능:
 * - 위치 확인 중 상태를 사용자에게 알림
 * - 부드러운 애니메이션으로 표시/숨김
 * - 위치 아이콘과 로딩 스피너 제공
 * - 반응형 디자인
 * - 헤더 아래에 위치
 */
const LocationLoadingSnackbar = ({
  isVisible,
  message = '위치 정보를 확인하고 있습니다...',
}: LocationLoadingSnackbarProps) => {
  return (
    <div className="fixed top-18 left-0 right-0 z-50 px-4">
      <Collapse in={isVisible}>
        <div className="bg-hh-color6 text-white rounded-lg p-3 shadow-lg flex items-center gap-2">
          <div className="flex items-center gap-1">
            <LocationOnIcon fontSize="small" className="text-white" />
            <CircularProgress
              size={16}
              thickness={4}
              className="text-white"
              sx={{ color: 'inherit' }}
            />
          </div>
          <span className="text-sm font-medium">{message}</span>
        </div>
      </Collapse>
    </div>
  )
}

export default LocationLoadingSnackbar
