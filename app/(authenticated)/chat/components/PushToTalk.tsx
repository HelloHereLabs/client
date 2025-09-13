import MicIcon from '@mui/icons-material/Mic'
import HearingIcon from '@mui/icons-material/Hearing'

const PushToTalk = () => {
  return (
    <div className="w-full h-full py-70 flex flex-col items-center gap-40">
      <div className="font-bold">대화를 시작해보세요</div>
      <div className="flex justify-center items-center rounded-full w-24 h-24 bg-hh-secondary text-hh-white">
        <MicIcon sx={{ fontSize: 60 }} />
      </div>
    </div>
  )
}

export default PushToTalk
