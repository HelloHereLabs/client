import {
  WSOptions,
  WSHandlers,
  ChatRoom,
  ChatMessage,
  ChatEvent,
} from '@/types/WSClient'

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
      let data: any = event.data
      try {
        data = JSON.parse(event.data)
      } catch {}

      if (data?.action && subscribers[data.action]) {
        subscribers[data.action].forEach((fn) => fn(data))
      }

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

  const send = (event: ChatEvent) => {
    if (typeof event === 'string') {
      ws?.send(event)
    } else {
      try {
        ws?.send(JSON.stringify(event))
      } catch {
        console.warn('⚠️ send 실패', event)
      }
    }
  }
  const close = (code?: number, reason?: string) => {
    closedByUser = true
    if (connectTimer) window.clearTimeout(connectTimer)
    ws?.close(code, reason)
  }

  const readyState = () => ws?.readyState ?? WebSocket.CLOSED

  const sendAndWait = (
    payload: unknown,
    match: (msg: any) => boolean,
    timeout = 8000,
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return reject(new Error('WS not open'))
      }

      const timer = window.setTimeout(() => {
        cleanup()
        reject(new Error('sendAndWait timeout'))
      }, timeout)

      const onMessage = (event: MessageEvent) => {
        let msg: any = event.data
        if (typeof event.data === 'string') {
          try {
            msg = JSON.parse(event.data)
          } catch {}
        }

        if (match(msg)) {
          cleanup()
          resolve(msg)
        }
      }

      const cleanup = () => {
        clearTimeout(timer)
        ws?.removeEventListener('message', onMessage)
      }

      ws.addEventListener('message', onMessage)

      if (typeof payload === 'string') ws.send(payload)
      else ws.send(JSON.stringify(payload))
    })
  }

  let eventListeners: Record<
    string,
    { fn: (data: any, event: MessageEvent) => void; once: boolean }
  > = {}

  let subscribers: Record<string, ((msg: any) => void)[]> = {}

  function onEvent(event: string, fn: (msg: any) => void) {
    if (!subscribers[event]) subscribers[event] = []
    subscribers[event].push(fn)

    // 해제 함수 반환
    return () => {
      subscribers[event] = subscribers[event].filter((f) => f !== fn)
    }
  }

  return { connect, send, sendAndWait, close, readyState, onEvent }
}
