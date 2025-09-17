'use client'

import { socket } from '@/lib/socket'
import Container from '@mui/material/Container'
import { useEffect } from 'react'

const ContainerBox = () => {
  const TOKEN =
    typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    if (!TOKEN) return

    socket.connect({
      open: () => console.log('✅ connected'),
      close: () => console.log('❌ close'),
      error: (e: Event) => console.error('ws error', e),
    })
    return () => socket.close()
  }, [TOKEN])
  return <Container className="h-full"></Container>
}

export default ContainerBox
