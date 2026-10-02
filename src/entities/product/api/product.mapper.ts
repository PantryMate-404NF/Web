import { isProductStorageType, type ProductDetail } from '../model/types';
import type { ProductDetailDto } from './product.dto';

function formatWeight(dto: ProductDetailDto, fallback: string) {
  if (dto.capacity == null) return fallback;

  const unitLabels: Record<string, string> = {
    EACH: '개',
    GRAM: 'g',
    KILOGRAM: 'kg',
    LITER: 'L',
    MILLILITER: 'ml',
  };
  const packageCount = dto.packageCount && dto.packageCount > 1 ? ` x ${dto.packageCount}개` : '';
  return `${dto.capacity}${unitLabels[dto.unit] ?? dto.unit}${packageCount}`;
}

const storageMethodLabels = {
  FROZEN: '냉동',
  REFRIGERATED: '냉장',
  ROOM_TEMP: '실온',
} as const;

export function toProductDetail(dto: ProductDetailDto, fallback: ProductDetail): ProductDetail {
  const storageType = isProductStorageType(dto.storageType) ? dto.storageType : undefined;

  return {
    ...fallback,
    commerceProductId: dto.productId,
    category: dto.categoryName ?? fallback.category,
    detailImageUrls: dto.images.length > 0 ? dto.images : fallback.detailImageUrls,
    imageUrl: dto.thumbnailUrl ?? fallback.imageUrl,
    thumbnailUrl: dto.thumbnailUrl ?? fallback.thumbnailUrl ?? fallback.imageUrl,
    isAvailable: dto.status === 'ON_SALE' && dto.stockQuantity > 0,
    name: dto.name,
    options: undefined,
    origin: dto.origin ?? fallback.origin,
    price: dto.price,
    summary: dto.description ?? fallback.summary,
    storageMethod: storageType ? storageMethodLabels[storageType] : fallback.storageMethod,
    storageType,
    weight: formatWeight(dto, fallback.weight),
  };
}
