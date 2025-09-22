'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

type LocationData = {
  latitude: number
  longitude: number
  timestamp: number
}

type LocationResult = {
  code: string
  data: LocationData | null
  error?: string
}

type LocationContextType = {
  locationResult: LocationResult
  subscribeToLocation: (callback: (data: LocationData) => void) => () => void
  isTracking: boolean
  requestPermission: () => void
}

const LocationContext = createContext<LocationContextType | null>(null)

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [locationResult, setLocationResult] = useState<LocationResult>({
    code: '',
    data: null,
  })
  const [isTracking, setIsTracking] = useState(false)
  const watchIdRef = useRef<number | null>(null)
  const subscribersRef = useRef<Set<(data: LocationData) => void>>(new Set())

  console.log('🏗️ LocationProvider: Component mounted/re-rendered')

  const startLocationTracking = useCallback(() => {
    // 이미 추적 중이거나 watchId가 있으면 중복 실행 방지
    if (watchIdRef.current !== null) {
      console.log('🔄 LocationContext: Already tracking, skipping')
      return
    }

    if (!navigator.geolocation) {
      console.log('❌ LocationContext: Geolocation not supported')
      setLocationResult({
        code: 'not-supported',
        data: null,
        error: 'Geolocation is not supported by this browser',
      })
      return
    }

    console.log('🌍 LocationContext: Starting global location tracking')
    setIsTracking(true)

    // 권한 상태 확인
    if ('permissions' in navigator) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          console.log(`🔒 LocationContext: Permission state: ${result.state}`)
        })
        .catch((err) => {
          console.log('⚠️ LocationContext: Permission API error:', err.message)
        })
    }

    // watchPosition으로 실시간 위치 추적
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const locationData: LocationData = {
          latitude,
          longitude,
          timestamp: Date.now(),
        }

        console.log('✅ LocationContext: Position updated', locationData)
        setLocationResult({
          code: 'OK',
          data: locationData,
        })

        // 모든 구독자에게 위치 데이터 전송
        subscribersRef.current.forEach((callback) => {
          callback(locationData)
        })
      },
      (error) => {
        console.error(
          '🚨 LocationContext: Global location error:',
          error.message,
        )

        let errorCode = 'error'
        if (error.code === error.PERMISSION_DENIED) {
          errorCode = 'denied'
          console.log('❌ LocationContext: Permission denied by user')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorCode = 'not-supported'
          console.log('❌ LocationContext: Position unavailable')
        } else if (error.code === error.TIMEOUT) {
          errorCode = 'timeout'
          console.log('❌ LocationContext: Timeout occurred')
        }

        setLocationResult({
          code: errorCode,
          data: null,
          error: error.message,
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      },
    )

    watchIdRef.current = watchId
  }, []) // 의존성 배열 비우기

  const requestPermission = useCallback(() => {
    console.log('🔄 LocationContext: Requesting permission again')
    // 기존 추적 중지
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    // 다시 시작
    startLocationTracking()
  }, [startLocationTracking])

  const subscribeToLocation = useCallback(
    (callback: (data: LocationData) => void) => {
      subscribersRef.current.add(callback)

      // 현재 위치가 있으면 즉시 전송
      if (locationResult.data) {
        callback(locationResult.data)
      }

      // cleanup 함수 반환
      return () => {
        subscribersRef.current.delete(callback)
      }
    },
    [locationResult.data],
  )

  useEffect(() => {
    console.log(
      '🚀 LocationProvider: useEffect triggered, calling startLocationTracking',
    )
    startLocationTracking()

    return () => {
      console.log('🧹 LocationProvider: Cleanup called')
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      setIsTracking(false)
      console.log('🛑 Global location tracking stopped')
    }
  }, [startLocationTracking])

  return (
    <LocationContext.Provider
      value={{
        locationResult,
        subscribeToLocation,
        isTracking,
        requestPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}
