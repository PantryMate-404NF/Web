/**
 * 프로젝트의 공통 HTTP 요청 함수.
 * Access Token 첨부, JSON 요청·응답 처리, 서버 오류 변환을 담당.
 */

import { API_BASE_URL } from '@/shared/config/api';
import { getAccessToken } from '@/shared/model/access-token-store';

import { ApiError } from './api-error';
import type { ApiResponse } from './api-response';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
}
export async function request<T>(
  path: string,
  { body, auth = true, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  const token = getAccessToken();

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth && token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || result.status === 'ERROR') {
    throw new ApiError(response.status, result.error, result.message);
  }

  return result.data as T;
}
