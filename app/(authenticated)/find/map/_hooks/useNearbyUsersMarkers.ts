import { useCallback, useEffect, useRef } from 'react'
import {
  cleanupGlobalChatHandler,
  generateUserInfoContent,
  setupGlobalChatHandler,
} from '../_utils/infoWindowUtils'
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
  // 현재 열린 인포윈도우를 저장하는 ref
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null)

  // 채팅하기 버튼 클릭 핸들러
  // 대화 요청 + 채팅방 이동 연동 필요 @iamlily
  const handleChatClick = useCallback((userId: string) => {
    console.log(`Starting chat with user ${userId}`)
    // TODO: 채팅 요청 기능 구현
  }, [])

  // 전역 채팅 핸들러 설정
  useEffect(() => {
    setupGlobalChatHandler(handleChatClick)
    return () => {
      cleanupGlobalChatHandler()
    }
  }, [handleChatClick])

  // 인포윈도우를 닫는 함수
  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close()
      infoWindowRef.current = null
      console.log('📌 [useNearbyUsersMarkers] InfoWindow closed')
    }
  }

  // 지도 클릭 시 인포윈도우 닫기
  useEffect(() => {
    if (!map) return

    const mapClickListener = () => {
      closeInfoWindow()
    }

    kakao.maps.event.addListener(map, 'click', mapClickListener)

    return () => {
      kakao.maps.event.removeListener(map, 'click', mapClickListener)
    }
  }, [map])

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

        // 마커 클릭 이벤트 - 인포윈도우 표시
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

          // 기존 인포윈도우가 있다면 닫기
          closeInfoWindow()

          // 인포윈도우 내용 생성 (유틸리티 함수 사용)
          const infoContent = generateUserInfoContent({ user })

          // 새 인포윈도우 생성 및 표시
          const infoWindow = new kakao.maps.InfoWindow({
            content: infoContent,
          })

          infoWindow.open(map, marker)
          infoWindowRef.current = infoWindow

          console.log(
            '📌 [useNearbyUsersMarkers] InfoWindow opened for user:',
            user.nickname,
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

  // 컴포넌트 언마운트 시 모든 마커 및 인포윈도우 정리
  useEffect(() => {
    const currentMarkers = markersRef.current
    const currentInfoWindow = infoWindowRef.current
    return () => {
      console.log(
        '🧹 [useNearbyUsersMarkers] Cleaning up all markers and infowindow',
      )
      currentMarkers.forEach((marker) => {
        marker.setMap(null)
      })
      currentMarkers.clear()

      if (currentInfoWindow) {
        currentInfoWindow.close()
      }
    }
  }, [])
}
