export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 py-10">
      <p className="text-primary text-sm font-medium">AI PANTRY</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        구매 이력으로 시작하는 나만의 팬트리
      </h1>
      <p className="text-muted-foreground mt-4 text-base leading-7">
        보유 재료를 확인하고, 지금 만들 수 있는 메뉴와 부족한 재료를 한 번에 확인하세요.
      </p>
      <section className="bg-card mt-10 rounded-[var(--radius)] border p-5 shadow-sm">
        <h2 className="text-lg font-semibold">초기 화면 준비 중</h2>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          홈, 팬트리, 레시피, 장바구니 흐름을 API 명세와 함께 구현합니다.
        </p>
      </section>
    </main>
  );
}
