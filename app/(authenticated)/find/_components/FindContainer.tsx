'use client'

import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import FindButton from './FindButton'
import T from '@mui/material/Typography'
import Box from '@mui/material/Box'
import PlaceIcon from '@mui/icons-material/Place'

const BUTTONS = [
  {
    id: 'ai',
    gridSize: 6,
    colorClassName: 'text-hh-color4 bg-hh-color6',
    content: (
      <T className="break-keep font-bold">AI가 나와 잘맞는 사용자를 찾아줘요</T>
    ),
    onClick: () => {},
  },
  {
    id: 'onboarding',
    gridSize: 6,
    colorClassName: 'text-hh-color4 bg-hh-color10',
    content: <T className="break-keep font-bold">온보딩 다시 보기</T>,
    onClick: () => {},
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
    onClick: () => {},
  },
  {
    id: 'interests',
    gridSize: 6,
    colorClassName: 'text-hh-color8 bg-hh-color4 border-4 border-x-[hh-color8]',
    content: (
      <T className="break-keep font-bold">
        관심사가 같은 <br />
        사용자 찾기
      </T>
    ),
    onClick: () => {},
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
    onClick: () => {},
  },
]

const FindContainer = () => {
  return (
    <Container className="pt-8 pb-8 h-full">
      <Grid container spacing={2} className="h-full">
        {BUTTONS.map((button) => (
          <Grid key={button.id} size={button.gridSize}>
            <FindButton
              colorClassName={button.colorClassName}
              content={button.content}
              onClick={button.onClick}
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
  )
}

export default FindContainer
