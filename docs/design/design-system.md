# PantryMate 디자인 시스템

## 목적

PantryMate의 화면과 공용 UI가 같은 색상, 여백, 글자 체계, 상태 표현을 사용하도록 하는 단일 기준입니다. 구현과 피그마가 달라질 때는 이 문서와 `src/app/globals.css`를 먼저 확인합니다.

## 소유권과 사용 순서

```text
Primitive token → Semantic token → Component token → 화면 컴포넌트
```

| 계층      | 위치                                       | 책임                                     | 화면에서의 사용 여부         |
| --------- | ------------------------------------------ | ---------------------------------------- | ---------------------------- |
| Primitive | `src/app/globals.css`                      | 원본 색상·간격·반경·그림자 값            | 직접 사용 금지               |
| Semantic  | `src/app/globals.css`                      | 배경, 텍스트, 액션, 상태처럼 의미를 부여 | 우선 사용                    |
| Component | `src/app/globals.css`, `src/shared/ui`     | 버튼, 카드, 입력창의 역할·상태 조합      | 공용 UI 내부에서 사용        |
| 화면      | `src/views`, `src/widgets`, `src/features` | 도메인별 UI 조합                         | semantic 또는 공용 UI만 사용 |

새 화면에서 `#FFCD55`, `#D4E59E`처럼 색상값을 직접 작성하지 않습니다. 필요한 역할이 없다면 primitive 값을 화면에 넣는 대신, semantic 또는 component 토큰을 먼저 추가하고 이 문서도 함께 갱신합니다.

## 색상

Primitive 팔레트의 실제 CSS 변수명은 `globals.css`를 기준으로 합니다. Figma의 상태 순서는 `Light → Light:hover → Light:active → Normal → Normal:hover → Normal:active → Dark → Dark:hover → Dark:active → Darker`입니다.

| 팔레트            | 용도                            | 대표 색상             |
| ----------------- | ------------------------------- | --------------------- |
| Primary / Yellow  | 주요 CTA, 선택, 포커스          | `#FFCD55`             |
| Secondary / Green | 보조 CTA, 식재료·친환경 맥락    | `#D4E59E`             |
| Blue              | 정보성 안내·향후 정보 상태      | `#98B7E4`             |
| Red               | 오류, 삭제, 위험 상태           | `#FFADAE`             |
| Grey              | 텍스트, 배경, 경계선, 다크 모드 | `#1C1C1E` ~ `#F3F4F4` |

### 현재 semantic 토큰

| 의미            | 토큰                                 | 라이트 테마 값 |
| --------------- | ------------------------------------ | -------------- |
| 기본 배경       | `--background`                       | 흰색           |
| 보조 배경       | `--background-secondary`             | Grey 050       |
| 기본 텍스트     | `--foreground` / `--text-primary`    | Grey 900       |
| 보조 텍스트     | `--text-secondary`                   | Grey 600       |
| 기본 액션       | `--primary` / `--action-primary`     | Yellow 500     |
| 기본 액션 hover | `--action-primary-hover`             | Yellow 600     |
| 보조 액션       | `--secondary` / `--action-secondary` | Green 500      |
| 보조 액션 hover | `--action-secondary-hover`           | Green 600      |
| 위험 상태       | `--status-danger`                    | Red 400        |
| 위험 상태 hover | `--status-danger-hover`              | Red 500        |
| 포커스 링       | `--ring` / `--focus-ring`            | Yellow 500     |

`Blue`는 팔레트만 등록되어 있으며 아직 확정된 정보 상태 컴포넌트가 없습니다. 정보 배너나 안내 UI가 확정되면 `--status-info`, `--status-info-hover` 같은 semantic 토큰을 추가한 뒤 사용합니다.

## 테마

- 기본 테마는 라이트입니다.
- `.dark` 클래스는 semantic 토큰만 재정의합니다. 화면 컴포넌트는 별도의 색상을 만들지 않습니다.
- 토글 방식과 시스템 설정 동기화는 다크 모드 기능 구현 이슈에서 결정합니다. 현재는 토큰 기반 준비만 완료된 상태입니다.
- 색상만으로 상태를 전달하지 않습니다. 오류·선택·소비기한 상태에는 텍스트, 아이콘 또는 배지를 함께 제공합니다.

## Typography

기본 글꼴은 `PretendardVariable.woff2`이며, 전역 `font-sans`와 `body`에 적용합니다. 크기·굵기·줄높이는 아래 표를 기준으로 합니다. `-`로 표시한 Hero·Heading 줄높이는 현재 고정값을 두지 않으며, 임의 값으로 추가하지 않습니다.

