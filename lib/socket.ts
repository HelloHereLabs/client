import { createWSClient } from './wsClient'

const CHAT_URL = `wss://qm81q0oz8a.execute-api.us-west-1.amazonaws.com/dev`

export const socket = createWSClient(CHAT_URL)
