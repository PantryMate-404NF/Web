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

interface JsonRequestOptions extends RequestOptions {
  responseType?: 'json';
}

interface NoContentRequestOptions extends RequestOptions {
  responseType: 'none';
}

/**
 * JSON 응답을 반환하는 공통 API 요청입니다.
 */
export function request<T>(path: string, options?: JsonRequestOptions): Promise<T>;

/**
 * 204 No Content 응답을 반환하는 공통 API 요청입니다.
 */
export function request(path: string, options: NoContentRequestOptions): Promise<void>;

export async function request<T>(
  path: string,
  {
    body,
    auth = true,
    headers,
    responseType = 'json',
    ...options
  }: JsonRequestOptions | NoContentRequestOptions = {},
): Promise<T | void> {
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
    if (responseType === 'none') {
      return;
    }

    throw new ApiError(response.status, null, '응답 데이터가 없습니다.');
  }

  let result: ApiResponse<T>;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.status, null, '서버 응답을 해석하지 못했습니다.');
  }

  if (!response.ok || result.status === 'ERROR') {
    throw new ApiError(response.status, result.error, result.message);
  }

  if (responseType === 'none') {
    return;
  }

  return result.data;
}
