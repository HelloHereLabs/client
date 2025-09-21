'use client'

import AccountBoxIcon from '@mui/icons-material/AccountBox'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import LocalActivityIcon from '@mui/icons-material/LocalActivity'
import MapIcon from '@mui/icons-material/Map'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const NAVIGATION_MENU_ARRAY = [
  { label: 'Find', icon: <MapIcon />, value: '/find' },
  { label: 'Chat', icon: <ChatBubbleIcon />, value: '/chat' },
  { label: 'Quest', icon: <LocalActivityIcon />, value: '/quest' },
  { label: 'My', icon: <AccountBoxIcon />, value: '/my' },
  // { label: 'Exit', icon: <ExitToAppIcon />, value: '/exit' },
]

const getMatchedNavValue = (pathname: string) => {
  const match = NAVIGATION_MENU_ARRAY.find((item) =>
    pathname.startsWith(item.value),
  )
  return match ? match.value : pathname
}

const AppNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [location, setLocation] = useState(pathname)

  useEffect(() => {
    setLocation(getMatchedNavValue(pathname))
  }, [pathname])

  return (
    <Paper elevation={3} className="app-navigation flex-none">
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
            className="min-w-0"
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
