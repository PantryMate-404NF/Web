import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginPage } from './login-page';

describe('LoginPage', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('카카오 로그인은 브라우저 기본 링크 이동으로 시작한다', () => {
    const markup = renderToStaticMarkup(<LoginPage />);

    expect(markup).toContain('href="http://localhost:3000/api/auth/authorize/kakao"');
  });
});
