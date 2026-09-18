import { describe, expect, it } from 'vitest';

import { hasPreviousHistoryEntry } from './back-button';

describe('hasPreviousHistoryEntry', () => {
  it('현재 문서 이전에 방문한 기록이 있으면 true를 반환한다', () => {
    expect(hasPreviousHistoryEntry(2)).toBe(true);
  });

  it('직접 진입한 화면은 fallback 경로를 사용하도록 false를 반환한다', () => {
    expect(hasPreviousHistoryEntry(1)).toBe(false);
  });
});
