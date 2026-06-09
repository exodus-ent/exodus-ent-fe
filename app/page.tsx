import Calendar from '@/components/calendar/Calendar';
import FilterBar from '@/components/calendar/FilterBar';
import ScheduleLoader from '@/components/calendar/ScheduleLoader';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">엑소더스Ent 스케줄</h1>
        <ScheduleLoader />
        <FilterBar />
        <Calendar />
      </div>
    </div>
  );
}
