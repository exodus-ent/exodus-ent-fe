'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import IdolForm, { type Idol } from '@/components/admin/IdolForm';

type Tab = 'schedules' | 'idols';

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
  const [activeTab, setActiveTab] = useState<Tab>('schedules');

  // 스케줄
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(true);

  // 아이돌
  const [idols, setIdols] = useState<Idol[]>([]);
  const [idolsLoading, setIdolsLoading] = useState(true);
  // undefined = 폼 숨김, null = 새 아이돌 등록, Idol = 해당 아이돌 수정
  const [editingIdol, setEditingIdol] = useState<Idol | null | undefined>(undefined);

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

  const fetchSchedules = useCallback(async () => {
    setSchedulesLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('schedules')
      .select('id, title, idol, category, date, time, location')
      .order('date', { ascending: false });
    setSchedules(data ?? []);
    setSchedulesLoading(false);
  }, []);

  const fetchIdols = useCallback(async () => {
    setIdolsLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('idols').select('*').order('name');
    setIdols(data ?? []);
    setIdolsLoading(false);
  }, []);

  useEffect(() => {
    if (authChecked) {
      fetchSchedules();
      fetchIdols();
    }
  }, [authChecked, fetchSchedules, fetchIdols]);

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('스케줄을 삭제할까요?')) return;
    const supabase = createClient();
    await supabase.from('schedules').delete().eq('id', id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleDeleteIdol = async (id: string) => {
    if (!confirm('아이돌을 삭제할까요?')) return;
    const supabase = createClient();
    await supabase.from('idols').delete().eq('id', id);
    setIdols((prev) => prev.filter((i) => i.id !== id));
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-sm text-gray-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">관리자</h1>

        {/* 탭 */}
        <div className="mb-6 flex w-fit gap-1 rounded-xl bg-gray-100 p-1">
          {([['schedules', '스케줄 관리'], ['idols', '아이돌 관리']] as [Tab, string][]).map(
            ([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ),
          )}
        </div>

        {/* 스케줄 관리 탭 */}
        {activeTab === 'schedules' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">스케줄 관리</h2>
              <Link
                href="/admin/schedule/new"
                className="rounded-lg bg-[#CCFF00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600]"
              >
                + 스케줄 등록
              </Link>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {schedulesLoading ? (
                <p className="p-6 text-center text-sm text-gray-400">불러오는 중...</p>
              ) : schedules.length === 0 ? (
                <p className="p-6 text-center text-sm text-gray-400">등록된 스케줄이 없어요.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500">
                      <th className="px-5 py-3">제목</th>
                      <th className="px-5 py-3">아이돌</th>
                      <th className="px-5 py-3">카테고리</th>
                      <th className="px-5 py-3">날짜</th>
                      <th className="px-5 py-3">장소</th>
                      <th className="px-5 py-3 text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {schedules.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-gray-900">{s.title}</td>
                        <td className="px-5 py-3 text-gray-600">{s.idol}</td>
                        <td className="px-5 py-3">
                          <span className="rounded-full bg-[#CCFF00]/10 px-2 py-0.5 text-xs font-medium text-[#CCFF00]">
                            {s.category}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-600">
                          {s.date}
                          {s.time && <span className="ml-1 text-gray-400">{s.time}</span>}
                        </td>
                        <td className="px-5 py-3 text-gray-500">{s.location ?? '-'}</td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/schedule/${s.id}/edit`}
                              className="rounded-md border border-gray-200 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-50"
                            >
                              수정
                            </Link>
                            <button
                              onClick={() => handleDeleteSchedule(s.id)}
                              className="rounded-md border border-red-100 px-3 py-1 text-xs text-red-500 transition-colors hover:bg-red-50"
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
        )}

        {/* 아이돌 관리 탭 */}
        {activeTab === 'idols' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">아이돌 관리</h2>
              {editingIdol === undefined && (
                <button
                  onClick={() => setEditingIdol(null)}
                  className="rounded-lg bg-[#CCFF00] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#b3e600]"
                >
                  + 아이돌 등록
                </button>
              )}
            </div>

            {/* 등록/수정 폼 */}
            {editingIdol !== undefined && (
              <div className="mb-6 rounded-xl border border-[#CCFF00]/20 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-gray-900">
                  {editingIdol ? '아이돌 수정' : '아이돌 등록'}
                </h3>
                <IdolForm
                  idol={editingIdol}
                  onSave={() => {
                    setEditingIdol(undefined);
                    fetchIdols();
                  }}
                  onCancel={() => setEditingIdol(undefined)}
                />
              </div>
            )}

            {/* 아이돌 목록 */}
            {idolsLoading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-xl bg-gray-200" />
                ))}
              </div>
            ) : idols.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                <p className="text-sm text-gray-400">등록된 아이돌이 없어요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {idols.map((idol) => (
                  <div
                    key={idol.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* 이미지 */}
                    <div className="relative aspect-square bg-gray-100">
                      {idol.profile_image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={idol.profile_image_url}
                          alt={idol.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-4xl font-black text-gray-300 select-none">
                            {idol.name[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 정보 */}
                    <div className="p-3">
                      {idol.group_name && (
                        <p className="text-xs text-[#CCFF00]">{idol.group_name}</p>
                      )}
                      <p className="font-semibold text-gray-900">{idol.name}</p>
                      {idol.description && (
                        <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">
                          {idol.description}
                        </p>
                      )}

                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => setEditingIdol(idol)}
                          className="flex-1 rounded-lg border border-gray-200 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-50"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteIdol(idol.id)}
                          className="flex-1 rounded-lg border border-red-100 py-1.5 text-xs text-red-500 transition-colors hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
