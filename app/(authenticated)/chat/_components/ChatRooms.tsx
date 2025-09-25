import { ChatRoom } from '@/types/WSClient'
import { timeFormat } from '../_hooks/useTimeFormat'

interface ChatRoomProps {
  chatRoom: ChatRoom
  setType: (v: string) => void
}

const ChatRooms = ({ chatRoom, setType }: ChatRoomProps) => {
  const { participants, lastMessage, updateAt } = chatRoom

  const handleType = () => {
    setType('chat')
  }

  return (
    <div className="flex flex-col justify-center w-7/8 ">
      <div
        className="h-23 p-3 mt-4 rounded-2xl bg-hh-color4 border-2 border-hh-secondary overflow-hidden break-words line-clamp-2"
        onClick={handleType}
      >
        <div className="w-full font-extrabold">{participants.receiver}</div>
        <div className="w-full">{lastMessage}</div>
      </div>
      <div className="pl-3 mt-1 text-xs text-hh-color3 font-medium">
        {timeFormat(updateAt)}
      </div>
    </div>
  )
}

export default ChatRooms
