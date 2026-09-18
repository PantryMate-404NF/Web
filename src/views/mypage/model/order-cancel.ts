/** 주문 취소 요청을 활성화할 수 있는 최소 조건을 판단합니다. */
export function isOrderCancellationSubmittable(reason: string | undefined, agreed: boolean) {
  return Boolean(reason) && agreed;
}
