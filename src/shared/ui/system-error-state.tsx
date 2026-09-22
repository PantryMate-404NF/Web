import { Button } from '@/components/ui/button';

interface SystemErrorStateProps {
  description?: string;
  onRetry: () => void;
  title: string;
}

export function SystemErrorState({
  description = '잠시 후 다시 시도해 주세요.',
  onRetry,
  title,
}: SystemErrorStateProps) {
  return (
    <section
      className="flex flex-1 flex-col items-center justify-center px-4 text-center"
      role="alert"
    >
      <p className="text-title-3 font-semibold">{title}</p>
      <p className="text-body-4 text-muted-foreground mt-2">{description}</p>
      <Button className="mt-5" onClick={onRetry} type="button" variant="outline">
        다시 시도
      </Button>
    </section>
  );
}
