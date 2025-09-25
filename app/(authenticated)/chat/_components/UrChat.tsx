import { ChatMessage } from '@/types/WSClient'
import GTranslateIcon from '@mui/icons-material/GTranslate'
import { useState } from 'react'
import { timeFormat } from '../_hooks/useTimeFormat'
import translateMessage from '../_hooks/translateMessage'

interface UrChatProps {
  chat: ChatMessage
  target: string | null
  userId: string | null
  chatroomId: string
}

const UrChat = ({ chat, target, userId, chatroomId }: UrChatProps) => {
  const { id, message, senderNickname, timestamp } = chat
  const [translated, setTranslated] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(false)
  const type = 'chat'

  const handleTranslate = async () => {
    if (translated[id]) {
      // 이미 번역된 경우 → 삭제 (원문 보기)
      setTranslated((prev) => {
        const copy = { ...prev }
        delete copy[id]
        return copy
      })
      return
    }

    setLoading(true)
    try {
      const out = await translateMessage(
        type,
        message,
        userId,
        chatroomId,
        target,
      )
      setTranslated((prev) => ({ ...prev, [id]: out }))
    } catch (err) {
      console.error('translate error:', err)
    } finally {
      setLoading(false)
    }
  }

  const isTranslated = !!translated[id]

  return (
    <div
      className="flex gap-3 items-end w-full pl-4 mt-4"
      onClick={handleTranslate}
    >
      <div className="w-3/4">
        <div className="flex flex-col justify-center  h-auto p-3 rounded-t-xl rounded-br-xl bg-hh-color4">
          <div className="font-extrabold">{senderNickname}</div>
          <div className="break-words whitespace-pre-wrap">{message}</div>
          {isTranslated && (
            <>
              <div className="h-[2px] w-full my-1 bg-hh-primary"></div>
              <div className="text-hh-secondary">{translated[id]}</div>
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
