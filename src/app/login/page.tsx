/** 로그인 시작 화면을 제공하는 App Router 경로입니다. */
import { LoginPage } from '@/views/auth/ui/login-page';

type LoginRouteProps = {
  searchParams: Promise<{ returnTo?: string | string[] }>;
};

export default async function LoginRoute({ searchParams }: LoginRouteProps) {
  const { returnTo } = await searchParams;
  return <LoginPage returnTo={typeof returnTo === 'string' ? returnTo : undefined} />;
}
