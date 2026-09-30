/**
 * 도메인별 MSW 핸들러를 한곳에 등록하는 진입점.
 * 새 API 목업은 도메인별 파일을 만든 뒤 이 배열에 추가.
 */
import type { RequestHandler } from 'msw';

import { authHandlers } from './auth';
import { addressHandlers } from './address';
import { cartHandlers } from './cart';
import { pantryHandlers } from './pantry';
import { recipeHandlers } from './recipe';

export const handlers: RequestHandler[] = [
  ...authHandlers,
  ...addressHandlers,
  ...cartHandlers,
  ...pantryHandlers,
  ...recipeHandlers,
];
