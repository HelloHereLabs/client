import MicIcon from '@mui/icons-material/Mic'
import SendIcon from '@mui/icons-material/Send'

import TextField from '@mui/material/TextField'

const ChatInput = () => {
  return (
    <div className="flex justify-between w-full h-14 p-2 pl-3 bg-hh-white absolute bottom-0 ">
      <div className="flex justify-center items-center rounded-full w-9 h-9 bg-hh-secondary text-hh-white">
        <MicIcon />
      </div>

      <TextField
        size="small"
        variant="standard"
        placeholder="메시지를 입력하세요"
        InputProps={{ disableUnderline: true }}
        className="w-3/4 p-2 px-4 rounded-3xl bg-hh-color9"
      />

      <div className="flex justify-center items-center rounded-full w-9 h-9 bg-hh-secondary text-hh-white ">
        <SendIcon fontSize="small" />
      </div>
    </div>
  )
}

export default ChatInput
