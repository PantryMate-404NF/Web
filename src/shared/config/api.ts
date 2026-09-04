/**
 * 환경별 백엔드 API 기본 주소를 관리하는 코드.
 * 로컬에서는 .env.local의 NEXT_PUBLIC_API_BASE_URL 값을 사용.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
