import { ChatMessage } from '@/types/WSClient'
import { timeFormat } from '../_hooks/useTimeFormat'

interface MyChatProps {
  chat: ChatMessage
}

const MyChat = ({ chat }: MyChatProps) => {
  const { message, timestamp } = chat
  return (
    <div className="flex justify-end gap-3 items-end w-full pr-4 mt-4">
      <div className="flex flex-wrap justify-end w-3/4">
        <div className="flex flex-col justify-center h-auto w-full p-3 rounded-t-xl rounded-bl-xl bg-hh-primary text-hh-white">
          <div className="font-extrabold text-hh-color4">나</div>
          <div className="text-hh-color4">{message}</div>
        </div>
        <div className="pr-1 mt-1 text-xs text-hh-color3 font-medium">
          {timeFormat(timestamp)}
        </div>
      </div>
    </div>
  )
}

export default MyChat
