import { execFileSync } from 'node:child_process';

import { validateBranchName, validateCommitMessage } from './workflow-rules.mjs';

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function printResult(label, value, isValid) {
  const marker = isValid ? '✓' : '⚠';
  console.log(`${marker} ${label}: ${value}`);
}

const branch = git('branch', '--show-current');
const branchResult = validateBranchName(branch);
const changedFiles = git('status', '--short');
const latestCommit = git('log', '-1', '--pretty=%s');
const commitResult = validateCommitMessage(latestCommit);

console.log('AI Pantry 작업 흐름 점검');
console.log('');

printResult('현재 브랜치', branch, branchResult.valid);
for (const error of branchResult.errors) {
  console.log(`  - ${error}`);
}

printResult('마지막 커밋', latestCommit, commitResult.valid);
if (!commitResult.valid) {
  console.log('  - 새 커밋은 [type] 제목 (#이슈번호) 형식으로 작성해야 합니다.');
}

if (changedFiles) {
  console.log('⚠ 작업 트리: 미커밋 변경이 있습니다.');
  console.log(changedFiles);
} else {
  console.log('✓ 작업 트리: 깨끗합니다.');
}

if (!branchResult.valid) {
  process.exitCode = 1;
}
