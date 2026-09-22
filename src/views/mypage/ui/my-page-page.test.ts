import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { getOnboardingSetupHref } from './my-page-page';

const myPageSource = readFileSync(
  resolve(process.cwd(), 'src/views/mypage/ui/my-page-page.tsx'),
  'utf8',
);

describe('MyPagePage', () => {
  it('shows the setup entry only to signed-in users who have not completed onboarding', () => {
    expect(getOnboardingSetupHref('onboarding')).toBe('/');
    expect(getOnboardingSetupHref('complete')).toBeNull();
    expect(getOnboardingSetupHref('guest')).toBeNull();
  });

  it('links the profile edit affordance to the registered edit route', () => {
    expect(myPageSource).toContain('href="/mypage/edit"');
    expect(myPageSource).not.toContain('href="/mypage/profile/edit"');
  });

  it('links address management to the address list route without replacing delivery tracking', () => {
    expect(myPageSource).toContain("{ href: '/mypage/addresses', label: '배송지 관리' }");
    expect(myPageSource).not.toContain("{ href: '/mypage/delivery', label: '배송지 관리' }");
  });
});
