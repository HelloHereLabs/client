import axiosInstance from '@/lib/axiosInstance'

type TranslateResponse = { translatedText: string }

const translateMessage = async (
  type: string,
  text: string,
  userId: string | null,
  chatroomId: string,
  targetLanguage?: string | null,
): Promise<string> => {
  try {
    const { data } = await axiosInstance.post<TranslateResponse>(
      '/api/translation/translate',
      { type, text, userId, chatroomId, targetLanguage },
    )
    return data.translatedText
  } catch (err) {
    console.error('translate api error:', err)

    return text
  }
}

export default translateMessage
