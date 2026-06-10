'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface Idol {
  id: string;
  name: string;
  group_name: string | null;
  profile_image_url: string | null;
  description: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const [idols, setIdols] = useState<Idol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from('idols')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setIdols(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-28 text-center text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #4f46e5 0%, transparent 60%), radial-gradient(circle at 70% 30%, #7c3aed 0%, transparent 60%)' }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-indigo-400">
            Entertainment
          </p>
          <h1 className="mb-5 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            엑소더스<span className="text-indigo-400">Ent</span>
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            아티스트 스케줄 · 공연 후기 · 팬 커뮤니티
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/schedule"
              className="rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              스케줄 보기
            </Link>
            <Link
              href="/reviews"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              후기 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Artists */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">
              Our Artists
            </p>
            <h2 className="text-3xl font-black text-gray-900">아티스트</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl bg-gray-200"
                />
              ))}
            </div>
          ) : idols.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-400">등록된 아티스트가 없습니다.</p>
              <p className="mt-1 text-xs text-gray-300">관리자 페이지에서 아이돌을 등록해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {idols.map((idol) => (
                <button
                  key={idol.id}
                  onClick={() =>
                    router.push(`/schedule?idol=${encodeURIComponent(idol.name)}`)
                  }
                  className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 text-left shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  {idol.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={idol.profile_image_url}
                      alt={idol.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <span className="text-6xl font-black text-gray-400 select-none">
                        {idol.name[0]}
                      </span>
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {idol.group_name && (
                      <p className="mb-0.5 text-xs font-medium text-indigo-300">
                        {idol.group_name}
                      </p>
                    )}
                    <p className="text-base font-bold text-white sm:text-lg">{idol.name}</p>
                    <p className="mt-1 translate-y-1 text-xs text-white/60 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                      스케줄 보기 →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
