# 개발 품질 자동화

## 자동화 흐름

```text
작업 시작 → npm run check:workflow
커밋 → Husky(pre-commit, commit-msg)
PR → GitHub Actions(policy-and-quality) + CodeRabbit
병합 → GitHub Ruleset의 승인·필수 검사
```

## 로컬 명령

| 명령                     | 목적                                         |
| ------------------------ | -------------------------------------------- |
| `npm run check:workflow` | 브랜치 형식, 마지막 커밋, 미커밋 변경을 확인 |
| `npm run check`          | 포맷·린트·타입 검사                          |
| `npm run test`           | Vitest 실행                                  |
| `npm run build`          | 프로덕션 빌드                                |

## Husky

- `pre-commit`: `format:check`, `lint`, `typecheck`을 순서대로 실행한다.
- `commit-msg`: `[type] 제목 (#이슈번호)` 형식만 허용한다.
- type은 `feat`, `fix`, `design`, `refactor`, `docs`, `test`, `chore`, `hotfix`만 사용한다.

## Pull Request CI

`policy-and-quality` 검사는 `develop`, `main` 대상 PR에서 아래를 확인한다.

1. `develop` 대상은 `Type/#issue-number/description` 브랜치인지 확인한다.
2. `main` 대상은 `develop` 또는 `release/*` 브랜치인지 확인한다.
3. PR 본문에 `Closes #이슈번호`가 있는지 확인한다.
4. `npm ci`, `npm run check`, `npm run test`, `npm run build`를 실행한다.

## GitHub Ruleset

Ruleset은 이미 GitHub 저장소에 적용되어 있다. 필수 검사 이름은 `policy-and-quality`이며, 사람 승인 1명과 CodeRabbit 리뷰는 서로 대체하지 않는다.

## 자동화하지 않는 검토

- 360px·390px·430px 화면 품질
- 접근성의 실제 사용성
- 기능명세서·API 계약과 화면 동작의 일치
- 제품 정책과 사용자 경험의 적절성

위 항목은 PR 템플릿과 리뷰에서 사람이 확인한다.
