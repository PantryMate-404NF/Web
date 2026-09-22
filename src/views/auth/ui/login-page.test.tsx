import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { LoginPage } from './login-page';

describe('LoginPage', () => {
  it('카카오 로그인은 API Gateway의 authorize URL로 이동한다', () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.com');
    const markup = renderToStaticMarkup(<LoginPage />);

    expect(markup).toContain('href="https://api.example.com/api/auth/authorize/kakao"');
  });
});
