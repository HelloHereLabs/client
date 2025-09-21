import AppNavigation from '@/components/layout/Navigation'
import Container from '@mui/material/Container'

import { checkIsDesktop } from '@/lib/utils'
import { WebSocketProvider } from './_contexts/WebSocketContext'

const AuthenticatedLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const isDesktop = await checkIsDesktop()

  return (
    <Container
      disableGutters
      className={`flex overflow-y-auto flex-col ${isDesktop ? 'h-full' : 'h-svh'}`}
    >
      {/* <Header /> */}
      <WebSocketProvider>{children}</WebSocketProvider>
      <AppNavigation />
    </Container>
  )
}

export default AuthenticatedLayout
