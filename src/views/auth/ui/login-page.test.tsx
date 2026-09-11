import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { LoginPage } from './login-page';

describe('LoginPage', () => {
  it('카카오 로그인은 로컬 프록시의 브라우저 기본 링크 이동으로 시작한다', () => {
    const markup = renderToStaticMarkup(<LoginPage />);

    expect(markup).toContain('href="/api/auth/authorize/kakao"');
  });
});
