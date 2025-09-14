import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

const ChatAlert = () => {
  return (
    <div className="flex w-7/8 h-18 p-3 mt-4 rounded-2xl bg-hh-primary text-hh-white">
      <div className="">
        근처의 <span className="font-bold">Olivia</span> 님이 대화를 요청했어요.
        수락하시겠습니까?
      </div>

      <div className="h-full flex justify-center items-center gap-3 ">
        <CheckIcon />
        <CloseIcon />
      </div>
    </div>
  )
}

export default ChatAlert
