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

  it('속성 순서와 여러 줄 JSX 속성에서도 mobile-page 클래스를 확인한다', () => {
    const source = `<main
      aria-label="예시 화면"
      className={'mobile-page bg-background'}
    >내용</main>`;

    expect(findMobilePageViolations(source, 'src/views/example/ui/example-page.tsx')).toEqual([]);
  });

  it('여러 줄 JSX 속성에서 mobile-page가 빠지면 위반으로 판별한다', () => {
    const source = `<main
      aria-label="예시 화면"
      className={'bg-background'}
    >내용</main>`;

    expect(findMobilePageViolations(source, 'src/views/example/ui/example-page.tsx')).toEqual([
      'src/views/example/ui/example-page.tsx: mobile-page 클래스가 없는 화면 루트가 있습니다.',
    ]);
  });

  it('mobile-page--padded만 사용한 화면 루트를 위반으로 판별한다', () => {
    const source = '<main className="mobile-page--padded bg-background">내용</main>';

    expect(findMobilePageViolations(source, 'src/views/example/ui/example-page.tsx')).toEqual([
      'src/views/example/ui/example-page.tsx: mobile-page 클래스가 없는 화면 루트가 있습니다.',
    ]);
  });

  it('main 화면 루트가 없는 파일을 위반으로 판별한다', () => {
    expect(
      findMobilePageViolations('<section>내용</section>', 'src/views/example/ui/example-page.tsx'),
    ).toEqual(['src/views/example/ui/example-page.tsx: main 화면 루트가 없습니다.']);
  });

  it('동적 className은 mobile-page 포함 여부를 확인할 수 없으므로 위반으로 판별한다', () => {
    const source = '<main className={pageClassName}>내용</main>';

    expect(findMobilePageViolations(source, 'src/views/example/ui/example-page.tsx')).toEqual([
      'src/views/example/ui/example-page.tsx: mobile-page 클래스를 정적으로 확인할 수 없는 화면 루트가 있습니다.',
    ]);
  });
});
