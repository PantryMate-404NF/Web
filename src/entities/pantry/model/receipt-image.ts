const MAX_RECEIPT_IMAGE_SIZE = 10 * 1024 * 1024;
const RECEIPT_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);

export function getReceiptImageValidationError(file: Pick<File, 'name' | 'size' | 'type'>) {
  const hasSupportedType =
    RECEIPT_IMAGE_TYPES.has(file.type.toLowerCase()) || /\.heic$/i.test(file.name);

  return hasSupportedType && file.size <= MAX_RECEIPT_IMAGE_SIZE
    ? null
    : 'JPEG, PNG, WebP, HEIC 형식의 10MB 이하 영수증 이미지를 선택해주세요.';
}
