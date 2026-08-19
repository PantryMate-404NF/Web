import type { RequestHandler } from 'msw';

// Add one handler module per domain as the REST API contract is agreed.
export const handlers: RequestHandler[] = [];
