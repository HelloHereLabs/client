import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { checkIsDesktop } from '@/lib/utils'

import './tailwind.css'

export const metadata: Metadata = {
  title: 'HelloHere',
  description: '',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const isDesktop = await checkIsDesktop()

  // 사용자의 언어 감지
  const headersList = await headers()
  const acceptLanguage = headersList.get('accept-language') || 'ko'
  const userLanguage = acceptLanguage.split(',')[0].split('-')[0] || 'ko'

  return (
    <html lang={userLanguage}>
      <body
        className={`w-full overflow-x-hidden ${
          isDesktop
            ? 'max-w-md h-[70vh] mx-auto shadow-xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
            : 'h-dvh'
        }`}
      >
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}

export default RootLayout
