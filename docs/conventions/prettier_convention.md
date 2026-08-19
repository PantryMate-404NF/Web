# Prettier 컨벤션

## 목적

코드 형식 논의를 자동화해 리뷰가 구현과 사용자 경험에 집중되도록 합니다. ESLint는 코드 품질을, Prettier는 코드 형식을 담당합니다.

## 현재 상태

Prettier와 `prettier-plugin-tailwindcss`를 개발 의존성으로 설치했습니다. 저장소 루트의 `.prettierrc`와 `.prettierignore`가 팀 공통 설정이며, `.vscode/settings.json`은 VS Code에서 저장 시 포맷을 활성화합니다.

## 권장 설정

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "tabWidth": 2,
  "printWidth": 100,
  "endOfLine": "lf"
}
```

| 항목      | 값         | 이유                                |
| --------- | ---------- | ----------------------------------- |
| 세미콜론  | 사용       | 문장 경계를 일관되게 표현           |
| 따옴표    | 작은따옴표 | TypeScript·TSX 코드의 일관성        |
| 후행 쉼표 | 모두 사용  | 변경 diff를 작게 유지               |
| 들여쓰기  | 2칸        | React·Tailwind 코드에서 가독성 확보 |
| 줄 길이   | 100자      | 과도한 줄바꿈 완화                  |
| 줄바꿈    | LF         | 운영체제와 CI 차이 방지             |

## 적용 범위

- TypeScript, TSX, JavaScript, JSON, CSS, Markdown, YAML을 포맷 대상에 포함합니다.
- 생성 파일과 의존성 파일은 포맷하지 않습니다: `node_modules`, `.next`, `coverage`, `public/mockServiceWorker.js`.
- `prettier-plugin-tailwindcss`가 Tailwind 클래스 순서를 정렬합니다.

## 팀 사용 방법

- VS Code에서는 Prettier 확장 프로그램(`esbenp.prettier-vscode`)을 설치합니다. 프로젝트 설정에 따라 저장 시 자동 포맷됩니다.
- PR 전에는 변경 파일을 포맷하고, 포맷만을 위한 대규모 변경은 기능 PR과 분리합니다.
- ESLint 오류를 Prettier로 해결하려 하지 않습니다. 두 도구의 책임을 분리합니다.

## 실행 명령과 자동 검사

```bash
npm run format        # 전체 대상 파일 포맷
npm run format:check  # 포맷 여부만 검사
```

Husky의 pre-commit 훅은 `format:check` → `lint` → `typecheck` 순서로 실행됩니다. 포맷이 맞지 않으면 커밋이 중단되므로, 커밋 전에 `npm run format`을 실행합니다.
