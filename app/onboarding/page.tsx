import Container from '@mui/material/Container'
import Image from 'next/image'
import LandingBg from '../../public/images/landingImg.png'
import Logo from '../../public/images/HelloHere.png'

const Onboarding = () => {
  return (
    <>
      <Image
        src={LandingBg}
        alt="landing image"
        className="relative h-full w-full"
      />
      <Container className="absolute top-0 left-0 h-screen w-full flex flex-col items-center ">
        <Image src={Logo} alt="logo" className="w-3xs h-20 mt-24" />
        <div className="bg-hh-color4/60 h-[72%] w-84 mt-6 rounded-3xl p-3 flex flex-col items-center gap-3">
          <span className="font-bold text-hh-primary">How to use:cards</span>
          <div className="bg-hh-primary/70 w-[90%] h-[53%] rounded-4xl"></div>
          <div className="bg-hh-color4/90 w-[90%] h-[35%] rounded-4xl"></div>
          <span className="font-bold text-hh-color4 italic">checked</span>
        </div>
      </Container>
    </>
  )
}

export default Onboarding
