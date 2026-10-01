import { describe, expect, it } from 'vitest';

import {
  validateBranchName,
  validateCommitMessage,
  validatePullRequest,
} from './workflow-rules.mjs';

describe('validateBranchName', () => {
  it('허용된 작업 브랜치를 통과시킨다', () => {
    expect(validateBranchName('Feat/#12/pantry-status-page')).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('잘못된 Type과 설명 형식을 거부한다', () => {
    expect(validateBranchName('feat/#12/pantry-status-page').valid).toBe(false);
    expect(validateBranchName('Feat/#12/Pantry-Status').valid).toBe(false);
  });
});

describe('validateCommitMessage', () => {
  it('이슈 번호가 포함된 규격 커밋 메시지를 통과시킨다', () => {
    expect(validateCommitMessage('[feat] 팬트리 상태 토글 추가 (#12)')).toEqual({
      valid: true,
      errors: [],
    });
  });

  it('규격이 아닌 커밋 메시지를 거부한다', () => {
    expect(validateCommitMessage('feat: 팬트리 상태 토글 추가').valid).toBe(false);
    expect(validateCommitMessage('[feat] 팬트리 상태 토글 추가').valid).toBe(false);
  });
});

describe('validatePullRequest', () => {
  it('작업 브랜치에서 main으로 향하는 이슈 연결 PR을 통과시킨다', () => {
    expect(
      validatePullRequest({
        baseRef: 'main',
        headRef: 'Feat/#12/pantry-status-page',
        body: '## 관련 이슈\n\nCloses #12',
      }),
    ).toEqual({ valid: true, errors: [] });
  });

  it('main이 아닌 대상으로 향하는 PR을 거부한다', () => {
    const result = validatePullRequest({
      baseRef: 'develop',
      headRef: 'Feat/#12/pantry-status-page',
      body: 'Closes #12',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PR base branch는 main이어야 합니다.');
  });

  it('유효한 작업 브랜치가 아니면 main 대상 PR을 거부한다', () => {
    const result = validatePullRequest({
      baseRef: 'main',
      headRef: 'develop',
      body: 'Closes #12',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      '브랜치명은 Type/#issue-number/description 형식이어야 합니다. 예: Feat/#12/pantry-status-page',
    );
  });

  it('PR 본문에 이슈 연결이 없으면 거부한다', () => {
    const result = validatePullRequest({
      baseRef: 'main',
      headRef: 'Feat/#12/pantry-status-page',
      body: '작업 설명',
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('PR 본문에 Closes #이슈번호를 작성해야 합니다.');
  });
});
