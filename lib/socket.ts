import { createWSClient } from './wsClient'
import { CHAT_URL } from './config'

export const socket = createWSClient(CHAT_URL)
