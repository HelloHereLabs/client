import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import RegisterBox from './_components/RegisterBox'

const MainPage = () => {
  return (
    <Container disableGutters className="h-full">
      <Box
        className="h-full w-full flex flex-col items-center justify-center bg-bottom bg-cover"
        sx={{
          backgroundImage: 'url(/images/landingImg.png)',
        }}
      >
        <Box
          component={'img'}
          src={'/images/HelloHere.png'}
          alt="logo"
          className="w-[70%] aspect-auto"
        />
        <RegisterBox />
      </Box>
    </Container>
  )
}

export default MainPage