| Category | Style | Font size | Weight                      | Line-height |
| -------- | ----- | --------- | --------------------------- | ----------- |
| Hero     | Hero  | 28px      | Bold                        | -           |
| Heading  | H1    | 26px      | Bold / Semibold             | -           |
| Heading  | H2    | 24px      | Bold / Semibold             | -           |
| Heading  | H3    | 20px      | Bold / Semibold             | -           |
| Heading  | H4    | 18px      | Bold / Semibold             | -           |
| Title    | T1    | 24px      | Bold / Semibold / Medium    | 150%        |
| Title    | T2    | 20px      | Bold / Semibold / Medium    | 150%        |
| Title    | T3    | 18px      | Bold / Semibold / Medium    | 150%        |
| Title    | T4    | 16px      | Bold / Semibold / Medium    | 150%        |
| Body     | B1    | 20px      | Semibold / Medium / Regular | 160%        |
| Body     | B2    | 18px      | Semibold / Medium / Regular | 160%        |
| Body     | B3    | 16px      | Semibold / Medium / Regular | 160%        |
| Body     | B4    | 14px      | Semibold / Medium / Regular | 160%        |
| Label    | L1    | 18px      | Semibold / Medium / Regular | 150%        |
| Label    | L2    | 16px      | Semibold / Medium / Regular | 150%        |
| Label    | L3    | 14px      | Semibold / Medium / Regular | 150%        |
| Label    | L4    | 13px      | Semibold / Medium / Regular | 150%        |

`globals.css`에는 위 크기·굵기·명시된 줄높이의 primitive 토큰을 등록합니다. 공용 typography 컴포넌트 또는 Tailwind utility는 실제 화면 디자인을 적용하는 작업에서 이 값을 소비하도록 추가합니다.

## Spacing, radius, shadow, responsive

| 구분               | 사용 기준                                                                     |
| ------------------ | ----------------------------------------------------------------------------- |
| Spacing            | `0, 4, 8, 12, 16, 20, 24, 32, 40px` 토큰을 우선 사용                          |
| Radius             | `sm 8px`, `md 12px`, `lg 16px`                                                |
| Shadow             | `--shadow-1`, `--shadow-2`, `--shadow-3` 중 역할에 맞춰 사용                  |
| Mobile layout      | iPhone 13 & 14의 `390px` 디자인 프레임을 기준으로 하며, 좌·우 margin은 `16px` |
| Mobile breakpoint  | `390–767px`, 콘텐츠 폭은 제한 없이 fluid                                      |
| Tablet breakpoint  | `768–1023px`, `768px` 디자인 프레임, 콘텐츠 폭은 제한 없이 fluid              |
| Desktop breakpoint | `1024px` 이상, `1920px` 디자인 프레임, 콘텐츠 최대 폭 `1200px`                |

Tablet·Desktop의 Grid 열 수, 간격, 세부 layout은 화면 구조와 콘텐츠가 확정된 뒤 별도 정의합니다. 현재는 `tablet:`(768px), `desktop:`(1024px) breakpoint와 Desktop 최대 콘텐츠 폭 토큰만 전역에 등록합니다.

## 공용 컴포넌트 규칙

1. 새 버튼·입력창·카드·배지는 먼저 `src/shared/ui`의 재사용 가능성을 확인합니다.
2. shadcn/ui 기반 컴포넌트가 요구하는 semantic 토큰(`accent`, `destructive`, `input`, `popover` 등)은 공용 컴포넌트 도입 전에 전역 테마에 정의합니다.
3. 컴포넌트는 `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`, `error` 상태를 필요한 범위에서 정의합니다.
4. 화면 전용 조합이나 도메인 문맥은 `shared/ui`에 넣지 않고 `widgets`, `features`, `entities`에 둡니다.

## 변경 절차와 검증

1. 피그마에서 원본 색상·상태·접근성 의도를 확인합니다.
2. primitive → semantic → component 순서로 토큰을 추가합니다.
3. 해당 토큰을 소비하는 공용 컴포넌트 또는 화면을 구현합니다.
4. `npm run check:design-tokens`, `npm run format:check`를 실행합니다.
5. UI 변경이면 360px, 390px, 430px와 라이트·다크 테마를 사람이 확인합니다.

`check:design-tokens`는 핵심 폰트·색상·테마·반응형 토큰의 존재를 검사합니다. 화면에서 primitive 값을 직접 사용하지 않았는지, 대비와 실제 사용성은 코드 리뷰와 시각 검수로 확인합니다.
