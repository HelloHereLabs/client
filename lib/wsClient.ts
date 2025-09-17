import { WSOptions, WSHandlers, ChatRoom, ChatMessage } from '@/types/WSClient'

export const createWSClient = (baseUrl: string, opts: WSOptions = {}) => {
  const {
    reconnection = true,
    reconnectionAttempts = 5,
    reconnectionDelay = 2000,
    timeout = 10000,
  } = opts

  let ws: WebSocket | undefined
  let attempts = 0
  let closedByUser = false
  let connectTimer: number | undefined

  const connect = (handler: WSHandlers = {}, wsToken: string) => {
    closedByUser = false

    ws = new WebSocket(`${baseUrl}?token=${encodeURIComponent(wsToken)}`)

    // 연결 타임아웃
    connectTimer = window.setTimeout(() => {
      try {
        ws?.close()
      } catch {}
    }, timeout)

    ws.onopen = () => {
      if (connectTimer) window.clearTimeout(connectTimer)
      attempts = 0
      handler.open?.()
    }

    ws.onmessage = (event) => {
      let data: ChatMessage = event.data
      try {
        data = JSON.parse(event.data)
      } catch {}
      handler.message?.(data, event)
    }

    ws.onerror = (event) => handler.error?.(event)

    ws.onclose = (e) => {
      console.log('WS close', {
        code: e.code,
        reason: e.reason,
        wasClean: e.wasClean,
      })
      if (connectTimer) window.clearTimeout(connectTimer)
      handler.close?.()
      if (!closedByUser && reconnection && attempts < reconnectionAttempts) {
        attempts++
        ws = undefined
        setTimeout(() => connect(handler, wsToken), reconnectionDelay)
      }
    }
  }

  const send = (data: ChatMessage) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('WS not open')
    ws.send(typeof data === 'string' ? data : JSON.stringify(data))
  }

  const close = (code?: number, reason?: string) => {
    closedByUser = true
    if (connectTimer) window.clearTimeout(connectTimer)
    ws?.close(code, reason)
  }

  const readyState = () => ws?.readyState ?? WebSocket.CLOSED

  return { connect, send, close, readyState }
}
