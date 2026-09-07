/**
 * 모바일 화면 루트가 공통 390px·좌우 16px 레이아웃 클래스를 사용하는지 검증합니다.
 */
import { describe, expect, it } from 'vitest';

// @ts-expect-error Node가 실행하는 ESM 검사 스크립트는 별도 TypeScript 선언 파일을 두지 않습니다.
import { findMobilePageViolations } from './check-mobile-layout.mjs';

describe('findMobilePageViolations', () => {
  it('mobile-page 클래스가 없는 화면 루트를 위반으로 판별한다', () => {
    const source = '<main className="bg-background min-h-dvh">내용</main>';

    expect(findMobilePageViolations(source, 'src/views/example/ui/example-page.tsx')).toEqual([
      'src/views/example/ui/example-page.tsx: mobile-page 클래스가 없는 화면 루트가 있습니다.',
    ]);
  });
});
