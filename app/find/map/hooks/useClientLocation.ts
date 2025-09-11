import { useEffect, useState } from 'react'

type LocationResult = {
  code: string
  data: { x: number; y: number } | null
}

const useClientLocation = (map: kakao.maps.Map | null) => {
  const [result, setResult] = useState<LocationResult>({
    code: '',
    data: null,
  })

  const processLocation = async () => {
    try {
      // 1. 브라우저 지원 확인
      if (!navigator.geolocation) {
        setResult({
          code: 'not-supported',
          data: null,
        })
        return
      }

      // 2. 좌표 조회 및 권한 요청
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const locPosition = new window.kakao.maps.LatLng(latitude, longitude)
          map?.setCenter(locPosition)
          setResult({
            code: 'OK',
            data: { x: latitude, y: longitude },
          })
        },
        (error) => {
          let msg = `Error getting location: ${error.message}`
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied by user.'
          }
          setResult({
            code: 'denied',
            data: null,
          })
        },
      )
    } catch (error: any) {
      console.error('Error in processLocation:', error)
      setResult({
        code: 'error',
        data: null,
      })
    }
  }

  useEffect(() => {
    if (map) {
      processLocation()
    }
  }, [map])

  return result
}

export { useClientLocation }
