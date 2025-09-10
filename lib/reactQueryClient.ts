import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 창 포커스 시 재요청 여부
      retry: 1, // 실패 시 재시도 횟수
      // staleTime: 0, // fresh 상태 유지 시간 (ms)
      // cacheTime: 5 * 60 * 1000, // 캐시 유지 시간 (ms)
      // refetchInterval: false, // 주기적 재요청 간격
      // enabled: true, // 쿼리 활성화 여부
      // suspense: false, // React Suspense 사용 여부
      // onSuccess: data => {}, // 성공 시 콜백
      // onError: error => {}, // 에러 시 콜백
      // onSettled: (data, error) => {}, // 완료 시 콜백
    },
    // mutations: {
    //   retry: 0, // 실패 시 재시도 횟수
    //   onSuccess: data => {}, // 성공 시 콜백
    //   onError: error => {}, // 에러 시 콜백
    //   onSettled: (data, error) => {}, // 완료 시 콜백
    // },
  },
})

export default queryClient
