# MSW 목업 사용법

`src/mocks`는 실제 백엔드 API를 브라우저와 테스트 환경에서 재현합니다. Next.js Route Handler를 대체하지 않습니다.

로컬에서 MSW를 사용할 때만 `.env.local`에 아래 값을 설정합니다.

```bash
NEXT_PUBLIC_API_MOCKING=enabled
```

`MockProvider`가 Service Worker 준비를 마친 뒤 화면을 렌더링합니다. 실제 백엔드와 연결할 때는 이 값을 제거하거나 비워 둡니다.

```text
data/      # API 성공 응답에 사용하는 고정 데이터
handlers/  # 도메인별 HTTP 요청·응답 규칙
browser.ts # 브라우저 Service Worker
server.ts  # Vitest용 Node 서버
```

새 API 목업은 `data/<domain>.ts`, `handlers/<domain>.ts`를 만든 후 `handlers/index.ts`에 등록합니다.
