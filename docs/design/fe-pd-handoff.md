# FE·PD 핸드오프 적용 기준

## 목적

이 문서는 FE·PD 핸드오프 문서 중 구현이 확정된 상태 규칙을 코드와 연결한다. 색상, Typography, Spacing 등의 시각 토큰은 [디자인 시스템](./design-system.md)을 기준으로 한다.

## 상태 구분

| 분류          | 상태                                                   | FE 적용 위치                            |
| ------------- | ------------------------------------------------------ | --------------------------------------- |
| 데이터 상태   | `loading`, `content`, `empty`, `error`, `unauthorized` | `src/shared/model/ui-state.ts`          |
| 인터랙션 상태 | `default`, `pressed`, `disabled`, `loading`            | 공용 Button과 입력 컴포넌트의 상태 기준 |

같은 `loading`이라도 데이터 상태는 페이지·목록의 요청 진행을, 인터랙션 상태는 단일 액션 요청 진행을 의미한다.

## 현재 코드 적용

| 항목             | 코드 위치                             | 적용 기준                                                                                                     |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 공용 데이터 상태 | `src/shared/model/ui-state.ts`        | 화면 데이터 결과를 `loading / content / empty / error / unauthorized`로 구분한다.                             |
| Skeleton         | `src/shared/ui/skeleton.tsx`          | 개별 placeholder는 `aria-hidden`으로 숨기고, 팬트리 목록 컨테이너가 `aria-busy`로 로딩 상태를 알린다.         |
| 중복 요청 방지   | `src/components/ui/button.tsx`        | 요청 중에는 기존 `disabled` prop을 사용한다. 별도의 spinner 또는 Loading 문구는 PD 확정 후 추가한다.          |
| 팬트리 목록      | `src/views/pantry/ui/pantry-page.tsx` | Loading·Content·Empty·Error를 분기하고, Error 상태에서는 선택적 `onRetry` 콜백을 기존 재시도 버튼에 연결한다. |

## 화면 상태 처리

| 상황                   | 화면 처리                                    |
| ---------------------- | -------------------------------------------- |
| 최초 데이터 조회       | Skeleton UI                                  |
| 데이터 존재            | Content UI                                   |
| 정상 응답 + 빈 배열    | Empty UI + 화면별 우선 CTA                   |
| 조회 실패              | Error UI + 기존 Retry CTA (선택적 `onRetry`) |
| 인증 실패              | 인증 갱신 또는 로그인 화면 이동              |
| 등록·수정·삭제 요청 중 | 해당 Action Button `disabled`                |

## PD·FE 협의 대기 항목

아래 항목은 공통 원칙만 합의됐으며, 디자인 산출물 또는 API 계약이 확정된 뒤 구현한다.

| 항목             | 필요한 결정                                       |
| ---------------- | ------------------------------------------------- |
| Button Loading   | spinner, 문구 변경 여부, Disabled와의 시각적 차이 |
| Error Retry      | 화면별 Retry CTA의 문구·위치·노출 조건            |
| Empty            | 화면별 문구·이미지·우선 CTA                       |
| Toast / Feedback | 위치, 지속 시간, 중복 우선순위, Action 유무       |
| Unauthorized     | 토큰 재발급 실패 후 안내와 복귀 경로              |
| 이미지 예외      | 기본 이미지, 로딩 실패, 긴 텍스트·말줄임 기준     |

## 제외 범위

- Toast 및 Feedback Message 신규 UI
- Error·Empty 상태의 신규 시각 디자인
- 실제 API 재시도 및 서버 상태 라이브러리 연결
- 조리 완료 재안내 기능
