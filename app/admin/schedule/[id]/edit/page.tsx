'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useScheduleStore } from '@/store/useScheduleStore';
import ScheduleForm, { type ScheduleFormValues } from '@/components/admin/ScheduleForm';

export default function EditSchedulePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const scheduleId = params.id;
  const [authChecked, setAuthChecked] = useState(false);
  const [defaultValues, setDefaultValues] = useState<Partial<ScheduleFormValues> | null>(null);
  const [notFound, setNotFound] = useState(false);

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

      // 캘린더 → 모달 → 수정 경로: store에서 먼저 탐색
      const storeSchedule = useScheduleStore.getState().schedules.find((s) => s.id === scheduleId);
      if (storeSchedule) {
        setDefaultValues({
          title: storeSchedule.title,
          idol: storeSchedule.idol,
          category: storeSchedule.category,
          date: storeSchedule.date,
          time: storeSchedule.time ?? '',
          location: storeSchedule.location ?? '',
          description: storeSchedule.description ?? '',
          thumbnail_url: storeSchedule.thumbnailUrl ?? '',
          detail_url: storeSchedule.detailUrl ?? '',
        });
        setAuthChecked(true);
        return;
      }

      // admin 테이블 → 수정 경로: Supabase에서 조회
      const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', scheduleId)
        .single();

      if (!schedule) {
        setNotFound(true);
        setAuthChecked(true);
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

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-3">
        <p className="text-sm text-gray-500">스케줄을 찾을 수 없습니다.</p>
        <Link href="/admin" className="text-sm font-medium text-indigo-600 hover:underline">
          관리자 페이지로 돌아가기
        </Link>
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
          {defaultValues && (
            <ScheduleForm mode="edit" scheduleId={scheduleId} defaultValues={defaultValues} />
          )}
        </div>
      </div>
    </div>
  );
}
