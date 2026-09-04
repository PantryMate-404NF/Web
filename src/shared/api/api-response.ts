/**
 * 백엔드 API의 성공·실패 응답을 구분하는 공통 계약입니다.
 * 성공 응답의 data는 호출자가 정한 T이며, null이 필요하면 T에 null을 명시합니다.
 */
export interface ApiSuccessResponse<T> {
  status: 'SUCCESS';
  message: string;
  data: T;
  error: null;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: 'ERROR';
  message: string;
  data: null;
  error: string | null;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
