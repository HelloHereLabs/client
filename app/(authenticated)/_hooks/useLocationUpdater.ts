/**
 * useLocationUpdater Hook
 *
 * WebSocket을 통해 30초마다 위치 정보를 서버로 전송하는 커스텀 훅
 *
 * 주요 기능:
 * - 위치 추적이 활성화되고 WebSocket이 연결된 상태에서만 동작
 * - 유효한 위치 정보가 있을 때만 서버로 전송
 * - 즉시 한 번 전송 후 30초 간격으로 반복 전송
 * - 컴포넌트 언마운트 시 자동으로 interval 정리
 *
 * @param socketRef - WebSocket 연결 참조
 * @param isLocationTracking - 위치 추적 활성화 여부
 * @param locationResult - LocationContext에서 제공하는 위치 정보
 */

import { useEffect, MutableRefObject } from 'react'

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

interface UseLocationUpdaterParams {
  socketRef: MutableRefObject<WebSocket | null>
  isLocationTracking: boolean
  locationResult: LocationResult
}

export const useLocationUpdater = ({
  socketRef,
  isLocationTracking,
  locationResult,
}: UseLocationUpdaterParams) => {
  useEffect(() => {
    if (!isLocationTracking || !socketRef.current) return

    const sendLocationUpdate = () => {
      if (
        socketRef.current?.readyState === WebSocket.OPEN &&
        locationResult.code === 'OK' &&
        locationResult.data
      ) {
        const message = {
          action: 'updateLocation',
          data: {
            latitude: locationResult.data.latitude,
            longitude: locationResult.data.longitude,
            updatedAt: new Date().toISOString(),
          },
        }

        socketRef.current.send(JSON.stringify(message))
        console.log('📍 Location update sent via WebSocket:', message.data)
      }
    }

    // 즉시 한 번 전송
    sendLocationUpdate()

    // 30초마다 반복 전송
    const intervalId = setInterval(sendLocationUpdate, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isLocationTracking, locationResult, socketRef])
}
