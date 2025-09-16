import { headers } from 'next/headers'

export const checkIsDesktop = async () => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  return !Boolean(
    userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
    ),
  )
}
