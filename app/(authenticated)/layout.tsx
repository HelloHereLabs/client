import AppNavigation from '@/components/layout/Navigation'

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <AppNavigation />
    </>
  )
}

export default AuthenticatedLayout
