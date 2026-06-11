import { Suspense } from 'react';
import ScheduleContent from './ScheduleContent';

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ idol?: string }>;
}) {
  const { idol } = await searchParams;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
          <p className="text-sm text-gray-400">로딩 중...</p>
        </div>
      }
    >
      <ScheduleContent initialIdol={idol} />
    </Suspense>
  );
}
