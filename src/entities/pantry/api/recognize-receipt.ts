import { getApiBaseUrl } from '@/shared/config/api';
import { getAccessToken } from '@/shared/model/access-token-store';

export interface ReceiptOcrResult {
  receiptId: string;
  purchasedAt: string | null;
  items: Array<{ name: string; ingredientId: number | null }>;
}

interface ReceiptOcrResponse {
  receipt_id?: unknown;
  purchased_at?: unknown;
  items?: unknown;
  error?: { code?: unknown; message?: unknown } | null;
  message?: unknown;
}

export class ReceiptOcrError extends Error {
  constructor(
    message: string,
    public readonly code: string | null = null,
    public readonly status: number | null = null,
  ) {
    super(message);
    this.name = 'ReceiptOcrError';
  }
}

function parseReceiptOcrResult(payload: ReceiptOcrResponse, fallbackReceiptId: string) {
  if (payload.error) {
    throw new ReceiptOcrError(
      typeof payload.error.message === 'string'
        ? payload.error.message
        : '영수증을 인식하지 못했어요. 다시 시도해 주세요.',
      typeof payload.error.code === 'string' ? payload.error.code : null,
    );
  }

  if (!Array.isArray(payload.items)) {
    throw new ReceiptOcrError('OCR 응답을 확인할 수 없어요. 다시 시도해 주세요.');
  }

  return {
    receiptId: typeof payload.receipt_id === 'string' ? payload.receipt_id : fallbackReceiptId,
    purchasedAt: typeof payload.purchased_at === 'string' ? payload.purchased_at : null,
    items: payload.items.flatMap((item) => {
      if (!item || typeof item !== 'object' || !('name' in item)) return [];
      const { name, ingredient_id } = item as { name?: unknown; ingredient_id?: unknown };
      if (typeof name !== 'string') return [];

      return [
        {
          name: name.slice(0, 20),
          ingredientId: typeof ingredient_id === 'number' ? ingredient_id : null,
        },
      ];
    }),
  } satisfies ReceiptOcrResult;
}

export async function recognizeReceipt(file: File, receiptId: string, requestId: string) {
  const body = new FormData();
  body.append('file', file);
  body.append('receiptId', receiptId);

  const headers = new Headers({ 'X-Request-Id': requestId });
  const accessToken = getAccessToken();
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;
  try {
    response = await fetch(`${getApiBaseUrl()}/api/pantry-items/receipts`, {
      method: 'POST',
      headers,
      body,
    });
  } catch {
    throw new ReceiptOcrError('네트워크 연결을 확인한 뒤 다시 시도해 주세요.');
  }

  let payload: ReceiptOcrResponse;
  try {
    payload = (await response.json()) as ReceiptOcrResponse;
  } catch {
    throw new ReceiptOcrError(
      'OCR 응답을 확인할 수 없어요. 다시 시도해 주세요.',
      null,
      response.status,
    );
  }

  if (!response.ok) {
    const code = typeof payload.error?.code === 'string' ? payload.error.code : null;
    const message =
      typeof payload.error?.message === 'string'
        ? payload.error.message
        : typeof payload.message === 'string'
          ? payload.message
          : '영수증을 인식하지 못했어요. 다시 시도해 주세요.';
    throw new ReceiptOcrError(message, code, response.status);
  }

  return parseReceiptOcrResult(payload, receiptId);
}
