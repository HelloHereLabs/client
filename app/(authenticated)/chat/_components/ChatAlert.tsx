import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import { useWebSocket } from '../../_contexts/WebSocketContext'
import { ReceiveNewChat } from '@/types/WSClient'

interface ChatAlertProps {
  newRoom: {
    chatroomId: string
    receiver: string
    sender: string
    senderNickname: string
  }
  setNewRoom: (v: ReceiveNewChat | null) => void
}

const ChatAlert = ({ newRoom, setNewRoom }: ChatAlertProps) => {
  const { sendMessage } = useWebSocket()

  const acceptNewChat = () => {
    sendMessage({
      action: 'acceptNewChat',
      data: {
        sender: newRoom.sender,
        receiver: newRoom.receiver,
        chatRoomId: newRoom.chatroomId,
      },
    })
    setNewRoom(null)
  }

  const denyNewChat = () => {
    sendMessage({
      action: 'rejectNewChat',
      data: {
        sender: newRoom.sender,
        receiver: newRoom.receiver,
        chatRoomId: newRoom.chatroomId,
      },
    })
    setNewRoom(null)
  }

  return (
    <div className="flex w-7/8 h-18 p-3 mt-4 rounded-2xl bg-hh-primary text-hh-white">
      <div className="">
        근처의 <span className="font-bold">{newRoom.senderNickname}</span> 님이
        대화를 요청했어요. 수락하시겠습니까?
      </div>

      <div className="h-full flex justify-center items-center gap-3 ">
        <CheckIcon onClick={acceptNewChat} />
        <CloseIcon onClick={denyNewChat} />
      </div>
    </div>
  )
}

export default ChatAlert
