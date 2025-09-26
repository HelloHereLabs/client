import MicIcon from '@mui/icons-material/Mic'
import HearingIcon from '@mui/icons-material/Hearing'
import { useState } from 'react'
import { useSTT } from '../_hooks/useSTT'
import Button from '@mui/material/Button'

interface PushToTalkProps {
  type: string
  target: string | null
  userId: string | null
  chatroomId: string
}

const PushToTalk = ({ type, target, userId, chatroomId }: PushToTalkProps) => {
  const [status, setStatus] = useState('waiting')
  const { transcript, startListening, stopListening, loading, translated } =
    useSTT(type, userId, chatroomId, target)

  const handleStatus = () => {
    if (status === 'waiting' || 'translated') setStatus('recording')
    if (status === 'recording') setStatus('translated')
  }

  return (
    <div className="w-full h-full py-70 flex flex-col items-center gap-40">
      {status === 'waiting' ? (
        <>
          <div className="font-bold">대화를 시작해보세요</div>
          <div
            className="flex justify-center items-center rounded-full w-24 h-24 bg-hh-secondary text-hh-color4"
            onClick={() => {
              handleStatus()
              startListening()
            }}
          >
            <MicIcon sx={{ fontSize: 60 }} />
          </div>
        </>
      ) : status === 'recording' ? (
        <>
          <HearingIcon sx={{ fontSize: 60 }} className="text-hh-color4" />
          <div className="font-bold text-hh-secondary">AI가 듣고 있어요</div>

          <div
            className="flex justify-center items-center rounded-full w-24 h-24 bg-hh-color4 text-hh-secondary"
            onClick={() => {
              handleStatus()
              stopListening()
            }}
          >
            <MicIcon sx={{ fontSize: 60 }} />
          </div>
        </>
      ) : (
        <>
          <div className="font-bold text-hh-secondary text-2xl">
            {loading ? (
              <Button fullWidth loading loadingPosition="start" />
            ) : (
              translated
            )}
          </div>
          <div className="font-bold">{transcript}</div>
          <div
            className="flex justify-center items-center rounded-full w-24 h-24 bg-hh-secondary text-hh-color4"
            onClick={handleStatus}
          >
            <MicIcon
              sx={{ fontSize: 60 }}
              onClick={() => {
                handleStatus()
                startListening()
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PushToTalk
