import { createWSClient } from './wsClient'

const CHAT_URL = `wss://eqgyhfgc4i.execute-api.us-west-1.amazonaws.com/dev/`

export const socket = createWSClient(CHAT_URL)
