import AppNavigation from '@/components/layout/Navigation'
import Container from '@mui/material/Container'

import { checkIsDesktop } from '@/lib/utils'
import { LocationProvider } from './_contexts/LocationContext'
import { QueryProvider } from './_contexts/QueryContext'
import { WebSocketProvider } from './_contexts/WebSocketContext'

const AuthenticatedLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const isDesktop = await checkIsDesktop()

  return (
    <QueryProvider>
      <Container
        disableGutters
        className={`flex overflow-y-auto flex-col ${isDesktop ? 'h-full' : 'h-svh'}`}
      >
        {/* <Header /> */}
        <LocationProvider>
          <WebSocketProvider>{children}</WebSocketProvider>
        </LocationProvider>
        <AppNavigation />
      </Container>
    </QueryProvider>
  )
}

export default AuthenticatedLayout
