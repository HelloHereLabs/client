import { useEffect, useRef } from 'react'
import { NearbyUser } from './useNearbyUsers'

interface UseNearbyUsersMarkersParams {
  map: kakao.maps.Map | null
  nearbyUsers: NearbyUser[]
}

/**
 * useNearbyUsersMarkers Hook
 *
 * 근처 사용자들을 지도에 마커로 표시하고 동적으로 관리하는 훅
 *
 * 주요 기능:
 * - 근처 사용자 배열 변경 시 마커 추가/제거/업데이트
 * - 각 사용자의 위치 변경 추적 및 마커 위치 동기화
 * - 사용자가 배열에서 사라질 경우 마커 자동 삭제
 * - 메모리 누수 방지를 위한 정리 작업
 *
 * @param map - 카카오맵 인스턴스
 * @param nearbyUsers - 근처 사용자 배열
 */
export const useNearbyUsersMarkers = ({
  map,
  nearbyUsers,
}: UseNearbyUsersMarkersParams) => {
  // 현재 활성화된 마커들을 저장하는 ref
  const markersRef = useRef<Map<string, kakao.maps.Marker>>(new Map())

  useEffect(() => {
    if (!map || !nearbyUsers) return

    console.log('🔄 [useNearbyUsersMarkers] Managing nearby user markers:', {
      mapExists: !!map,
      userCount: nearbyUsers.length,
      currentMarkerCount: markersRef.current.size,
      timestamp: new Date().toISOString(),
    })

    // 현재 사용자 ID들 추출
    const currentUserIds = new Set(nearbyUsers.map((user) => user.userId))

    // 1. 더 이상 존재하지 않는 사용자의 마커 제거
    markersRef.current.forEach((marker, userId) => {
      if (!currentUserIds.has(userId)) {
        console.log(
          `➖ [useNearbyUsersMarkers] Removing marker for user: ${userId}`,
        )
        marker.setMap(null)
        markersRef.current.delete(userId)
      }
    })

    // 2. 각 근처 사용자에 대해 마커 추가/업데이트 (현재 사용자 제외)
    const currentUserId = localStorage.getItem('user-id')

    nearbyUsers.forEach((user) => {
      // 현재 사용자의 마커는 추가하지 않음
      if (user.userId === currentUserId) {
        console.log(
          `🚫 [useNearbyUsersMarkers] Skipping marker for current user: ${user.nickname}`,
          { userId: user.userId },
        )
        return
      }

      const existingMarker = markersRef.current.get(user.userId)
      const position = new kakao.maps.LatLng(
        user.location.latitude,
        user.location.longitude,
      )

      if (existingMarker) {
        // 기존 마커가 있으면 위치만 업데이트
        const currentPosition = existingMarker.getPosition()
        if (
          currentPosition.getLat() !== user.location.latitude ||
          currentPosition.getLng() !== user.location.longitude
        ) {
          console.log(
            `📍 [useNearbyUsersMarkers] Updating marker position for user: ${user.nickname}`,
            {
              userId: user.userId,
              from: {
                lat: currentPosition.getLat(),
                lng: currentPosition.getLng(),
              },
              to: {
                lat: user.location.latitude,
                lng: user.location.longitude,
              },
            },
          )
          existingMarker.setPosition(position)
        }
      } else {
        // 새 마커 생성
        console.log(
          `➕ [useNearbyUsersMarkers] Adding new marker for user: ${user.nickname}`,
          {
            userId: user.userId,
            position: {
              lat: user.location.latitude,
              lng: user.location.longitude,
            },
            distance: user.distance ? Math.round(user.distance) : 'N/A',
          },
        )

        // 근처 사용자 아이콘 이미지 설정
        const imageSize = new kakao.maps.Size(24, 28)
        const imageOption = { offset: new kakao.maps.Point(12, 28) }
        const markerImage = new kakao.maps.MarkerImage(
          '/icons/nearby-user-icon.svg',
          imageSize,
          imageOption,
        )

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position,
          image: markerImage,
          map,
        })

        // 마커 클릭 이벤트 (선택적)
        kakao.maps.event.addListener(marker, 'click', () => {
          console.log(
            `👤 [useNearbyUsersMarkers] Marker clicked for user: ${user.nickname}`,
            {
              userId: user.userId,
              nickname: user.nickname,
              language: user.language,
              interests: user.interests,
              distance: user.distance ? Math.round(user.distance) : 'N/A',
            },
          )
        })

        // 마커 저장
        markersRef.current.set(user.userId, marker)
      }
    })

    console.log(`🗺️ [useNearbyUsersMarkers] Marker management completed:`, {
      totalMarkers: markersRef.current.size,
      userIds: Array.from(markersRef.current.keys()),
    })
  }, [map, nearbyUsers])

  // 컴포넌트 언마운트 시 모든 마커 정리
  useEffect(() => {
    const currentMarkers = markersRef.current
    return () => {
      console.log('🧹 [useNearbyUsersMarkers] Cleaning up all markers')
      currentMarkers.forEach((marker) => {
        marker.setMap(null)
      })
      currentMarkers.clear()
    }
  }, [])
}
