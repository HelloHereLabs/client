'use client'

import { OnboardingBox } from '@/components/common/onboarding/OnboardingBox'
import PlaceIcon from '@mui/icons-material/Place'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import T from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import FindButton from './FindButton'

const FindContainer = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const router = useRouter()

  const handleOnboardingEnd = () => {
    setShowOnboarding(false)
  }

  const BUTTONS = [
    {
      id: 'ai',
      gridSize: 6,
      colorClassName: 'text-hh-color4 bg-hh-color6',
      content: (
        <T className="break-keep font-bold">
          AI가 나와 잘맞는 사용자를 찾아줘요
        </T>
      ),
      onClick: () => {},
      disabled: true,
    },
    {
      id: 'onboarding',
      gridSize: 6,
      colorClassName: 'text-hh-color4 bg-hh-color10',
      content: <T className="break-keep font-bold">온보딩 다시 보기</T>,
      onClick: () => setShowOnboarding(true),
    },
    {
      id: 'map',
      gridSize: 12,
      colorClassName:
        'text-hh-color11 bg-hh-color4 border-4 border-x-[hh-color6]',
      content: (
        <Box className="flex justify-between items-center">
          <T className="text-left font-bold break-keep w-[50%]">
            지도로 이동해서 사용자 찾기
          </T>{' '}
          <PlaceIcon className="text-hh-primary w-[36px] h-[56px]" />
        </Box>
      ),
      onClick: () => router.push('/find/map'),
    },
    {
      id: 'interests',
      gridSize: 6,
      colorClassName:
        'text-hh-color8 bg-hh-color4 border-4 border-x-[hh-color8]',
      content: (
        <T className="break-keep font-bold">
          관심사가 같은 <br />
          사용자 찾기
        </T>
      ),
      onClick: () => router.push('/find/map'),
    },
    {
      id: 'nearby',
      gridSize: 6,
      colorClassName: 'text-hh-color4 bg-hh-color8',
      content: (
        <T className="break-keep font-bold">
          나와 가까운 <br />
          사용자 찾기
        </T>
      ),
      onClick: () => router.push('/find/map'),
    },
  ]

  return (
    <>
      <Container className="pt-8 pb-8 h-full">
        <Grid container spacing={2} className="h-full">
          {BUTTONS.map((button) => (
            <Grid key={button.id} size={button.gridSize}>
              <FindButton
                colorClassName={button.colorClassName}
                content={button.content}
                onClick={button.onClick}
                disabled={button.disabled}
              />
            </Grid>
          ))}
          <Grid size={12}>
            <Box
              className={
                'text-hh-color4 bg-hh-color6 h-full rounded-[20px] flex items-center pl-6'
              }
            >
              <T className="break-keep font-bold">활성 사용자 수: 10</T>
            </Box>
          </Grid>
        </Grid>
      </Container>
      {showOnboarding && (
        <Box
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <Box className="w-full max-w-md h-[80vh] bg-white rounded-3xl overflow-hidden">
            <OnboardingBox handleEnd={handleOnboardingEnd} />
          </Box>
        </Box>
      )}
    </>
  )
}

export default FindContainer
