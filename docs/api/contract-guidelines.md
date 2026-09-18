# REST API 및 MSW 계약 가이드

## 원칙

- REST API 명세는 프론트엔드·백엔드·MSW의 공통 기준이다.
- 정상 응답뿐 아니라 빈 데이터, 미인증, 권한 없음, 품절, 유효성 오류, 서버 오류를 명세에 포함한다.
- 상태 값은 문자열 enum으로 명시한다. 예: `AVAILABLE`, `UNAVAILABLE`, `CHECK_REQUIRED`.

## 인증 API 협의 기준

- 지원 제공자는 `KAKAO`, `NAVER` 두 종류로 고정한다.
- OAuth 인가 코드 교환과 제공자 비밀 값 처리는 백엔드가 수행한다. 프론트엔드는 제공자 비밀 값이나 장기 토큰을 저장하지 않는다.
- 로그인 성공·실패·가입 필요·토큰 만료 응답을 명세에 포함한다.
- 로그인 완료 응답에는 최소한 서비스 사용자 식별자와 `provider`를 포함한다.
- 동일 이메일의 제공자 간 계정 자동 통합은 MVP에서 지원하지 않는다.

## API 주소·CORS·쿠키 정책

- 프론트엔드는 `.env.local`의 `NEXT_PUBLIC_API_BASE_URL`로 백엔드 주소를 명시한다. 로컬 개발은 `http://localhost:8080`을 허용하고, 배포 환경은 `https://` 주소만 허용한다.
- FE와 API가 다른 origin이면 BE는 허용 origin을 와일드카드(`*`)가 아닌 실제 FE 도메인 목록으로 설정하고, `Access-Control-Allow-Credentials: true`를 반환한다.
- Refresh Token 재발급 요청은 `credentials: 'include'`로 호출한다. 배포 환경의 Refresh Token 쿠키는 `HttpOnly`, `Secure`를 설정해야 하며, `SameSite` 값은 FE·API 배포 도메인 관계에 맞춰 BE·인프라와 확정한다.
- Refresh Token 쿠키의 실제 발급 속성은 백엔드 책임이다. FE는 API 주소 검증과 쿠키 포함 요청까지만 담당한다.

## MSW 흐름

1. 합의된 API 명세를 기준으로 도메인별 핸들러를 작성한다.
2. 프론트엔드는 MSW로 정상·빈·오류 상태를 먼저 구현한다.
3. 실제 API 연동에서 불일치가 생기면 API 명세와 MSW를 먼저 갱신한다.
