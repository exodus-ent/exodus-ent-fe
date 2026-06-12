'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import IdolForm, { type Idol } from '@/components/admin/IdolForm';

export default function ArtistsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = !!user?.isAdmin;

  const [idols, setIdols] = useState<Idol[]>([]);
  const [loading, setLoading] = useState(true);
  // undefined = 모달 숨김 / null = 신규 등록 / Idol = 수정
  const [editingIdol, setEditingIdol] = useState<Idol | null | undefined>(undefined);

  const fetchIdols = useCallback(() => {
    setLoading(true);
    createClient()
      .from('idols')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setIdols(data ?? []);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchIdols();
  }, [fetchIdols]);

  const handleDelete = async (id: string) => {
    if (!confirm('아이돌을 삭제할까요?')) return;
    await createClient().from('idols').delete().eq('id', id);
    setIdols((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        {/* 헤더 */}
        <div className="mb-10 flex items-end justify-between">
          <h1 className="font-bebas text-5xl tracking-[0.2em] text-white">ARTISTS</h1>
          {isAdmin && (
            <button
              onClick={() => setEditingIdol(null)}
              className="bg-[#CCFF00] px-4 py-2 text-xs font-semibold text-black transition-colors hover:bg-[#b3e600]"
            >
              + 아이돌 추가
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] animate-pulse bg-[#111]" />
                <div className="h-4 w-2/3 animate-pulse bg-white/10" />
              </div>
            ))}
          </div>
        ) : idols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-sm text-white/30">등록된 아티스트가 없습니다.</p>
            {isAdmin && (
              <button
                onClick={() => setEditingIdol(null)}
                className="mt-4 text-xs text-[#CCFF00] underline underline-offset-4 hover:text-[#b3e600]"
              >
                + 첫 아이돌 등록하기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {idols.map((idol) => (
              <div key={idol.id} className="group">
                {/* 카드 이미지 */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {idol.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={idol.profile_image_url}
                      alt={idol.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#111]">
                      <span className="select-none font-bebas text-4xl tracking-widest text-white/30">
                        {idol.name}
                      </span>
                    </div>
                  )}

                  {/* 관리자 오버레이 */}
                  {isAdmin && (
                    <div className="absolute inset-0 flex items-end justify-end gap-1.5 bg-black/60 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => setEditingIdol(idol)}
                        className="rounded border border-white/20 bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm transition-colors hover:bg-[#CCFF00] hover:text-black hover:border-[#CCFF00]"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(idol.id)}
                        className="rounded border border-red-500/40 bg-black/60 px-3 py-1.5 text-xs text-red-400 backdrop-blur-sm transition-colors hover:bg-red-500 hover:text-white hover:border-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}

                  {/* 일반 유저 클릭 → 스케줄 페이지 */}
                  {!isAdmin && (
                    <button
                      onClick={() => router.push(`/schedule?idol=${encodeURIComponent(idol.name)}`)}
                      className="absolute inset-0"
                      aria-label={`${idol.name} 스케줄 보기`}
                    />
                  )}
                </div>

                {/* 이름/소속사 */}
                <div className="mt-3 px-0.5">
                  <p className="font-bebas text-lg tracking-[0.1em] text-white">{idol.name}</p>
                  {idol.group_name && (
                    <p className="mt-0.5 text-xs tracking-widest text-white/40 uppercase">{idol.group_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 아이돌 등록/수정 모달 */}
      {editingIdol !== undefined && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingIdol(undefined); }}
        >
          <div className="w-full max-w-lg rounded-none border border-white/10 bg-[#111] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bebas text-2xl tracking-widest text-white">
                {editingIdol ? 'EDIT ARTIST' : 'ADD ARTIST'}
              </h2>
              <button
                onClick={() => setEditingIdol(undefined)}
                className="text-white/40 transition-colors hover:text-white"
              >
                ✕
              </button>
            </div>
            <IdolForm
              idol={editingIdol}
              onSave={() => {
                setEditingIdol(undefined);
                fetchIdols();
              }}
              onCancel={() => setEditingIdol(undefined)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
