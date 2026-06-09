'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import ScheduleForm, { type ScheduleFormValues } from '@/components/admin/ScheduleForm';

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const scheduleId = params.id;
  const [authChecked, setAuthChecked] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<ScheduleFormValues> | null>(null);

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
      if (!profile?.is_admin) {
        router.push('/');
        return;
      }

      const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', scheduleId)
        .single();

      if (!schedule) {
        router.push('/admin');
        return;
      }

      setDefaultValues({
        title: schedule.title ?? '',
        idol: schedule.idol ?? '',
        category: schedule.category ?? '',
        date: schedule.date ?? '',
        time: schedule.time ?? '',
        location: schedule.location ?? '',
        description: schedule.description ?? '',
        thumbnail_url: schedule.thumbnail_url ?? '',
        detail_url: schedule.detail_url ?? '',
      });
      setAuthChecked(true);
    });
  }, [router, scheduleId]);

  if (!authChecked || !defaultValues) {
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
          <span className="font-medium text-gray-800">스케줄 수정</span>
        </div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">스케줄 수정</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <ScheduleForm mode="edit" scheduleId={scheduleId} defaultValues={defaultValues} />
        </div>
      </div>
    </div>
  );
}
