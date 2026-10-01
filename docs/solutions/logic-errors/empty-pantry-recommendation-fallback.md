---
title: 빈 팬트리에서 인기 fallback을 팬트리 추천으로 표시하는 문제
date: 2026-10-01
category: logic-errors
module: 레시피 팬트리 추천
problem_type: logic_error
component: frontend
symptoms:
  - 빈 팬트리인데 팬트리 기반 추천 영역에 인기 레시피가 표시된다
  - 소비기한이 등록되지 않은 보유 재료가 레시피 매칭에서 제외된다
root_cause: logic_error
resolution_type: code_fix
severity: medium
tags: [recipes, pantry, recommendations, fallback]
---

# 빈 팬트리에서 인기 fallback을 팬트리 추천으로 표시하는 문제

## Problem

팬트리 재료 기반 추천 영역에 재료가 없는데도 인기 레시피가 노출될 수 있었다. 소비기한을 등록하지 않은 보유 재료도 재료 기반 레시피 조회 대상에서 빠졌다.

## Symptoms

- 팬트리가 비어 있어도 `팬트리 기반 추천` 제목과 인기 레시피가 표시된다.
- 유효한 팬트리 재료에 소비기한이 없으면 해당 재료를 사용하는 레시피가 조회되지 않는다.

## What Didn't Work

- 추천 API의 인기 fallback 응답 자체를 제거하는 것은 해결책이 아니다. 그 응답은 다른 추천 영역에서도 정상적으로 쓰인다.
- 팬트리 항목의 소비기한 등록 여부를 레시피 재료 매칭 가능 여부와 연결하면 미등록 재료가 빠진다.

## Solution

- 팬트리 기반 추천 API 조회와 영역 렌더링을 `pantryItems.length > 0`일 때만 허용한다. 취향 기반 추천 영역은 별도로 유지한다.
- 레시피 매칭에는 사용 가능한 재료 중 만료되지 않은 항목을 포함하고, 소비기한 미등록 여부만으로 제외하지 않는다.
- 빈 팬트리 화면과 소비기한 미등록 재료 하나만 있는 화면을 각각 테스트한다.

## Why This Works

추천 API는 개인화 추천이 불가능할 때 `POPULARITY` 결과를 반환할 수 있다. 이 응답을 팬트리 영역에서 무조건 렌더링하면 팬트리가 비어도 팬트리 기반 추천처럼 오해하게 된다. 영역 표시를 실제 팬트리 데이터에 연결하면 인기 fallback은 보유 재료가 있는 경우에만 팬트리 추천 슬롯을 채운다.

소비기한은 재료의 존재 여부와 다른 속성이다. 날짜가 미등록이어도 팬트리에 보유 중인 재료라면 ingredient ID를 통해 레시피를 조회할 수 있다.

## Prevention

- 추천 API fallback의 `source`와 무관하게, 팬트리 전용 UI의 표시 조건은 팬트리 보유 데이터로 검증한다.
- 빈 데이터와 최소 한 개의 미등록 소비기한 재료를 포함한 경계 테스트를 유지한다.

## Related Issues

- `src/views/recipe/ui/recipe-list-page.tsx`
- `src/views/recipe/ui/recipe-list-page-icon.test.tsx`
