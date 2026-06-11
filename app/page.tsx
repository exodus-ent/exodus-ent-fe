'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface Idol {
  id: string;
  name: string;
  group_name: string | null;
  profile_image_url: string | null;
}

export default function HomePage() {
  const router = useRouter();
  const [idols, setIdols] = useState<Idol[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    createClient()
      .from('idols')
      .select('id, name, group_name, profile_image_url')
      .order('name')
      .then(({ data }) => {
        setIdols(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-bold text-white tracking-tight">아티스트</h2>

        {loading ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-gray-800" />
            ))}
          </div>
        ) : idols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800">
              <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">등록된 아티스트가 없습니다.</p>
            <p className="mt-1 text-xs text-gray-600">관리자 페이지에서 아이돌을 등록해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3">
            {idols.map((idol) => (
              <button
                key={idol.id}
                onClick={() => router.push(`/schedule?idol=${encodeURIComponent(idol.name)}`)}
                className="group relative aspect-[2/3] overflow-hidden rounded-md bg-gray-800 focus:outline-none"
              >
                {idol.profile_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={idol.profile_image_url}
                    alt={idol.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-800">
                    <span className="select-none text-5xl font-black text-gray-600">
                      {idol.name[0]}
                    </span>
                  </div>
                )}

                {/* hover 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-1 px-3 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {idol.group_name && (
                    <p className="mb-0.5 text-xs font-medium text-indigo-300">{idol.group_name}</p>
                  )}
                  <p className="text-sm font-bold text-white">{idol.name}</p>
                  <p className="mt-1 text-xs text-white/60">스케줄 보기 →</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
