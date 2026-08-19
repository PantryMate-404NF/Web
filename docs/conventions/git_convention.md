# Git 컨벤션

## 목적

작업 단위와 변경 이력을 일관되게 관리해 리뷰, 배포, 이슈 추적을 쉽게 합니다.

## 기본 브랜치

| 브랜치                           | 용도                         | 병합 대상         |
| -------------------------------- | ---------------------------- | ----------------- |
| `main`                           | 운영·배포 기준 코드          | 직접 작업 금지    |
| `develop`                        | 다음 배포를 위한 통합 브랜치 | 기능 브랜치       |
| `release/*`                      | 배포 준비 및 긴급 안정화     | `main`, `develop` |
| `Type/#issue-number/description` | 개별 작업 브랜치             | `develop`         |

`main`, `develop`에는 직접 push하지 않고 Pull Request로만 병합합니다.

## 브랜치 이름

```text
Type/#issue-number/short-description
```

- `Type`: 이슈 템플릿의 작업 유형. 대표적으로 `Feat`, `Fix`, `Design`, `Refactor`, `Docs`, `Test`, `Chore`, `Hotfix`를 사용
- `issue-number`: 연결된 GitHub Issue 번호
- `short-description`: 영문 소문자와 하이픈(`-`)으로 간결하게 작성

```text
Feat/#42/pantry-status-card
Fix/#57/cart-item-quantity
Design/#18/recipe-card-spacing
```

## 커밋 메시지

Conventional Commits 형식을 사용합니다.

```text
type(scope): 변경 요약
```

- 제목은 한글 또는 영문으로 작성하고 마침표는 생략합니다.
- 한 커밋에는 하나의 의도를 담습니다.
- `WIP`, `수정`, `fix`처럼 의미가 불명확한 제목은 사용하지 않습니다.

```text
feat(pantry): 재료 상태 확인 바텀시트 추가
fix(cart): 장바구니 수량 변경 후 합계 갱신
docs(api): 레시피 응답 계약 예시 보완
refactor(products): 상품 카드 공통 컴포넌트 분리
test(recipes): 부족 재료 계산 테스트 추가
chore: 의존성 버전 갱신
```

필요한 경우 본문에 변경 이유와 영향 범위를 작성합니다.

## Pull Request 규칙

- 일반 작업 PR은 `Type/*`에서 `develop`으로 생성합니다.
- 배포 PR은 `develop` 또는 `release/*`에서 `main`으로 생성합니다.
- PR 템플릿의 작업 결과, 백엔드 연동, 테스트, 관련 이슈를 빠짐없이 작성합니다.
- 리뷰어 1명 이상의 승인 후 병합합니다.
- CodeRabbit 1차 리뷰와 반영 내용을 확인한 뒤 Discord에 공유합니다.
- 병합 전에는 충돌, 린트, 타입 오류를 해결합니다.

## 병합 방식

- 기능 작업은 기본적으로 **Squash and merge**를 사용합니다.
- 배포·릴리스 브랜치의 병합 방식은 팀 논의에 따라 예외로 둘 수 있습니다.
- 병합 후 원격 기능 브랜치는 삭제합니다.
