import { readFileSync } from 'node:fs';

import { validateCommitMessage } from './workflow-rules.mjs';

const messageFilePath = process.argv[2];

if (!messageFilePath) {
  console.error('커밋 메시지 파일 경로가 필요합니다.');
  process.exit(1);
}

const firstMessageLine = readFileSync(messageFilePath, 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .find((line) => line && !line.startsWith('#'));

const result = validateCommitMessage(firstMessageLine ?? '');

if (!result.valid) {
  console.error('커밋 메시지 검증에 실패했습니다.');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}
