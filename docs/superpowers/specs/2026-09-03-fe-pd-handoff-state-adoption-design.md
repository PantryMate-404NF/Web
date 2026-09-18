# FE·PD 핸드오프 상태 규칙 적용 설계

## 목적

FE·PD 핸드오프 문서에서 확정된 상태 구분을 현재 팬트리 화면과 공용 UI에 반영한다. 기존 Error Retry CTA는 유지하고 콜백 연결만 제공한다. 아직 디자인 확정이 필요한 Toast, Retry CTA의 신규 시각 디자인, Empty 일러스트는 구현하지 않는다.

## 적용 범위

### 코드

- `Loading / Content / Empty / Error / Unauthorized` 데이터 상태와 컴포넌트 인터랙션 상태를 구분하는 공용 타입을 제공한다.
- 기존 `Skeleton`의 `aria-hidden`과 팬트리 로딩 영역의 `aria-busy`를 유지한다. 이미 접근성 기준을 충족하므로 중복 변경하지 않는다.
- 기존 `Button`의 `disabled` 동작을 요청 중 중복 실행 방지의 공통 기준으로 사용한다. Loading의 별도 prop·시각 디자인은 추가하지 않는다.
- 팬트리 Error 상태는 기존 `다시 시도` CTA를 유지하고, 향후 API 재시도 함수를 주입할 수 있도록 `onRetry` 인터페이스를 제공한다. 실제 네트워크 재시도와 CTA의 신규 문구·배치는 API 계약과 PD 디자인 확정 뒤에 연결한다.

### 문서

- 핸드오프 문서를 복제하지 않고, FE에서 적용하는 상태 규칙·코드 위치·PD 확정 대기 항목을 `docs/design/`에 기록한다.
- 화면별 API 매핑표에는 이 상태 규칙 문서를 참조로 연결한다.

## 제외 범위

- Toast 및 Feedback Message 신규 UI
- Error·Empty 상태의 신규 시각 디자인
- 실제 API 클라이언트, TanStack Query, 재시도 네트워크 로직
- 조리 완료 재안내 기능
- PD가 확정하지 않은 버튼 Loading 애니메이션 또는 문구

## 상태 모델

| 분류          | 값                                                     | 의미                                              |
| ------------- | ------------------------------------------------------ | ------------------------------------------------- |
| 데이터 상태   | `loading`, `content`, `empty`, `error`, `unauthorized` | 요청과 데이터 결과에 따라 화면을 결정한다.        |
| 인터랙션 상태 | `default`, `pressed`, `disabled`, `loading`            | 버튼·입력 등 개별 컴포넌트의 상호작용을 결정한다. |

`loading`은 두 분류에 존재하지만 역할이 다르다. 데이터 상태의 `loading`은 페이지·목록 로딩이고, 인터랙션 상태의 `loading`은 단일 액션 요청 진행 중이다.

## 파일별 변경

| 파일                                  | 변경                                                  |
| ------------------------------------- | ----------------------------------------------------- |
| `src/shared/model/ui-state.ts`        | 공용 데이터·인터랙션 상태 타입 추가                   |
| `src/shared/ui/skeleton.tsx`          | 기존 접근성 기준을 유지하며 문서에서 적용 위치로 기록 |
| `src/components/ui/button.tsx`        | 기존 `disabled` 사용을 중복 요청 방지 기준으로 문서화 |
| `src/views/pantry/ui/pantry-page.tsx` | Error 상태의 재시도 핸들러 인터페이스와 접근성 보완   |
| `docs/design/fe-pd-handoff.md`        | FE 적용 기준과 PD 확정 대기 항목 기록                 |
| `docs/api/screen-api-mapping.md`      | 핸드오프 기준 문서 참조 추가                          |

## 검증 기준

- 기존 Button의 `disabled` 호출은 변경 없이 중복 요청 방지에 사용할 수 있다.
- Skeleton은 화면 읽기 도구에서 로딩 장식 요소로 중복 읽히지 않는다.
- Pantry Loading·Empty·Error 목업 분기가 유지된다.
- lint, typecheck, test, build가 통과한다.
