'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import MapIcon from '@mui/icons-material/Map'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import LocalActivityIcon from '@mui/icons-material/LocalActivity'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const NAVIGATION_MENU_ARRAY = [
  { label: 'Find', icon: <MapIcon />, value: '/find' },
  { label: 'Chat', icon: <ChatBubbleIcon />, value: '/chat' },
  { label: 'Quest', icon: <LocalActivityIcon />, value: '/quest' },
  { label: 'My', icon: <AccountBoxIcon />, value: '/my' },
  { label: 'Exit', icon: <ExitToAppIcon />, value: '/exit' },
]

const AppNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [location, setLocation] = useState(pathname)

  return (
    <Paper
      elevation={3}
      className="app-navigation fixed bottom-0 left-0 right-0"
    >
      <BottomNavigation
        value={location}
        onChange={(event, newValue) => {
          setLocation(newValue)
          if (newValue === '/exit') {
            // 로그아웃 확인 모달 처리
          } else {
            //   router.push(newValue)
          }
        }}
      >
        {NAVIGATION_MENU_ARRAY.map((item, idx) => (
          <BottomNavigationAction
            key={idx}
            value={item.value}
            icon={item.icon}
            classes={{
              selected: 'text-hh-primary',
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

export default AppNavigation
