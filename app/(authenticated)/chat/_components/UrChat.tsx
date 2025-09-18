import { ChatMessage } from '@/types/WSClient'
import GTranslateIcon from '@mui/icons-material/GTranslate'
import { useState } from 'react'
import { timeFormat } from '../_hooks/useTimeFormat'

interface UrChatProps {
  chat: ChatMessage
}

const UrChat = ({ chat }: UrChatProps) => {
  const { id, message, userId, timestamp } = chat
  const [translated, setTranslated] = useState<string[]>([])

  const handleTranslate = () => {
    setTranslated((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const isTranslated = translated.includes(id)

  return (
    <div
      className="flex gap-3 items-end w-full pl-4 mt-4"
      onClick={handleTranslate}
    >
      <div className="w-3/4">
        <div className="flex flex-col justify-center  h-auto p-3 rounded-t-xl rounded-br-xl bg-hh-color4">
          <div className="font-extrabold">{userId}</div>
          <div className="">{message}</div>
          {isTranslated && (
            <>
              <div className="h-[2px] w-full my-1 bg-hh-primary"></div>
              <div className="text-hh-secondary">안녕하세요</div>
            </>
          )}
        </div>
        <div className="pl-3 mt-1 text-xs text-hh-color3 font-medium">
          {timeFormat(timestamp)}
        </div>
      </div>
      <GTranslateIcon
        className={
          isTranslated ? 'mb-14 text-hh-primary' : 'mb-6 text-hh-color3'
        }
      />
      {/* 번역된 경우 mb-14 / 아닌 경우 mb-3 */}
    </div>
  )
}

export default UrChat
