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
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2 text-xs text-white/30">
          <Link href="/admin" className="transition-colors hover:text-[#CCFF00]">
            스케줄 관리
          </Link>
          <span>/</span>
          <span className="text-white/60">스케줄 등록</span>
        </div>
        <h1 className="font-bebas mb-6 text-3xl tracking-[0.15em] text-white">스케줄 등록</h1>
        <div className="border border-white/10 bg-[#111] p-6">
          <ScheduleForm mode="new" />
        </div>
      </div>
    </div>
  );
}
