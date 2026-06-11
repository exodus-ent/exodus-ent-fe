'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import Calendar from '@/components/calendar/Calendar';
import FilterBar from '@/components/calendar/FilterBar';
import ScheduleLoader from '@/components/calendar/ScheduleLoader';
import ScheduleInitializer from '@/components/schedule/ScheduleInitializer';
import LoginRequired from '@/components/common/LoginRequired';

interface Props {
  initialIdol?: string;
}

export default function ScheduleContent({ initialIdol }: Props) {
  const { user } = useAuthStore();
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">스케줄</h1>
          {user?.isAdmin && (
            <Link
              href="/admin/schedule/new"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              + 스케줄 등록
            </Link>
          )}
        </div>
        <ScheduleLoader />
        <ScheduleInitializer idol={initialIdol} />
        <FilterBar />
        <Calendar />
      </div>
    </div>
  );
}
