import Box from '@mui/material/Box'
import T from '@mui/material/Typography'

const OnboardingBox = () => {
  return (
    <Box className="bg-hh-color4/60 h-[72%] w-[90%] mt-6 rounded-3xl p-3 flex flex-col items-center">
      <Box className="w-full h-full flex flex-col items-center gap-3">
        <T className="font-bold italic text-hh-primary">How to use:cards</T>
        <Box className="bg-hh-primary/70 w-[90%] h-[50%] rounded-4xl"></Box>
        <Box className="bg-hh-color4/90 w-[90%] h-[50%] rounded-4xl"></Box>
        <T className="font-bold italic text-hh-color4">checked</T>
      </Box>
    </Box>
  )
}

export { OnboardingBox }
