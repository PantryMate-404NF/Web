import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const globalsPath = resolve('src/app/globals.css');
const globals = readFileSync(globalsPath, 'utf8');

const requiredTokens = [
  "font-family: 'Pretendard';",
  "PretendardVariable.woff2') format('woff2')",
  '--primitive-primary-50: #fcf9f3;',
  '--primitive-primary-500: #ffcd55;',
  '--primitive-primary-900: #765913;',
  '--primitive-secondary-50: #f9fbf4;',
  '--primitive-secondary-500: #c2db76;',
  '--primitive-secondary-900: #485328;',
  '--primitive-grey-50: #fbfbfb;',
  '--primitive-grey-900: #1c1c1e;',
  '--primitive-success-500: #3a9e5f;',
  '--primitive-warning-500: #cc7010;',
  '--primitive-error-500: #e04840;',
  '--primitive-info-500: #3a8ec8;',
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
  '--action-primary: var(--primitive-primary-500);',
  '--action-secondary: var(--primitive-secondary-500);',
  '--action-secondary-hover: var(--primitive-secondary-600);',
  '--status-success: var(--primitive-success-500);',
  '--status-warning: var(--primitive-warning-500);',
  '--status-danger: var(--primitive-error-500);',
  '--status-info: var(--primitive-info-500);',
  '--status-danger-hover: var(--primitive-error-600);',
  '--destructive: var(--status-danger);',
  '--accent: var(--surface-subtle);',
  '--input: var(--border-default);',
  '--popover: var(--surface-default);',
  '--text-body-4: var(--typography-body-4-size);',
  '--text-label-4: var(--typography-label-4-size);',
  '.dark {',
  '--background-primary: var(--primitive-grey-900);',
  '--text-primary: var(--primitive-grey-50);',
  "--font-sans: 'Pretendard', sans-serif;",
  '--breakpoint-tablet: 48rem;',
  '--breakpoint-desktop: 64rem;',
  '--skeleton-container: #eff0f4;',
  '@keyframes skeleton-sweep {',
  '.skeleton--animated {',
  'background: #e0e0e0;',
  'transparent 20%,',
  'transform: translate3d(-65%, -65%, 0);',
  'transform: translate3d(65%, 65%, 0);',
  'animation: skeleton-sweep 1.6s ease-in-out infinite;',
  '@media (prefers-reduced-motion: reduce) {',
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
