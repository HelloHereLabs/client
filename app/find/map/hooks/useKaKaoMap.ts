import { useState, useEffect } from 'react'

const useKakaoMap = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null)

  useEffect(() => {
    const kakaoMapScript = document.createElement('script')
    kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`
    document.head.appendChild(kakaoMapScript)
    kakaoMapScript.onload = () => {
      const kakaoClusterScript = document.createElement('script')
      kakaoClusterScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=clusterer&autoload=false`
      document.head.appendChild(kakaoClusterScript)
      kakaoClusterScript.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map') as HTMLElement
          const SEOUL_CITY_HALL = { x: 37.5665, y: 126.978 }
          const options = {
            center: new window.kakao.maps.LatLng(
              SEOUL_CITY_HALL.x,
              SEOUL_CITY_HALL.y,
            ),
            level: 5,
          }
          setMap(new window.kakao.maps.Map(container, options))
        })
      }
    }
  }, [])

  return map
}

export { useKakaoMap }
