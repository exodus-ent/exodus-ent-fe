'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Calendar from '@/components/calendar/Calendar';
import FilterBar from '@/components/calendar/FilterBar';
import ScheduleLoader from '@/components/calendar/ScheduleLoader';
import ScheduleInitializer from '@/components/schedule/ScheduleInitializer';
import LoginRequired from '@/components/common/LoginRequired';

interface Props {
  initialIdol?: string;
}

export default function ScheduleContent({ initialIdol }: Props) {
  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <LoginRequired />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">스케줄</h1>
        <ScheduleLoader />
        <ScheduleInitializer idol={initialIdol} />
        <FilterBar />
        <Calendar />
      </div>
    </div>
  );
}
