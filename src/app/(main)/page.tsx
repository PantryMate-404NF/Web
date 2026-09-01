import Link from 'next/link';

const mockRoutes = [
  {
    href: '/pantry?state=full',
    label: '팬트리 아이콘형 목업',
    description: '아이콘으로 식재료를 표시하는 목록',
  },
  {
    href: '/pantry?state=full&view=image',
    label: '팬트리 이미지형 목업',
    description: '식재료 이미지가 들어가는 목록',
  },
  {
    href: '/pantry?state=loading',
    label: '팬트리 아이콘형 스켈레톤',
    description: '식재료 아이콘 목록을 불러오는 상태',
  },
  {
    href: '/pantry?state=loading&view=image',
    label: '팬트리 이미지형 스켈레톤',
    description: '식재료 이미지 목록을 불러오는 상태',
  },
  { href: '/recipe', label: '주재료 레시피 목업', description: '보유 주재료 기반 레시피 추천' },
  {
    href: '/recipe/imminent',
    label: '기한 임박 레시피 목업',
    description: '소비기한 임박 식재료 기반 레시피 추천',
  },
  {
    href: '/recipe/ingredients',
    label: '주재료 선택 목업',
    description: '주재료 레시피에서 이어지는 식재료 선택 흐름',
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 py-10">
      <p className="text-primary text-label-3 font-medium">AI PANTRY</p>
      <h1 className="text-hero mt-3 font-semibold tracking-tight">
        구매 이력으로 시작하는 나만의 팬트리
      </h1>
      <p className="text-body-3 text-muted-foreground mt-4">
        보유 재료를 확인하고, 지금 만들 수 있는 메뉴와 부족한 재료를 한 번에 확인하세요.
      </p>
      <section className="mt-10">
        <h2 className="text-title-3 font-semibold">프로토타입 목업</h2>
        <p className="text-body-4 text-muted-foreground mt-2">
          와이어프레임의 주요 흐름을 실제 라우트에서 확인할 수 있습니다.
        </p>
        <div className="mt-4 grid gap-3">
          {mockRoutes.map((route) => (
            <Link
              className="bg-card hover:bg-muted rounded-2xl border p-4 shadow-sm transition-colors"
              href={route.href}
              key={route.href}
            >
              <h3 className="font-semibold">{route.label}</h3>
              <p className="text-body-4 text-muted-foreground mt-1">{route.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
