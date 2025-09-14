import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://qm81q0oz8a.execute-api.us-west-1.amazonaws.com', // 기본 API URL
  timeout: 10000, // 요청 타임아웃 (ms)
  headers: {
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer <token>', // 인증 토큰 예시
  },
  // params: { lang: 'ko' }, // 모든 요청에 기본 쿼리 파라미터
  // withCredentials: false, // 쿠키 등 인증정보 포함 여부
  // auth: { username: 'user', password: 'pass' }, // HTTP 기본 인증
  // responseType: 'json', // 응답 데이터 타입
  // xsrfCookieName: 'XSRF-TOKEN', // XSRF 보호용 쿠키 이름
  // xsrfHeaderName: 'X-XSRF-TOKEN', // XSRF 보호용 헤더 이름
  // validateStatus: status => status < 500, // 성공/실패 판단 함수
  // maxContentLength: 2000, // 최대 응답 크기
  // maxBodyLength: 2000, // 최대 요청 크기
  // onUploadProgress: progressEvent => {}, // 업로드 진행 이벤트
  // onDownloadProgress: progressEvent => {}, // 다운로드 진행 이벤트
})

export default axiosInstance
