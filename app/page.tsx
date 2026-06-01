import Calendar from '@/components/calendar/Calendar';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">엑소더스Ent 스케줄</h1>
        <Calendar />
      </div>
    </main>
  );
}
