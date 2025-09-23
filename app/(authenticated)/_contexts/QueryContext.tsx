'use client'

import queryClient from '@/lib/reactQueryClient'
import { QueryClientProvider } from '@tanstack/react-query'

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * QueryProvider 컨텍스트
 *
 * React Query의 QueryClient를 제공하는 컨텍스트 컴포넌트
 *
 * 주요 기능:
 * - 전역 React Query 설정 제공
 * - 모든 하위 컴포넌트에서 useQuery, useMutation 사용 가능
 */
export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
