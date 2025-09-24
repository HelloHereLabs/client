import { NearbyUser } from '../_hooks/useNearbyUsers'

/**
 * React 컴포넌트를 HTML 문자열로 렌더링하는 유틸리티
 *
 * 카카오 지도 인포윈도우는 HTML 문자열만 지원하므로
 * 전역 이벤트 핸들러를 사용하여 클릭 이벤트 처리
 */

interface UserInfoContentOptions {
  user: NearbyUser
}

/**
 * 사용자 정보 인포윈도우 HTML 생성
 * @param user 사용자 정보
 * @returns HTML 문자열
 */
export const generateUserInfoContent = ({
  user,
}: UserInfoContentOptions): string => {
  return `
    <div class="p-3 min-w-[180px] w-full flex justify-between rounded-full">
      <div class="flex flex-col">
        <div class="flex items-center mb-2">
          <div class="font-bold text-sm text-gray-800 mr-2">
            ${user.nickname}
          </div>
          <div class="text-sm font-semibold">
            ${user.language}
          </div>
        </div>
      <div class="flex gap-1 text-sm text-gray-600 mb-3">
          <div class="flex flex-wrap gap-1">
            ${user.interests
              .map(
                (interest: string) =>
                  `<span class="px-2 py-1 text-xs border border-hh-color8 rounded-full text-hh-color8">${interest}</span>`,
              )
              .join('')}
          </div>
      </div>
      </div>
      <button
        onclick="window.handleUserInfoChat && window.handleUserInfoChat('${user.userId}')"
        class="w-[25%] cursor-pointer flex items-center justify-center"
        title="채팅하기"
      >
        <img src="/icons/map-chat-icon.svg" alt="채팅" class="w-4 h-4" />
      </button>
    </div>
  `
}

/**
 * 전역 이벤트 핸들러 설정
 * @param onChatClick 채팅 버튼 클릭 핸들러
 */
export const setupGlobalChatHandler = (
  onChatClick: (userId: string) => void,
) => {
  // 전역 객체에 핸들러 등록
  ;(window as any).handleUserInfoChat = onChatClick
}

/**
 * 전역 이벤트 핸들러 정리
 */
export const cleanupGlobalChatHandler = () => {
  delete (window as any).handleUserInfoChat
}
