import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HelloHere',
  description: '',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="ko">
      <body className={``}>{children}</body>
    </html>
  )
}

export default RootLayout
