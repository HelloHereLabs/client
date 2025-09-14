'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import axiosInstance from '@/lib/axiosInstance'

const Header = () => {
  const handleTokenRequest = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/start')
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box className="header flex-none flex gap-4 h-16 bg-hh-primary text-hh-white">
      <Button onClick={handleTokenRequest}>토큰 요청</Button>
      <Button onClick={() => alert('준비중입니다.')}>토큰 검증</Button>
      <Button onClick={() => alert('준비중입니다.')}>토큰 제거</Button>
    </Box>
  )
}

export default Header
