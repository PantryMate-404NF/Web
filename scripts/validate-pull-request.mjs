import { validatePullRequest } from './workflow-rules.mjs';

const result = validatePullRequest({
  baseRef: process.env.PR_BASE_REF,
  headRef: process.env.PR_HEAD_REF,
  body: process.env.PR_BODY,
});

if (!result.valid) {
  console.error('Pull Request 정책 검증에 실패했습니다.');
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Pull Request 정책 검증을 통과했습니다.');
