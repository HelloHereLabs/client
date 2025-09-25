const translateMessage = async (
  type: string,
  text: string,
  userId: string | null,
  chatroomId: string,
  targetLanguage?: string | null,
) => {
  const res = await fetch(
    'https://qm81q0oz8a.execute-api.us-west-1.amazonaws.com/test/api/translation/translate',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, text, userId, chatroomId, targetLanguage }),
    },
  )
  if (!res.ok) {
    const err = await res.text().catch(() => '')
    console.error('translate api error:', res.status, err)
    throw new Error('❌translate failed')
  }
  const data = await res.json()

  const translate = data.translatedText as string
  return translate
}

export default translateMessage
