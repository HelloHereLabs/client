import { useEffect, useRef, useState } from 'react'
import translateMessage from '../_hooks/translateMessage'

type SpeechRecognitionType = {
  start: () => void
  stop: () => void
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
}

export const useSTT = (
  type: string,
  userId: string | null,
  chatroomId: string,
  target: string | null,
) => {
  const [transcript, setTranscript] = useState('')
  const [translated, setTranslated] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const recognitionRef = useRef<SpeechRecognitionType | null>(null)

  const translateSpeech = async (text: string) => {
    setLoading(true)
    try {
      const out = await translateMessage(type, text, userId, chatroomId, target)
      setTranslated(out)
    } catch (err) {
      console.error('translate error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error('❌ 브라우저가 Web Speech API를 지원하지 않습니다.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = navigator.language
    recognition.interimResults = false
    recognition.continuous = false

    recognition.onresult = async (event: any) => {
      const text: string = event.results[0][0].transcript ?? ''
      setTranscript(text)
      await translateSpeech(text)
    }

    recognition.onerror = (event: any) => {
      console.error('음성 인식 오류:', event.error)
    }

    recognitionRef.current = recognition
  }, [type, userId, chatroomId, target])

  const startListening = () => {
    recognitionRef.current?.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
  }

  return { transcript, translated, loading, startListening, stopListening }
}
