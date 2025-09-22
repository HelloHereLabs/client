'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useLocation } from '../../_contexts/LocationContext'
import { useKakaoMap } from './_hooks/useKaKaoMap'

const MapPage = () => {
  const router = useRouter()
  const map = useKakaoMap()
  const { locationResult } = useLocation()

  const handleBack = () => {
    router.back()
  }

  // 지도 객체가 할당될 때만 지도 중심 이동
  useEffect(() => {
    if (map) {
      console.log('Map instance:', map)
      const moveLatLon = new window.kakao.maps.LatLng(33.452613, 126.570888)
      map.setCenter(moveLatLon)
    }
  }, [map])

  // 위치 정보가 변경될 때마다 결과 출력
  useEffect(() => {
    if (!map) return
    console.log('Location result:', locationResult)
    if (locationResult.code === 'OK' && locationResult.data) {
      console.log(
        `User location: Latitude ${locationResult.data.latitude}, Longitude ${locationResult.data.longitude}`,
      )
      //  현위치 마커 추가, 마커 이미지 커스텀
      const myLocationMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          locationResult.data.latitude,
          locationResult.data.longitude,
        ),
        image: new window.kakao.maps.MarkerImage(
          '/icons/my-location-icon.svg',
          new window.kakao.maps.Size(24, 28),
          {
            offset: new window.kakao.maps.Point(12, 28),
          },
        ),
      })
      myLocationMarker.setMap(map)
      //   map.setLevel(2)
    } else if (locationResult.code === 'denied') {
      console.log('Location access denied by user.')
    } else if (locationResult.code === 'not-supported') {
      console.log('Geolocation is not supported by this browser.')
    } else if (locationResult.code === 'error') {
      console.log('An error occurred while retrieving location.')
    }
  }, [locationResult, map])

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
    </Box>
  )
}

export default MapPage
