import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import { useWebSocket } from '../../_contexts/WebSocketContext'
import { ReceiveNewChat } from '@/types/WSClient'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import axiosInstance from '@/lib/axiosInstance'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface ChatAlertProps {
  pendingRoom: ReceiveNewChat
  setPendingRooms: Dispatch<SetStateAction<ReceiveNewChat[]>>
  userId: string | null
}

const ChatAlert = ({
  pendingRoom,
  setPendingRooms,
  userId,
}: ChatAlertProps) => {
  const [receiverNick, setReceiverNick] = useState('')
  const { sendMessage } = useWebSocket()

  const getReceiverNick = async () => {
    const receiver = pendingRoom.receiver
    const response = await axiosInstance.get(`api/users/${receiver}`)
    setReceiverNick(response.data.nickname)
  }

  useEffect(() => {
    if (userId !== pendingRoom.sender) return
    getReceiverNick()
  }, [pendingRoom])

  const isOwn = userId === pendingRoom.sender

  const acceptNewChat = () => {
    sendMessage({
      action: 'acceptNewChat',
      data: {
        sender: pendingRoom.sender,
        receiver: pendingRoom.receiver,
        chatRoomId: pendingRoom.chatroomId,
      },
    })
    setPendingRooms((prev) =>
      prev.filter((room) => room.chatroomId !== pendingRoom.chatroomId),
    )
  }

  const denyNewChat = () => {
    sendMessage({
      action: 'rejectNewChat',
      data: {
        sender: pendingRoom.sender,
        receiver: pendingRoom.receiver,
        chatRoomId: pendingRoom.chatroomId,
      },
    })
    setPendingRooms((prev) =>
      prev.filter((room) => room.chatroomId !== pendingRoom.chatroomId),
    )
  }

  return (
    <>
      {!isOwn ? (
        <div className="flex w-7/8 h-18 p-3 mt-4 rounded-2xl bg-hh-primary text-hh-white">
          <div className="">
            근처의
            <span className="font-bold">{pendingRoom.senderNickname}</span> 님이
            대화를 요청했어요. 수락하시겠습니까?
          </div>

          <div className="h-full flex justify-center items-center gap-3 ">
            <CheckIcon onClick={acceptNewChat} />
            <CloseIcon onClick={denyNewChat} />
          </div>
        </div>
      ) : (
        <div className="flex justify-between w-7/8 h-18 p-3 mt-4 rounded-2xl bg-hh-primary text-hh-white">
          <div className="">
            {receiverNick} 님에게 요청한 대화가 수락 대기중이에요
          </div>

          <Button
            fullWidth
            loading
            loadingPosition="start"
            loadingIndicator={
              <CircularProgress
                size={16}
                color="inherit"
                sx={{ color: 'white' }}
              />
            }
          />
        </div>
      )}
    </>
  )
}

export default ChatAlert
