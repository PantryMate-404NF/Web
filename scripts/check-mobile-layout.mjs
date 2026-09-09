import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mobileLayoutFiles = [
  'src/views/cart/ui/cart-page.tsx',
  'src/views/auth/ui/login-page.tsx',
  'src/views/cooking/ui/cooking-complete-page.tsx',
  'src/views/home/ui/home-page.tsx',
  'src/views/mypage/ui/delivery-tracking-page.tsx',
  'src/views/mypage/ui/order-history-page.tsx',
  'src/views/pantry/ui/pantry-flow-page.tsx',
  'src/views/pantry/ui/pantry-page.tsx',
  'src/views/recipe/ui/ingredient-selection-page.tsx',
  'src/views/recipe/ui/recipe-detail-page.tsx',
  'src/views/recipe/ui/recipe-list-page.tsx',
  'src/views/search/ui/search-page.tsx',
  'src/widgets/app-shell/ui/mobile-screen.tsx',
  'src/widgets/pantry-list/ui/pantry-loading-skeleton.tsx',
];

export function findMobilePageViolations(source, filePath) {
  const pageRoots = [...source.matchAll(/<main\b(?<attributes>[\s\S]*?)>/g)];

  if (pageRoots.length === 0) {
    return [`${filePath}: main 화면 루트가 없습니다.`];
  }

  return pageRoots.flatMap(({ groups }) => {
    const attributes = groups?.attributes ?? '';
    const className = getStaticClassName(attributes);

    if (className === undefined) {
      return [`${filePath}: mobile-page 클래스를 정적으로 확인할 수 없는 화면 루트가 있습니다.`];
    }

    return className.split(/\s+/).includes('mobile-page')
      ? []
      : [`${filePath}: mobile-page 클래스가 없는 화면 루트가 있습니다.`];
  });
}

/** 정적 문자열로 작성된 JSX className 속성만 추출합니다. */
function getStaticClassName(attributes) {
  const match = attributes.match(
    /\bclassName\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*["']([^"']*)["']\s*\}|\{\s*`([^`$]*)`\s*\})/,
  );

  return match ? (match[1] ?? match[2] ?? match[3] ?? match[4]) : undefined;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const violations = mobileLayoutFiles.flatMap((filePath) =>
    findMobilePageViolations(readFileSync(resolve(filePath), 'utf8'), filePath),
  );

  if (violations.length > 0) {
    console.error('모바일 레이아웃 검사 실패: 화면 루트는 mobile-page 클래스를 사용해야 합니다.');
    for (const violation of violations) console.error(`- ${violation}`);
    process.exit(1);
  }

  console.log('모바일 레이아웃 검사 통과: 화면 콘텐츠의 기준 폭과 좌우 여백을 확인했습니다.');
}
