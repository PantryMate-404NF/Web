import { readFileSync, readdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

function getUiFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = resolve(directory, entry.name);

    if (entry.isDirectory()) {
      return getUiFiles(entryPath);
    }

    if (!/\.(?:ts|tsx)$/.test(entry.name) || /\.test\.tsx?$/.test(entry.name)) {
      return [];
    }

    return [entryPath];
  });
}

export const forbiddenPatterns = [
  /\bbg-white\b/g,
  /\btext-white\b/g,
  /\btext-\[#(?:131313|68696d|5d5e63)\]/gi,
  /\bbg-\[#(?:6baa62|f3f4f5)\]/gi,
  /\bborder-\[#e9e9eb\]/gi,
  /\btext-\[(?:10|11)px\]/g,
];

export function findForbiddenUtilities(source) {
  return forbiddenPatterns.flatMap((pattern) =>
    [...source.matchAll(pattern)].map((match) => match[0]),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const uiFiles = getUiFiles(resolve('src'));
  const violations = uiFiles.flatMap((file) => {
    const source = readFileSync(file, 'utf8');
    const relativePath = relative(process.cwd(), file);

    return findForbiddenUtilities(source).map((utility) => `${relativePath}: ${utility}`);
  });

  if (violations.length > 0) {
    console.error('토큰 사용 검사 실패: 실제 UI 역할에 직접 색상 utility를 사용할 수 없습니다.');
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log('토큰 사용 검사 통과: 실제 UI 역할에 semantic token utility를 사용합니다.');
}
