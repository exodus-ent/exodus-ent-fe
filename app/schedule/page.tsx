import Calendar from '@/components/calendar/Calendar';
import FilterBar from '@/components/calendar/FilterBar';
import ScheduleLoader from '@/components/calendar/ScheduleLoader';
import ScheduleInitializer from '@/components/schedule/ScheduleInitializer';

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ idol?: string }>;
}) {
  const { idol } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">스케줄</h1>
        <ScheduleLoader />
        <ScheduleInitializer idol={idol} />
        <FilterBar />
        <Calendar />
      </div>
    </div>
  );
}
