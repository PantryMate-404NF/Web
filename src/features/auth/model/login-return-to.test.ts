import { describe, expect, it } from 'vitest';

import { getSafeLoginReturnTo, saveLoginReturnTo, takeLoginReturnTo } from './login-return-to';

function createStorage(): Storage {
  const values = new Map<string, string>();

  return {
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    get length() {
      return values.size;
    },
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

describe('login returnTo', () => {
  it('같은 서비스의 내부 경로만 허용한다', () => {
    expect(getSafeLoginReturnTo('/product/free-range-eggs')).toBe('/product/free-range-eggs');
    expect(getSafeLoginReturnTo('//outside.example')).toBeUndefined();
    expect(getSafeLoginReturnTo('/\\outside.example')).toBeUndefined();
    expect(getSafeLoginReturnTo('/product\\outside.example')).toBeUndefined();
    expect(getSafeLoginReturnTo('https://outside.example')).toBeUndefined();
  });

  it('저장한 복귀 경로를 한 번만 사용한다', () => {
    const storage = createStorage();
    saveLoginReturnTo(storage, '/cart');

    expect(takeLoginReturnTo(storage)).toBe('/cart');
    expect(takeLoginReturnTo(storage)).toBeUndefined();
  });
});
