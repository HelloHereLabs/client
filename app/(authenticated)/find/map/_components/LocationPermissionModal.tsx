/**
 * LocationPermissionModal 컴포넌트
 *
 * 사용자가 위치 권한을 거절했을 때 표시되는 모달
 * 권한 설정 방법을 안내하고 재요청 또는 돌아가기 옵션을 제공
 *
 * @param {boolean} open - 모달 표시 여부
 * @param {() => void} onRequestPermission - 권한 재요청 핸들러
 * @param {() => void} onCancel - 취소/돌아가기 핸들러
 */

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

interface LocationPermissionModalProps {
  open: boolean
  onRequestPermission: () => void
  onCancel: () => void
}

const LocationPermissionModal = ({
  open,
  onRequestPermission,
  onCancel,
}: LocationPermissionModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={() => {}} // 빈 함수로 모달 닫기 방지 - 사용자가 반드시 선택해야 함
      aria-labelledby="permission-dialog-title"
      aria-describedby="permission-dialog-description"
      disableEscapeKeyDown // ESC 키로 모달 닫기 방지
    >
      <DialogTitle id="permission-dialog-title">
        위치 권한이 필요합니다
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="permission-dialog-description">
          지도에서 현재 위치를 표시하려면 위치 권한이 필요합니다.
          <br />
          <br />
          브라우저 설정에서 위치 권한을 허용해주세요:
          <br />
          • Chrome: 주소창 왼쪽 자물쇠 아이콘 클릭 → 위치 허용
          <br />
          • Safari: Safari 메뉴 → 설정 → 웹사이트 → 위치 서비스
          <br />• Firefox: 주소창 왼쪽 방패 아이콘 클릭 → 권한 설정
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        {/* 이전 페이지로 돌아가기 버튼 */}
        <Button onClick={onCancel} color="secondary">
          돌아가기
        </Button>

        {/* 위치 권한 재요청 버튼 */}
        <Button onClick={onRequestPermission} variant="contained">
          권한 재요청
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LocationPermissionModal
