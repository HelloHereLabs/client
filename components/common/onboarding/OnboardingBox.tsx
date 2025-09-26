'use client'

import Box from '@mui/material/Box'
import T from '@mui/material/Typography'
import { useState } from 'react'

const FindGuide = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box
      className="bg-hh-color4/60 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-between cursor-pointer"
      onClick={onNext}
    >
      <T className="font-bold italic text-hh-primary text-lg">Find Guide</T>
      <Box className="flex flex-col items-center gap-3 flex-1 justify-center w-full">
        <Box className="bg-hh-primary/70 w-full h-[50%] rounded-4xl p-5 flex items-center">
          <Box
            className={'w-full aspect-auto rounded-4xl'}
            component={'img'}
            src={'/images/onboarding-find.png'}
          />
        </Box>
        <Box className="bg-hh-color4/90 w-full h-[50%] rounded-4xl"></Box>
      </Box>
      <T className="font-bold italic text-hh-color4">Tap to continue</T>
    </Box>
  )
}

const MapGuide = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box
      className="bg-hh-color4/60 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-between cursor-pointer"
      onClick={onNext}
    >
      <T className="font-bold italic text-hh-secondary text-lg">Map Guide</T>
      <Box className="flex flex-col items-center gap-3 flex-1 justify-center w-full">
        <Box className="bg-hh-secondary/70 w-full h-[50%] rounded-4xl p-5">
          <Box
            className={'w-full h-full'}
            component={'img'}
            src={'/images/onboarding-map.jpg'}
          />
        </Box>
        <Box className="bg-hh-color4/90 w-full h-[50%] rounded-4xl p-5">
          <Box
            className={'w-full h-full'}
            component={'img'}
            src={'/images/onboarding-map2.jpg'}
          />
        </Box>
      </Box>
      <T className="font-bold italic text-hh-color4">Tap to continue</T>
    </Box>
  )
}

const ChatGuide = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box
      className="bg-hh-color4/60 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-between cursor-pointer"
      onClick={onNext}
    >
      <T className="font-bold italic text-hh-primary text-lg">Chat Guide</T>
      <Box className="flex flex-col items-center gap-3 flex-1 justify-center w-full">
        <Box className="bg-hh-primary/70 w-full h-[50%] rounded-4xl p-5">
          <Box
            className={'w-full h-full rounded-3xl'}
            component={'img'}
            src={'/images/onboarding-chat.jpg'}
          />
        </Box>
        <Box className="bg-hh-color4/90 w-full h-[50%] rounded-4xl flex items-center justify-center p-5">
          <Box
            className={'max-w-[50px] max-h-[50px]'}
            component={'img'}
            src={'/images/onboarding-chat2.jpg'}
          />
        </Box>
      </Box>
      <T className="font-bold italic text-hh-color4">Tap to continue</T>
    </Box>
  )
}

const MissionsGuide = ({ onNext }: { onNext: () => void }) => {
  return (
    <Box
      className="bg-hh-color4/60 h-full w-full rounded-3xl p-3 flex flex-col items-center justify-between cursor-pointer"
      onClick={onNext}
    >
      <T className="font-bold italic text-hh-secondary text-lg">
        Missions & Coalition Guide
      </T>
      <Box className="flex flex-col items-center gap-3 flex-1 justify-center w-full">
        <Box className="bg-hh-secondary/70 w-full h-[50%] rounded-4xl">
          <Box
            className={'w-full aspect-auto rounded-4xl p-5 flex items-center'}
            component={'img'}
            src={'/images/onboarding-missions.png'}
          />
        </Box>
        <Box className="bg-hh-color4/90 w-full h-[50%] rounded-4xl">
          <Box
            className={'w-full aspect-auto rounded-4xl p-5 flex items-center'}
            component={'img'}
            src={'/images/onboarding-mypage.png'}
          />
        </Box>
      </Box>
      <T className="font-bold italic text-hh-color4">Touch to Start!</T>
    </Box>
  )
}

const FADE_DURATION = 300

const OnboardingBox = ({ handleEnd }: { handleEnd: () => void }) => {
  const [step, setStep] = useState(0)
  const [fade, setFade] = useState<'in' | 'out'>('in')

  const handleNext = () => {
    if (step < 3) {
      setFade('out')
      setTimeout(() => {
        setStep((prev) => prev + 1)
        setFade('in')
      }, FADE_DURATION)
    } else {
      // 온보딩 완료 후 처리 (예: 메인 페이지로 이동)
      console.log('Onboarding completed!')
      handleEnd()
    }
  }

  const guides = [
    <FindGuide key="find" onNext={handleNext} />,
    <MapGuide key="map" onNext={handleNext} />,
    <ChatGuide key="chat" onNext={handleNext} />,
    <MissionsGuide key="missions" onNext={handleEnd} />,
  ]

  return (
    <Box
      className={`h-full w-full transition-opacity duration-300 ${
        fade === 'in' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {guides[step]}
    </Box>
  )
}

export { OnboardingBox }
