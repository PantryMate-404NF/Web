# AGENTS.md

## 목적

- [ ] 이 문서는 AI Pantry 개발자가 작업 전에 빠르게 확인하는 협업 체크리스트다.
- [ ] 로컬에서 참고하는 운영 문서이며, 팀의 이슈/브랜치/PR/구현 규칙을 정리한다.
- [ ] 새로운 작업을 시작하기 전, PR 올리기 전 반드시 한 번씩 확인한다.

## 작업 시작 전

- [ ] 작업 전 관련 이슈가 있는지 확인한다.
- [ ] 이슈가 없다면 이슈 템플릿으로 먼저 생성하고 작업 목적과 완료 기준을 적는다.
- [ ] 작업 범위가 크면 하위 이슈로 쪼갤 수 있는지 먼저 판단한다.
- [ ] 작업 시작 전 `develop` 기준인지 확인한다.
- [ ] 현재 브랜치와 로컬 변경 사항을 확인하고, unrelated 변경은 건드리지 않는다.

## 브랜치 / 이슈 규칙

- [ ] 브랜치명은 `Type/#issue-number/description` 형식을 사용한다.
- [ ] 예시: `Feat/#123/pantry-status-page`
- [ ] 작업 유형은 이슈 템플릿 기준을 따른다.
- [ ] 새 기능, 새 페이지, 실제 사용자 흐름 추가는 `Feat`를 우선 고려한다.
- [ ] UI 보정, 스타일 수정, 마크업 조정 중심 작업은 `Design`을 고려한다.
- [ ] 브랜치 생성 전 이슈 번호가 확정되어 있어야 한다.
- [ ] 이슈 생성 → 이슈 브랜치 생성 → 구현·커밋 → 해당 이슈를 닫는 PR 생성 순서를 따른다.
- [ ] 가능하면 이슈 본문에 작업 배경, To Do, 완료 기준을 비워두지 않는다.
- [ ] 상위 기능 단위가 있으면 parent issue를 연결한다.

## 구현 규칙

- [ ] 현재 코드베이스의 패턴을 먼저 읽고 맞춘다.
- [ ] 새 기능보다 기존 구조와 일관성을 우선한다.
- [ ] 불필요한 리팩토링은 하지 않는다.
- [ ] 작업 범위와 직접 관련 없는 파일은 수정하지 않는다.
- [ ] 임시 코드, 죽은 코드, 사용하지 않는 import를 남기지 않는다.
- [ ] `console.log`는 PR 전에 제거한다.
- [ ] 타입 우회를 위한 `any` 남발을 피한다.
- [ ] 접근성, 빈 상태, 에러 상태, 로딩 상태를 필요한 범위에서 고려한다.
- [ ] 더미 데이터가 필요하면 실제 도메인 구조에 가깝게 만든다.
- [ ] 피그마 구현 시 spacing, radius, typography, hierarchy를 최대한 맞춘다.

## 제품 규칙

- [ ] 390 × 844 CSS px를 디자인 기준으로 사용하되, 360px·390px·430px에서 가로 스크롤 없이 동작하게 한다.
- [ ] 팬트리의 요리 가능 여부(`ON`/`OFF`), 소비기한 상태(`정상`/`임박`/`경과`/`미등록`), 등록 방식(`자동`/`수동`)은 서로 분리해 관리한다.
- [ ] 소비기한 경과만으로 팬트리 항목을 자동 삭제하거나 요리 가능 상태를 자동 변경하지 않는다.
- [ ] MVP에서 수량을 모르는 재료의 정확한 잔여량을 추정하거나 자동 차감하지 않는다.
- [ ] 자주 구매한 상품은 제안만 하며, 사용자 확인 없이 장바구니에 추가하지 않는다.
- [ ] REST API 명세를 기준으로 하고, API 타입·요청 함수·MSW handler를 함께 갱신한다.

## 코드 구조 규칙

