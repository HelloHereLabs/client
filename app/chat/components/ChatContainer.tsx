import ChatAlert from './ChatAlert'
import ChatInput from './ChatInput'
import ChatRoom from './ChatRoom'
import MyChat from './MyChat'
import PushToTalk from './PushToTalk'
import UrChat from './UrChat'

const ChatContainer = () => {
  return (
    <div className="h-screen w-full">
      <div className="h-13 rounded-t-4xl pt-4 px-6 bg-hh-secondary text-hh-white font-bold">
        chats
      </div>
      <div className="flex flex-wrap flex-col items-center h-full bg-hh-color9">
        {/* <ChatAlert />
        <UrChat />
        <MyChat />
        <ChatInput /> */}
        <PushToTalk />
      </div>
    </div>
  )
}

export default ChatContainer
