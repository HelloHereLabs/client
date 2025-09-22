import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'

const NoChat = () => {
  const router = useRouter()
  const MoveToFind = () => {
    router.push('/find')
  }
  return (
    <div className="h-full w-7/8 flex flex-col justify-center items-center">
      <div className="flex flex-wrap flex-col justify-center items-center border-2 border-hh-color2 w-full h-3/4 rounded-3xl ">
        <div className="">아직 진행중인 대화가 없어요!</div>
        <div className="">지금 대화를 시작해 볼까요?</div>
        <Button
          className="px-5 bg-hh-primary text-hh-color4 mt-6 text-base"
          onClick={MoveToFind}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}

export default NoChat
