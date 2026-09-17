import { request } from './http-client';

interface OrderPaymentRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

interface JsonOrderPaymentRequestOptions extends OrderPaymentRequestOptions {
  responseType?: 'json';
}

interface NoContentOrderPaymentRequestOptions extends OrderPaymentRequestOptions {
  responseType: 'none';
}

export function orderPaymentRequest<T>(
  path: string,
  options?: JsonOrderPaymentRequestOptions,
): Promise<T>;

export function orderPaymentRequest(
  path: string,
  options: NoContentOrderPaymentRequestOptions,
): Promise<void>;

export async function orderPaymentRequest<T>(
  path: string,
  options: JsonOrderPaymentRequestOptions | NoContentOrderPaymentRequestOptions = {},
): Promise<T | void> {
  if (options.responseType === 'none') {
    return request(`/api${path}`, options);
  }

  return request<T>(`/api${path}`, options);
}
