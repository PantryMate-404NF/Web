import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const myPageSource = readFileSync(
  resolve(process.cwd(), 'src/views/mypage/ui/my-page-page.tsx'),
  'utf8',
);

describe('MyPagePage', () => {
  it('links the profile edit affordance to the registered edit route', () => {
    expect(myPageSource).toContain('href="/mypage/edit"');
    expect(myPageSource).not.toContain('href="/mypage/profile/edit"');
  });
});
