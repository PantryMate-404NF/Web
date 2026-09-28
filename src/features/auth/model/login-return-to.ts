const LOGIN_RETURN_TO_KEY = 'pantry-mate:login-return-to';

export function getSafeLoginReturnTo(returnTo?: string | null): string | undefined {
  if (!returnTo?.startsWith('/') || returnTo.startsWith('//')) return undefined;
  return returnTo;
}

export function saveLoginReturnTo(storage: Storage, returnTo?: string | null) {
  const safeReturnTo = getSafeLoginReturnTo(returnTo);

  if (safeReturnTo) storage.setItem(LOGIN_RETURN_TO_KEY, safeReturnTo);
  else storage.removeItem(LOGIN_RETURN_TO_KEY);
}

export function takeLoginReturnTo(storage: Storage): string | undefined {
  const returnTo = getSafeLoginReturnTo(storage.getItem(LOGIN_RETURN_TO_KEY));
  storage.removeItem(LOGIN_RETURN_TO_KEY);
  return returnTo;
}
