import { ChatRoom } from '@/types/WSClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const mock: ChatRoom[] = [
    {
      id: '1',
      participants: { sender: 'Olivia', receiver: 'Lilly' },
      lastMessage: 'Hello!',
      updateAt: 1758198000000,
      lastActivity: 0,
    },
    {
      id: '2',
      participants: { sender: 'Anna', receiver: 'Lilly' },
      lastMessage: 'See you',
      updateAt: 1758198000000,
      lastActivity: 0,
    },
  ]
  return NextResponse.json(mock, { status: 200 })
}
