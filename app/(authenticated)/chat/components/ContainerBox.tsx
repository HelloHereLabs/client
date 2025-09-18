'use client'

import { socket } from '@/lib/socket'
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { ChatRoom } from '@/types/WSClient'
import ChatContainer from '../_components/ChatContainer'
import NoChat from '../_components/NoChat'
import axios from 'axios'
import { BASE_URL } from '@/lib/config'

const ContainerBox = () => {
  const [wsToken, setWsToken] = useState<string | null>(null)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

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
    // try {
    //   const res = await axios.get(`${BASE_URL}/rooms`, {
    //     withCredentials: true,
    //   })
    //   setChatRooms(res.data)
    // } catch {
    //   console.error('❌ fail to get rooms')
    // }
    try {
      const res = await axios.get('/api/chat/chatlist')
      setChatRooms(res.data)
    } catch {
      console.error('fail to get List')
    }
  }

  useEffect(() => {
    getWsToken()
  }, [])

  useEffect(() => {
    getRooms()
  }, [wsToken])

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
    <Container className="h-full w-full p-0 flex justify-center">
      {chatRooms.length > 0 ? (
        <ChatContainer chatRooms={chatRooms} />
      ) : (
        <NoChat />
      )}
    </Container>
  )
}

export default ContainerBox
