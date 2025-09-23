/**
 * useNearbyUsers Hook
 *
 * 근처 사용자 목록을 조회하는 React Query 훅
 *
 * 주요 기능:
 * - 30초마다 자동으로 근처 사용자 목록 조회
 * - axiosInstance를 사용한 API 요청
 * - React Query를 통한 캐싱 및 상태 관리
 * - 위치 정보가 있을 때만 요청 실행
 *
 * @param latitude - 현재 위치의 위도
 * @param longitude - 현재 위치의 경도
 * @param enabled - 쿼리 활성화 여부 (기본값: true)
 */

import axiosInstance from '@/lib/axiosInstance'
import { useQuery } from '@tanstack/react-query'

interface Location {
  latitude: number
  longitude: number
}

interface NearbyUser {
  activeConnectionId: string
  connectedAt: string
  createdAt: number
  interests: string[]
  isActive: boolean
  language: string
  lastLocationUpdate: string
  location: Location
  nickname: string
  purpose: string
  updatedAt: number
  userId: string
  distance?: number // 클라이언트에서 계산된 거리 (미터 단위)
}

interface UseNearbyUsersParams {
  latitude?: number
  longitude?: number
  enabled?: boolean
}

const fetchNearbyUsers = async (
  latitude: number,
  longitude: number,
): Promise<NearbyUser[]> => {
  const response = await axiosInstance.get(
    `/api/users/nearby/${latitude}/${longitude}?radius=1`,
  )
  return response.data
}

export const useNearbyUsers = ({
  latitude,
  longitude,
  enabled = true,
}: UseNearbyUsersParams) => {
  const hasValidLocation = latitude !== undefined && longitude !== undefined

  return useQuery({
    queryKey: ['nearbyUsers', latitude, longitude],
    queryFn: () => {
      if (!hasValidLocation) {
        throw new Error('Location is required')
      }
      return fetchNearbyUsers(latitude, longitude)
    },
    enabled: enabled && hasValidLocation,
    refetchInterval: 30 * 1000, // 30초마다 자동 재조회
    staleTime: 25 * 1000, // 25초 동안 캐시된 데이터를 fresh로 간주
    gcTime: 60000, // 1분 후 가비지 컬렉션
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    select: (data) => {
      console.log('🔄 [useNearbyUsers] Selecting and processing data:', {
        originalUserCount: data.length,
        timestamp: new Date().toISOString(),
      })

      // 거리 계산을 위한 헬퍼 함수 (Haversine formula)
      const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number,
      ) => {
        const R = 6371e3 // Earth's radius in meters
        const φ1 = (lat1 * Math.PI) / 180
        const φ2 = (lat2 * Math.PI) / 180
        const Δφ = ((lat2 - lat1) * Math.PI) / 180
        const Δλ = ((lon2 - lon1) * Math.PI) / 180

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c
      }

      // 사용자에게 거리 추가 및 정렬
      const usersWithDistance = data
        .map((user) => ({
          ...user,
          distance: calculateDistance(
            latitude!,
            longitude!,
            user.location.latitude,
            user.location.longitude,
          ),
        }))
        .sort((a, b) => a.distance! - b.distance!) // 거리순 정렬

      return usersWithDistance
    },
  })
}

// 개별 사용자 타입과 응답 타입을 export
export type { NearbyUser }
