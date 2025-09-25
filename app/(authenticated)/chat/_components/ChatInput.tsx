import MicIcon from '@mui/icons-material/Mic'
import SendIcon from '@mui/icons-material/Send'
import TextField from '@mui/material/TextField'

interface ChatInputProps {
  userId: string | null
  chatroomId: string
  inputValue: string
  setInputValue: (v: string) => void
  sendMsg: () => void
  type: string
  setType: (v: string) => void
}

const ChatInput = ({
  inputValue,
  setInputValue,
  sendMsg,
  chatroomId,
  type,
  setType,
}: ChatInputProps) => {
  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue && chatroomId !== null) {
        if (e.nativeEvent.isComposing) {
          e.stopPropagation()
          return
        }

        sendMsg()
      }
    }
  }

  const handleType = () => {
    if (type !== 'voice') setType('voice')
    else setType('chat')
  }

  return (
    <div className="flex justify-between w-full h-14 p-2 pl-3 bg-hh-color4 sticky bottom-13 ">
      <div className="flex justify-center items-center rounded-full w-9 h-9 bg-hh-secondary text-hh-white">
        <MicIcon onClick={handleType} />
      </div>

      <TextField
        id="ChatInputValue"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setInputValue(event.target.value)
        }}
        size="small"
        variant="standard"
        placeholder="메시지를 입력하세요"
        InputProps={{ disableUnderline: true, onKeyDown: handleEnter }}
        className="w-3/4 p-2 px-4 rounded-3xl bg-hh-color9"
        value={inputValue}
      />

      <div className="flex justify-center items-center rounded-full w-9 h-9 bg-hh-secondary text-hh-white ">
        <SendIcon
          fontSize="small"
          onClick={() => {
            sendMsg()
            setInputValue('')
          }}
        />
      </div>
    </div>
  )
}

export default ChatInput
