'use client'

import Button from '@mui/material/Button'

interface FindButtonProps {
  colorClassName: string
  content: React.ReactNode
  onClick: () => void
  disabled?: boolean
}
const FindButton = ({
  colorClassName,
  content,
  onClick,
  disabled,
}: FindButtonProps) => {
  return (
    <Button
      variant="contained"
      className={`${colorClassName} w-full h-full rounded-[20px] shadow-none`}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </Button>
  )
}

export default FindButton
