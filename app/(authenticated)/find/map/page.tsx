'use client'

import { useEffect } from 'react'
import Box from '@mui/material/Box'
import { useKakaoMap } from './_hooks/useKaKaoMap'
import { useClientLocation } from './_hooks/useClientLocation'

const MapPage = () => {
  const map = useKakaoMap()
  const result = useClientLocation(map)

  // 지도 객체가 할당될 때만 지도 중심 이동
  useEffect(() => {
    if (map) {
      console.log('Map instance:', map)
      var moveLatLon = new window.kakao.maps.LatLng(33.452613, 126.570888)
      map.setCenter(moveLatLon)
    }
  }, [map])

  // 위치 정보가 변경될 때마다 결과 출력
  useEffect(() => {
    if (!map) return
    console.log('Location result:', result)
    if (result.code === 'OK' && result.data) {
      console.log(
        `User location: Latitude ${result.data.x}, Longitude ${result.data.y}`,
      )
      //  현위치 마커 추가, 마커 이미지 커스텀
      const myLocationMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(result.data.x, result.data.y),
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
    } else if (result.code === 'denied') {
      console.log('Location access denied by user.')
    } else if (result.code === 'not-supported') {
      console.log('Geolocation is not supported by this browser.')
    } else if (result.code === 'error') {
      console.log('An error occurred while retrieving location.')
    }
  }, [result])

  return (
    <Box className={'flex justify-center items-center h-dvh w-full'}>
      <Box id="map" className={'w-full h-full'}></Box>
    </Box>
  )
}

export default MapPage
