import { CheckCircle2, ChefHat } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { MobileScreen } from '@/widgets/app-shell/ui/mobile-screen';

export function CookingCompletePage() {
  return (
    <MobileScreen backHref="/recipe" title="조리 완료">
      <section className="bg-card mt-24 flex min-h-96 flex-col items-center justify-center rounded-3xl border px-7 text-center">
        <div className="bg-muted flex size-16 items-center justify-center rounded-full">
          <ChefHat aria-hidden="true" className="text-primary size-8" />
        </div>
        <CheckCircle2 aria-hidden="true" className="text-primary mt-5 size-7" />
        <h2 className="mt-3 text-xl font-semibold">맛있게 드셨나요?</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          조리에 사용한 재료의 실제 상태는
          <br />
          팬트리에서 한 번 더 확인해 주세요.
        </p>
        <Button asChild className="mt-8 h-12 w-full">
          <Link href="/pantry?state=full">팬트리 상태 확인하기</Link>
        </Button>
        <Link
          className="text-muted-foreground mt-4 text-sm underline underline-offset-4"
          href="/recipe"
        >
          다른 레시피 보기
        </Link>
      </section>
    </MobileScreen>
  );
}
