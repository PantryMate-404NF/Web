import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const globalsPath = resolve('src/app/globals.css');
const globals = readFileSync(globalsPath, 'utf8');

const requiredTokens = [
  "font-family: 'Pretendard';",
  "PretendardVariable.woff2') format('woff2')",
  '--primitive-yellow-500: #ffcd55;',
  '--primitive-yellow-1000: #59481e;',
  '--primitive-green-500: #d4e59e;',
  '--primitive-green-1000: #4a5037;',
  '--primitive-blue-050: #f6faff;',
  '--primitive-blue-100: #f2f7ff;',
  '--primitive-blue-200: #e4effe;',
  '--primitive-blue-400: #a9cbfd;',
  '--primitive-blue-500: #98b7e4;',
  '--primitive-blue-600: #87a2ca;',
  '--primitive-blue-700: #7f98be;',
  '--primitive-blue-800: #657a98;',
  '--primitive-blue-900: #4c5b72;',
  '--primitive-blue-950: #3b4759;',
  '--primitive-red-050: #fff7f7;',
  '--primitive-red-075: #fff3f3;',
  '--primitive-red-100: #ffe6e6;',
  '--primitive-red-400: #ffadae;',
  '--primitive-red-500: #e69c9d;',
  '--primitive-red-950: #593d3d;',
  '--layout-mobile-inline-padding: 1rem;',
  '--layout-desktop-content-max-width: 75rem;',
  '--typography-hero-size: 1.75rem;',
  '--typography-h1-size: 1.625rem;',
  '--typography-title-1-size: 1.5rem;',
  '--typography-body-3-size: 1rem;',
  '--typography-label-4-size: 0.8125rem;',
  '--line-height-title: 1.5;',
  '--line-height-body: 1.6;',
  '--line-height-label: 1.5;',
  '--background-primary: var(--primitive-white);',
  '--text-primary: var(--primitive-grey-900);',
  '--action-primary: var(--primitive-yellow-500);',
  '--action-secondary: var(--primitive-green-500);',
  '--action-secondary-hover: var(--primitive-green-600);',
  '--status-danger: var(--primitive-red-400);',
  '--status-danger-hover: var(--primitive-red-500);',
  '.dark {',
  '--background-primary: var(--primitive-grey-900);',
  "--font-sans: 'Pretendard', sans-serif;",
  '--breakpoint-tablet: 48rem;',
  '--breakpoint-desktop: 64rem;',
];

const missingTokens = requiredTokens.filter((token) => !globals.includes(token));

if (missingTokens.length > 0) {
  console.error('디자인 토큰 검사 실패: globals.css에 필수 토큰이 없습니다.');
  for (const token of missingTokens) {
    console.error(`- ${token}`);
  }
  process.exit(1);
}

console.log(
  '디자인 토큰 검사 통과: Pretendard, 색상, 라이트/다크 테마, 반응형 토큰을 확인했습니다.',
);
