'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface Schedule {
  id: string;
  title: string;
  idol: string;
  category: string;
  date: string;
  time?: string;
  location?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return; }
      const { data: profile } = await supabase
        .from('profiles').select('is_admin').eq('id', data.user.id).maybeSingle();
      const isAdmin = profile?.is_admin === true || data.user.user_metadata?.isAdmin === true;
      if (!isAdmin) { router.push('/'); return; }
      setAuthChecked(true);
    });
  }, [router]);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    const { data } = await createClient()
      .from('schedules')
      .select('id, title, idol, category, date, time, location')
      .order('date', { ascending: false });
    setSchedules(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authChecked) fetchSchedules();
  }, [authChecked, fetchSchedules]);

  const handleDelete = async (id: string) => {
    if (!confirm('스케줄을 삭제할까요?')) return;
    await createClient().from('schedules').delete().eq('id', id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-black">
        <p className="text-sm text-white/40">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bebas text-4xl tracking-[0.15em] text-white">SCHEDULE ADMIN</h1>
          <Link
            href="/admin/schedule/new"
            className="bg-[#CCFF00] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#b3e600]"
          >
            + 스케줄 등록
          </Link>
        </div>

        <div className="overflow-hidden border border-white/10 bg-[#111]">
          {loading ? (
            <p className="p-6 text-center text-sm text-white/40">불러오는 중...</p>
          ) : schedules.length === 0 ? (
            <p className="p-6 text-center text-sm text-white/40">등록된 스케줄이 없어요.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs font-medium text-white/40">
                  <th className="px-5 py-3">제목</th>
                  <th className="px-5 py-3">아이돌</th>
                  <th className="px-5 py-3">카테고리</th>
                  <th className="px-5 py-3">날짜</th>
                  <th className="hidden px-5 py-3 sm:table-cell">장소</th>
                  <th className="px-5 py-3 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {schedules.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-white/3">
                    <td className="px-5 py-3 font-medium text-white">{s.title}</td>
                    <td className="px-5 py-3 text-white/60">{s.idol}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-[#CCFF00]/10 px-2 py-0.5 text-xs font-medium text-[#CCFF00]">
                        {s.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/60">
                      {s.date}
                      {s.time && <span className="ml-1 text-white/30">{s.time}</span>}
                    </td>
                    <td className="hidden px-5 py-3 text-white/40 sm:table-cell">{s.location ?? '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/schedule/${s.id}/edit`}
                          className="border border-white/15 px-3 py-1 text-xs text-white/60 transition-colors hover:border-white/30 hover:text-white"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="border border-red-500/20 px-3 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
