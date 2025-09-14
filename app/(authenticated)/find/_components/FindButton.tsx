'use client'

import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

interface FindButtonProps {
  colorClassName: string
  content: React.ReactNode
  onClick: () => void
}
const FindButton = ({ colorClassName, content, onClick }: FindButtonProps) => {
  return (
    <Button
      variant="contained"
      className={`${colorClassName} w-full h-full rounded-[20px] shadow-none`}
      onClick={onClick}
    >
      {content}
    </Button>
  )
}

export default FindButton
