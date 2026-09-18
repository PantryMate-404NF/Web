/**
 * HTTP 상태 코드와 서버 오류 코드를 보존하는 공통 API 에러 관리 코드.
 * 화면은 이 에러를 활용해 오류 UI와 재시도 동작을 제공.
 */

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string | null,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
