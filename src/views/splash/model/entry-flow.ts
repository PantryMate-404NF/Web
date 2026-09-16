export const SPLASH_DURATION_MS = 1_500;
export const APP_ENTRY_STORAGE_KEY = 'ai-pantry:entered-app';

/** 스플래시는 브라우저 탭의 첫 앱 진입에만 표시합니다. */
export function getAppEntryMode(hasEnteredApp: boolean) {
  return hasEnteredApp ? 'home' : 'splash';
}

/** 스플래시 종료 후에는 모든 사용자가 로그인 화면에서 인증을 시작 */
export function getPostSplashRoute() {
  return '/login';
}
