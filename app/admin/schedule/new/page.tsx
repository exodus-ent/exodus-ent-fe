'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ScheduleForm from '@/components/admin/ScheduleForm';

export default function NewSchedulePage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .maybeSingle();
      const isAdmin = profile?.is_admin === true || data.user.user_metadata?.isAdmin === true;
      if (!isAdmin) {
        router.push('/');
        return;
      }
      setAuthChecked(true);
    });
  }, [router]);

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin" className="hover:text-indigo-600">
            스케줄 관리
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">스케줄 등록</span>
        </div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">스케줄 등록</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ScheduleForm mode="new" />
        </div>
      </div>
    </div>
  );
}
