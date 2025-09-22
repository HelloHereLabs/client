import { ChatRoom } from '@/types/WSClient'
import { timeFormat } from '../_hooks/useTimeFormat'

interface ChatRoomProps {
  chatRoom: ChatRoom
}

const ChatRooms = ({ chatRoom }: ChatRoomProps) => {
  const { participants, lastMessage, updateAt } = chatRoom

  return (
    <div className="flex flex-col justify-center w-7/8 ">
      <div className="h-18 p-3 mt-4 rounded-2xl bg-hh-color4 border-2 border-hh-secondary">
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
