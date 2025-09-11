import Button from '@mui/material/Button'

const NoChat = () => {
  return (
    <div className="h-screen w-7/8 flex flex-col justify-center items-center">
      <div className="flex flex-wrap flex-col justify-center items-center border-2 border-hh-color2 w-full h-120 rounded-3xl ">
        <div className="">아직 진행중인 대화가 없어요!</div>
        <div className="">지금 대화를 시작해 볼까요?</div>
        <Button className="px-5 bg-hh-primary text-hh-white mt-6 text-base">
          시작하기
        </Button>
      </div>
    </div>
  )
}

export default NoChat
