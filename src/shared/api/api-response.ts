/**
 * 백엔드의 공통 API 응답 형식을 정의하는 코드.
 * API 호출 후 화면에는 data 값만 전달하는 것을 원칙.
 */

export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  message: string;
  data: T | null;
  error: string | null;
  timestamp: string;
}
