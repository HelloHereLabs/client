import Container from '@mui/material/Container'
import AppNavigation from '@/components/layout/Navigation'
import Header from '@/components/layout/Header'

import { checkIsDesktop } from '@/lib/utils'

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
      <Header />
      {children}
      <AppNavigation />
    </Container>
  )
}

export default AuthenticatedLayout
