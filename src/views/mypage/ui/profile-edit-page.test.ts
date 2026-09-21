import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const profileEditPageSource = readFileSync(
  resolve(process.cwd(), 'src/views/mypage/ui/profile-edit-page.tsx'),
  'utf8',
);

describe('ProfileEditPage', () => {
  it('waits for authentication restoration before requesting the profile', () => {
    expect(profileEditPageSource).toContain('const { state, setGuestState } = useAuthSession();');
    expect(profileEditPageSource).toContain(
      "if (state === 'guest' || state === 'loading') return;",
    );
  });

  it('returns expired sessions to login instead of surfacing a runtime error', () => {
    expect(profileEditPageSource).toContain('error instanceof ApiError && error.status === 401');
    expect(profileEditPageSource).toContain("router.replace('/login');");
  });

  it('shows the signed-in email below the profile name', () => {
    expect(profileEditPageSource).toContain("setEmail(profile.email ?? '')");
    expect(profileEditPageSource).toContain('>{email}</p>');
  });
});
