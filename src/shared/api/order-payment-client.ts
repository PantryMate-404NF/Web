import { request } from './http-client';

interface OrderPaymentRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function orderPaymentRequest<T>(
  path: string,
  options: OrderPaymentRequestOptions = {},
): Promise<T> {
  return request<T>(`/api${path}`, options);
}
