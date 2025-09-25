'use client'

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import Button from '@mui/material/Button'
import { useState } from 'react'

interface ChatRequestModalProps {
  isOpen: boolean
  targetUserName?: string
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ChatRequestModal 컴포넌트
 *
 * 지도에서 사용자 마커 클릭 시 대화 요청 확인을 위한 모달
 *
 * 주요 기능:
 * - 대화 요청 확인 메시지 표시
 * - 확인/취소 액션 버튼 제공
 * - 타겟 사용자명 표시 (옵션)
 */
const ChatRequestModal = ({
  isOpen,
  targetUserName,
  onConfirm,
  onCancel,
}: ChatRequestModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      PaperProps={{
        className: 'rounded-2xl p-2',
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle className="text-center font-bold text-gray-800 pb-2">
        대화 요청
      </DialogTitle>

      <DialogContent className="text-center pb-4">
        <div className="text-gray-700 text-sm leading-relaxed">
          {targetUserName ? (
            <>
              <strong>{targetUserName}</strong>님에게
              <br />
              대화를 요청하시겠습니까?
            </>
          ) : (
            '대화를 요청하시겠습니까?'
          )}
        </div>
      </DialogContent>

      <DialogActions className="flex justify-center gap-3 pb-4">
        <Button
          onClick={onCancel}
          variant="outlined"
          className="px-6 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 rounded-lg"
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          className="px-6 py-2 bg-hh-primary hover:bg-hh-primary/90 text-white rounded-lg"
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// 전역 모달 관리를 위한 상태와 함수들
const globalModalState = {
  isOpen: false,
  targetUserName: '',
  onConfirm: () => {},
  onCancel: () => {},
}

let setGlobalModalState: (
  state:
    | typeof globalModalState
    | ((prev: typeof globalModalState) => typeof globalModalState),
) => void

/**
 * 전역 모달 상태를 업데이트하는 함수 등록
 */
export const registerGlobalModalSetter = (
  setter: (
    state:
      | typeof globalModalState
      | ((prev: typeof globalModalState) => typeof globalModalState),
  ) => void,
) => {
  setGlobalModalState = setter
}

/**
 * 전역적으로 모달을 열기 위한 함수
 */
export const openChatRequestModal = (
  userId: string,
  userName: string,
  onConfirm: () => void,
) => {
  if (setGlobalModalState) {
    setGlobalModalState({
      isOpen: true,
      targetUserName: userName,
      onConfirm: () => {
        onConfirm()
        closeChatRequestModal()
      },
      onCancel: closeChatRequestModal,
    })
  }
}

/**
 * 전역적으로 모달을 닫기 위한 함수
 */
export const closeChatRequestModal = () => {
  if (setGlobalModalState) {
    setGlobalModalState((prev: typeof globalModalState) => ({
      ...prev,
      isOpen: false,
      onConfirm: () => {},
      onCancel: () => {},
    }))
    setTimeout(
      () =>
        setGlobalModalState((prev: typeof globalModalState) => ({
          ...prev,
          targetUserName: '',
        })),
      100,
    )
  }
}

/**
 * 글로벌 모달 훅
 */
export const useGlobalChatRequestModal = () => {
  const [modalState, setModalState] = useState(globalModalState)

  // 전역 setter 등록
  useState(() => {
    registerGlobalModalSetter(setModalState)
  })

  return {
    ...modalState,
    ChatRequestModalComponent: (
      <ChatRequestModal
        isOpen={modalState.isOpen}
        targetUserName={modalState.targetUserName}
        onConfirm={modalState.onConfirm}
        onCancel={modalState.onCancel}
      />
    ),
  }
}

export default ChatRequestModal