- [ ] 프로젝트는 FSD(Feature-Sliced Design) 구조를 따른다.
- [ ] Next.js App Router 라우팅 파일은 `src/app`에 둔다.
- [ ] 페이지 단위 조합은 `src/views`에 둔다.
- [ ] 재사용 가능한 큰 UI 블록은 `src/widgets`에 둔다.
- [ ] 기능 단위 사용자 행동은 `src/features`에 둔다.
- [ ] 도메인 모델과 도메인 단위 UI는 `src/entities`에 둔다.
- [ ] 공통 UI는 `src/shared/ui`에 둔다.
- [ ] 공통 유틸, 클라이언트, 설정은 `src/shared/lib`에 둔다.
- [ ] 새 파일을 만들 때 "이 로직이 정말 이 레이어에 맞는가"를 먼저 확인한다.
- [ ] 페이지에서 모든 UI를 한 파일에 몰아넣지 않는다.
- [ ] 반복되는 블록은 적절한 단위로 분리한다.
- [ ] 특정 화면 전용 조합 로직은 `views` 또는 `widgets`에 둔다.
- [ ] 전역 공용이 아닌 코드를 성급하게 `shared`로 올리지 않는다.

## FSD 의존 방향 규칙

- [ ] 의존 방향은 `app → views → widgets → features → entities → shared`를 따른다.
- [ ] 상위 레이어가 하위 레이어를 import 한다.
- [ ] 하위 레이어가 상위 레이어를 import 하지 않는다.
- [ ] `shared`는 가장 아래 공통 레이어로 사용한다.
- [ ] 특정 페이지 문맥이 필요한 코드를 `shared`에 두지 않는다.
- [ ] import가 어색하면 파일 위치가 잘못된 것인지 먼저 의심한다.

## UI / 스타일 규칙

- [ ] Tailwind CSS v4와 현재 프로젝트 스타일 방식을 따른다.
- [ ] 가능하면 기존 `shared/ui`와 shadcn/ui 컴포넌트를 우선 활용한다.
- [ ] 같은 역할의 버튼, 입력창, 카드가 이미 있으면 새로 만들기 전에 재사용 가능성을 본다.
- [ ] spacing, font-size, radius, shadow는 화면마다 제각각 만들지 않는다.
- [ ] 페이지를 빠르게 완성하기 위해 하드코딩하더라도, 반복 패턴은 정리 가능한 구조로 둔다.
- [ ] 피그마 기반 작업 시 아이콘, 간격, 정렬, 컬럼 구조를 눈대중으로 바꾸지 않는다.
- [ ] 반응형이 요구 범위라면 최소 desktop/mobile 기준은 확인한다.
- [ ] 스타일만 맞고 구조가 불안정한 구현은 피한다.

## 검증 명령

- [ ] 작업 중간에 로컬 렌더링으로 화면을 확인한다.
- [ ] PR 전 아래 명령을 기준으로 검증한다.

```bash
npm run lint
npm run typecheck
npm run format:check
npm run check
npm run check:workflow
npm run test
npm run build
```

- [ ] 포맷 수정이 필요하면 `npm run format`을 사용한다.
- [ ] 검증 실패 상태로 PR을 올리지 않는다.
- [ ] 화면 작업은 가능하면 주요 시나리오를 직접 클릭해 본다.

## PR 전 체크

- [ ] PR base branch가 올바른지 확인한다.
- [ ] 브랜치명이 `Type/#issue-number/description` 형식을 따르는지 확인한다.
- [ ] 커밋 메시지가 팀 컨벤션과 맞는지 확인한다.
- [ ] 커밋 메시지가 `[type] 제목 (#이슈번호)` 형식인지 확인한다.
- [ ] 이슈와 PR이 연결되어 있는지 확인한다.
- [ ] 작업 내용, 결과, 백엔드 연동, 테스트 내용을 PR 템플릿에 맞게 작성한다.
- [ ] 로컬 실행 확인 여부를 체크한다.
- [ ] 영향 범위를 한 번 더 점검한다.
- [ ] 불필요한 주석, 임시 코드, 디버깅 출력이 없는지 확인한다.
- [ ] CodeRabbit 리뷰 확인 및 반영 프로세스를 따른다.
- [ ] 최소 1명 이상의 approve 이후 merge 한다.

## 금지 사항

- [ ] 이슈 없이 바로 브랜치를 파고 큰 작업을 시작하지 않는다.
- [ ] unrelated 변경을 정리한다는 이유로 남의 작업을 건드리지 않는다.
- [ ] 레이어 규칙을 무시한 import를 추가하지 않는다.
- [ ] 재사용 가능성 검토 없이 유사 컴포넌트를 중복 생성하지 않는다.
- [ ] 타입 에러, 린트 에러를 남긴 채 PR하지 않는다.
- [ ] 피그마와 다른데 "나중에 맞추자"는 상태로 핵심 화면을 넘기지 않는다.
- [ ] 동작 확인 없이 "확인 완료"라고 적지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
