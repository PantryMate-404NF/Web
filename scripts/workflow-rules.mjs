const BRANCH_TYPE_PATTERN = '(?:Feat|Fix|Design|Refactor|Docs|Test|Chore|Hotfix)';
const ISSUE_NUMBER_PATTERN = '#[1-9][0-9]*';

const WORK_BRANCH_PATTERN = new RegExp(
  `^${BRANCH_TYPE_PATTERN}/${ISSUE_NUMBER_PATTERN}/[a-z0-9]+(?:-[a-z0-9]+)*$`,
);
const RELEASE_BRANCH_PATTERN = /^release\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMMIT_MESSAGE_PATTERN = new RegExp(
  `^\\[(?:feat|fix|design|refactor|docs|test|chore|hotfix)\\]\\s+\\S.*\\s+\\(${ISSUE_NUMBER_PATTERN}\\)$`,
);
const CLOSES_ISSUE_PATTERN = /\bCloses\s+#[1-9][0-9]*\b/i;

function result(errors) {
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateBranchName(branch) {
  if (WORK_BRANCH_PATTERN.test(branch)) {
    return result([]);
  }

  return result([
    '브랜치명은 Type/#issue-number/description 형식이어야 합니다. 예: Feat/#12/pantry-status-page',
  ]);
}

export function validateCommitMessage(message) {
  if (COMMIT_MESSAGE_PATTERN.test(message.trim())) {
    return result([]);
  }

  return result([
    '커밋 메시지는 [type] 제목 (#이슈번호) 형식이어야 합니다. 예: [feat] 팬트리 상태 토글 추가 (#12)',
  ]);
}

export function validatePullRequest({ baseRef, headRef, body }) {
  const errors = [];

  if (baseRef === 'develop') {
    errors.push(...validateBranchName(headRef).errors);
  } else if (baseRef === 'main') {
    if (headRef !== 'develop' && !RELEASE_BRANCH_PATTERN.test(headRef)) {
      errors.push('main 대상 PR은 develop 또는 release/* 브랜치에서만 생성할 수 있습니다.');
    }
  } else {
    errors.push('PR base branch는 develop 또는 main이어야 합니다.');
  }

  if (!CLOSES_ISSUE_PATTERN.test(body ?? '')) {
    errors.push('PR 본문에 Closes #이슈번호를 작성해야 합니다.');
  }

  return result(errors);
}
