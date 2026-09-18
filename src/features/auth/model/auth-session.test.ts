import { describe, expect, it, vi } from 'vitest';

import {
  createSingleFlight,
  getApplicableRestoreState,
  getPostAuthenticationRoute,
  getStateFreeHref,
} from './auth-session';

describe('getPostAuthenticationRoute', () => {
  it('온보딩 완료 사용자는 상태 쿼리 없이 홈 루트로 이동한다', () => {
    expect(getPostAuthenticationRoute('complete')).toBe('/');
  });

  it('온보딩 미완료 사용자는 온보딩으로 이동한다', () => {
    expect(getPostAuthenticationRoute('onboarding')).toBe('/onboarding');
  });
});

describe('getStateFreeHref', () => {
  it('로그인 완료 상태 쿼리만 제거하고 나머지 화면 쿼리는 유지한다', () => {
    expect(getStateFreeHref('/recipe', new URLSearchParams('state=complete&tab=imminent'))).toBe(
      '/recipe?tab=imminent',
    );
  });

  it('팬트리 화면의 실제 상태 쿼리는 유지한다', () => {
    expect(getStateFreeHref('/pantry', new URLSearchParams('state=edit&id=pantry-1'))).toBe(
      '/pantry?state=edit&id=pantry-1',
    );
  });
});

describe('getApplicableRestoreState', () => {
  it('명시적 완료 처리 뒤에 끝난 이전 세션 복구 결과는 적용하지 않는다', () => {
    expect(getApplicableRestoreState(0, 1, 'onboarding')).toBeNull();
  });

  it('현재 revision의 세션 복구 결과는 적용한다', () => {
    expect(getApplicableRestoreState(1, 1, 'complete')).toBe('complete');
  });
});

describe('createSingleFlight', () => {
  it('진행 중인 세션 복구 요청을 중복 실행하지 않는다', async () => {
    let resolveRestore: ((value: 'complete') => void) | undefined;
    const restore = vi.fn(
      () =>
        new Promise<'complete'>((resolve) => {
          resolveRestore = resolve;
        }),
    );
    const restoreOnce = createSingleFlight(restore);

    const firstRequest = restoreOnce();
    const secondRequest = restoreOnce();

    expect(restore).toHaveBeenCalledTimes(1);
    expect(secondRequest).toBe(firstRequest);

    resolveRestore?.('complete');
    await firstRequest;
  });

  it('이전 요청이 끝나면 다음 세션 복구 요청을 실행한다', async () => {
    const restore = vi.fn().mockResolvedValue('complete');
    const restoreOnce = createSingleFlight(restore);

    await restoreOnce();
    await restoreOnce();

    expect(restore).toHaveBeenCalledTimes(2);
  });
});
