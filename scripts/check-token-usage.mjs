import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { resolve } from 'node:path';

const uiFiles = globSync('src/**/*.{ts,tsx}', {
  cwd: process.cwd(),
  exclude: ['**/*.test.ts', '**/*.test.tsx'],
});

const forbiddenPatterns = [
  /\bbg-white\b/g,
  /\btext-white\b/g,
  /\btext-\[#(?:131313|68696d|5d5e63)\]/gi,
  /\bbg-\[#(?:6baa62|f3f4f5)\]\b/gi,
  /\bborder-\[#e9e9eb\]\b/gi,
  /\btext-\[(?:10|11)px\]/g,
];

const violations = uiFiles.flatMap((file) => {
  const source = readFileSync(resolve(file), 'utf8');

  return forbiddenPatterns.flatMap((pattern) => {
    const matches = [...source.matchAll(pattern)];
    return matches.map((match) => `${file}: ${match[0]}`);
  });
});

if (violations.length > 0) {
  console.error('토큰 사용 검사 실패: 실제 UI 역할에 직접 색상 utility를 사용할 수 없습니다.');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log('토큰 사용 검사 통과: 실제 UI 역할에 semantic token utility를 사용합니다.');
