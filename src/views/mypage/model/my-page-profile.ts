/** 프로필 로딩 전에는 목업 이름을 노출하지 않습니다. */
export function getMyPageDisplayName(nickname: string | null) {
  return nickname ?? '';
}
