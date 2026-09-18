---
title: Low-fi placeholder를 유지하는 semantic token 적용 규칙
date: 2026-08-31
category: conventions
module: 디자인 시스템
problem_type: convention
component: frontend
severity: low
applies_when:
  - 와이어프레임을 실제 화면 코드로 먼저 구현할 때
  - 디자인 토큰을 도입하면서 low-fi 목업을 유지해야 할 때
tags: [design-tokens, low-fi, frontend]
---

# Low-fi placeholder를 유지하는 semantic token 적용 규칙

## Context

와이어프레임 단계에서는 회색 이미지·카드·스켈레톤 placeholder가 화면 구조를 전달하는 역할을 한다. 반면 페이지 배경, 본문 텍스트, 버튼, 경계선, 오버레이까지 임의 색상과 글자 크기를 사용하면 디자인 시스템으로 전환할 때 일관성을 잃는다.

## Guidance

placeholder 표현에만 회색 primitive 값을 남기고, 실제 UI 역할은 `globals.css`의 semantic token과 typography utility를 사용한다.

```tsx
// placeholder: low-fi 표현이므로 유지 가능
<div className="bg-[#c5c6c9]" />

// 실제 UI 역할: semantic token 사용
<section className="bg-background text-foreground">
  <h2 className="text-title-3 font-bold">섹션 제목</h2>
  <p className="text-body-4 text-muted-foreground">설명</p>
</section>
```

`npm run check:token-usage`는 실제 UI에 다시 들어오는 `bg-white`, `text-white`, 일부 직접 색상과 10·11px 임의 글자 크기를 검사한다. 토큰 자체의 존재는 `npm run check:design-tokens`가 검사한다.

## Why This Matters

Low-fi 화면의 정보 구조는 유지하면서도, 라이트·다크 테마와 공용 컴포넌트가 공유하는 색상·타이포그래피 규칙을 먼저 정착시킬 수 있다.

## When to Apply

- 디자인 상세가 확정되기 전 목업 화면을 만들 때
- 공용 Button, Dialog, Sheet처럼 shadcn semantic token을 소비하는 컴포넌트를 추가할 때
- PR 전 `npm run check`와 `npm run build`를 실행할 때

## Related

- `docs/design/design-system.md`
