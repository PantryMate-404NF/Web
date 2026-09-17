import { getApiBaseUrl } from '@/shared/config/api';

import { ApiError } from './api-error';
import type { ApiResponse } from './api-response';

interface OrderPaymentRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export function getOrderPaymentTestUserId() {
  const userId = process.env.NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID;

  if (!userId) {
    throw new Error('NEXT_PUBLIC_ORDER_PAYMENT_TEST_USER_ID 환경 변수가 필요합니다.');
  }

  return userId;
}

export async function orderPaymentRequest<T>(
  path: string,
  { body, headers, ...options }: OrderPaymentRequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);

  requestHeaders.set('X-User-Id', getOrderPaymentTestUserId());
  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');

  const response = await fetch(`${getApiBaseUrl()}/order-api${path}`, {
    ...options,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  let result: ApiResponse<T>;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(response.status, null, '서버 응답을 해석하지 못했습니다.');
  }

  if (!response.ok || result.status === 'ERROR') {
    throw new ApiError(response.status, result.error, result.message);
  }

  return result.data;
}
