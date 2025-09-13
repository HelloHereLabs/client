const MyChat = () => {
  return (
    <div className="flex justify-end gap-3 items-end w-full pr-4 mt-4">
      <div className="flex flex-wrap justify-end w-3/4">
        <div className="flex flex-col justify-center h-auto w-full p-3 rounded-t-xl rounded-bl-xl bg-hh-primary text-hh-white">
          <div className="font-extrabold">나</div>
          <div className="">안녕하세요</div>
        </div>
        <div className="pr-1 mt-1 text-xs text-hh-color1 font-medium">
          2025.09.10 05:01pm
        </div>
      </div>
    </div>
  )
}

export default MyChat
