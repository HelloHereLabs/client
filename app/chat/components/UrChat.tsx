import GTranslateIcon from '@mui/icons-material/GTranslate'

const UrChat = () => {
  return (
    <div className="flex gap-3 items-end w-full pl-4 mt-4">
      <div className="w-3/4">
        <div className="flex flex-col justify-center  h-auto p-3 rounded-t-xl rounded-br-xl bg-hh-white">
          <div className="font-extrabold">Olivia</div>
          <div className="">hello</div>
          <div className="h-[2px] w-full my-1 bg-hh-primary"></div>
          <div className="text-hh-secondary">안녕하세요</div>
        </div>
        <div className="pl-3 mt-1 text-xs text-hh-color1 font-medium">
          2025.09.10 05:01pm
        </div>
      </div>
      <GTranslateIcon className="mb-14 text-hh-primary" />
      {/* 번역된 경우 mb-14 / 아닌 경우 mb-3 */}
    </div>
  )
}

export default UrChat
