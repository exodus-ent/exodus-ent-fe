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

export default function ArtistsPage() {
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
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="font-bebas mb-10 text-5xl tracking-[0.2em] text-white">ARTISTS</h1>

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
            <p className="mt-1 text-xs text-white/20">관리자 페이지에서 아이돌을 등록해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {idols.map((idol) => (
              <button
                key={idol.id}
                onClick={() => router.push(`/schedule?idol=${encodeURIComponent(idol.name)}`)}
                className="group text-left focus:outline-none"
              >
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
                </div>
                <div className="mt-3 px-0.5">
                  <p className="font-bebas text-lg tracking-[0.1em] text-white">{idol.name}</p>
                  {idol.group_name && (
                    <p className="mt-0.5 text-xs tracking-widest text-white/40 uppercase">{idol.group_name}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
