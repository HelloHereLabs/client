'use client'

import { socket } from '@/lib/socket'
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { ChatRoom } from '@/types/WSClient'
import ChatContainer from '../_components/ChatContainer'
import NoChat from '../_components/NoChat'

const ContainerBox = () => {
  const [wsToken, setWsToken] = useState<string | null>(null)
  const [chatRooms, setChatRooms] = useState<ChatRoom[] | null>(null)

  const handleTokenRequest = async () => {
    try {
      const res = await axiosInstance.post('/api/auth/start')
    } catch (error) {
      console.error(error)
    }
  }

  const getWsToken = async () => {
    handleTokenRequest()
    const wsTokenUrl =
      'https://qm81q0oz8a.execute-api.us-west-1.amazonaws.com/local/api/auth/websocket-token'

    ;(await fetch(wsTokenUrl, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('토큰 요청 실패')
        return res.json()
      })
      .then((data) => {
        console.log('✅ 발급된 토큰:', data.token)
        setWsToken(data.token)
      }),
      [])
  }

  const getRooms = async () => {
    try {
      const res = await axiosInstance.get('/rooms', { withCredentials: true })
      setChatRooms(res.data)
    } catch {
      console.error('❌ fail to get rooms')
    }
  }

  useEffect(() => {
    getWsToken()
    getRooms()
  }, [])

  useEffect(() => {
    if (!wsToken) return

    socket.connect(
      {
        open: () => console.log('✅ connected'),
        close: () => console.log('❌ close'),
        error: (e: Event) => console.error('ws error', e),
      },
      wsToken,
    )
    return () => socket.close()
  }, [wsToken])

  return (
    <Container className="h-full flex justify-center">
      {chatRooms ? <ChatContainer /> : <NoChat />}
    </Container>
  )
}

export default ContainerBox
