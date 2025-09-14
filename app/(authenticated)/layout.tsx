import Container from '@mui/material/Container'
import AppNavigation from '@/components/layout/Navigation'
import Header from '@/components/layout/Header'

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container disableGutters className="flex flex-col h-screen">
      <Header />
      {children}
      <AppNavigation />
    </Container>
  )
}

export default AuthenticatedLayout
