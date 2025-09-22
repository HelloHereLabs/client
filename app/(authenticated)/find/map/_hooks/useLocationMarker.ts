/**
 * useLocationMarker 훅
 *
 * 사용자의 현재 위치를 추적하고 카카오맵에 마커를 표시하는 커스텀 훅
 *
 * 주요 기능:
 * - 위치 정보 변경 감지 및 콘솔 로그 출력
 * - 최초 위치 감지 시 지도 중심 이동 및 줌 레벨 설정 (100m 축적)
 * - 현재 위치 마커 생성 및 업데이트
 * - 기존 마커 제거 및 메모리 관리
 * - 컴포넌트 언마운트 시 마커 정리
 *
 * @param {kakao.maps.Map | null} map - 카카오맵 인스턴스
 * @param {LocationResult} locationResult - 위치 정보 결과 객체
 * @returns {object} 위치 마커 관련 상태 및 함수들
 */

import { useEffect, useRef } from 'react'

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

interface UseLocationMarkerReturn {
  isFirstLocation: boolean
  hasLocationMarker: boolean
}

export const useLocationMarker = (
  map: kakao.maps.Map | null,
  locationResult: LocationResult,
): UseLocationMarkerReturn => {
  // 현재 위치 마커 참조 (업데이트 및 정리용)
  const myLocationMarkerRef = useRef<kakao.maps.Marker | null>(null)
  // 최초 위치 감지 여부 (지도 중심 이동은 한 번만)
  const isFirstLocationRef = useRef(true)

  // 위치 정보 변경 감지 및 마커 업데이트
  useEffect(() => {
    if (!map) return

    console.log('Location result:', locationResult)

    if (locationResult.code === 'OK' && locationResult.data) {
      console.log(
        `User location: Latitude ${locationResult.data.latitude}, Longitude ${locationResult.data.longitude}`,
      )

      const userPosition = new window.kakao.maps.LatLng(
        locationResult.data.latitude,
        locationResult.data.longitude,
      )

      // 최초 위치 등록 시에만 지도 중심 이동 및 줌 레벨 변경
      if (isFirstLocationRef.current) {
        console.log(
          '🎯 First location detected - centering map and setting zoom level',
        )
        map.setCenter(userPosition)
        map.setLevel(3) // 100m 축적 레벨 (카카오맵에서 레벨 3이 약 100m)
        isFirstLocationRef.current = false
      }

      // 기존 마커가 있으면 제거
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null)
      }

      // 현위치 마커 생성 및 업데이트
      const myLocationMarker = new window.kakao.maps.Marker({
        position: userPosition,
        image: new window.kakao.maps.MarkerImage(
          '/icons/my-location-icon.svg',
          new window.kakao.maps.Size(24, 28),
          {
            offset: new window.kakao.maps.Point(12, 28),
          },
        ),
      })

      myLocationMarker.setMap(map)
      myLocationMarkerRef.current = myLocationMarker

      console.log('📍 Location marker updated')
    } else if (locationResult.code === 'not-supported') {
      console.log('Geolocation is not supported by this browser.')
    } else if (locationResult.code === 'error') {
      console.log('An error occurred while retrieving location.')
    }
  }, [map, locationResult])

  // 컴포넌트 언마운트 시 마커 정리
  useEffect(() => {
    return () => {
      if (myLocationMarkerRef.current) {
        myLocationMarkerRef.current.setMap(null)
        myLocationMarkerRef.current = null
      }
    }
  }, [])

  return {
    isFirstLocation: isFirstLocationRef.current,
    hasLocationMarker: myLocationMarkerRef.current !== null,
  }
}
