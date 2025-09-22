'use client'

import { socket } from '@/lib/socket'
import Container from '@mui/material/Container'
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axiosInstance'
import { ChatRoom } from '@/types/WSClient'
import ChatContainer from './ChatContainer'
import NoChat from './NoChat'
import Grid from '@mui/material/Grid'
import { useChatWS } from '@/lib/useWS'
import Button from '@mui/material/Button'

const ContainerBox = () => {
  const { loading, error, chatRooms, getTokens } = useChatWS()

  useEffect(() => {
    getTokens()
  }, [])

  return (
    <Container className="h-full w-full p-0 flex justify-center">
      {loading ? (
        <Button fullWidth loading loadingPosition="start" />
      ) : chatRooms.length > 0 ? (
        <ChatContainer chatRooms={chatRooms} />
      ) : (
        <NoChat />
      )}
    </Container>
  )
}

export default ContainerBox
