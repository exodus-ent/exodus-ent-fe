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
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-bebas mb-8 text-4xl tracking-[0.15em] text-white">ARTISTS</h1>

        {loading ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse bg-white/5" />
            ))}
          </div>
        ) : idols.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center">
            <p className="text-sm text-white/30">등록된 아티스트가 없습니다.</p>
            <p className="mt-1 text-xs text-white/20">관리자 페이지에서 아이돌을 등록해주세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-3">
            {idols.map((idol) => (
              <button
                key={idol.id}
                onClick={() => router.push(`/schedule?idol=${encodeURIComponent(idol.name)}`)}
                className="group relative aspect-[2/3] overflow-hidden bg-white/5 focus:outline-none"
              >
                {idol.profile_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={idol.profile_image_url}
                    alt={idol.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/5">
                    <span className="select-none font-bebas text-5xl text-white/20">
                      {idol.name[0]}
                    </span>
                  </div>
                )}

                {/* hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-2 px-4 pb-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {idol.group_name && (
                    <p className="mb-0.5 text-xs font-light tracking-[0.15em] text-[#CCFF00]/70 uppercase">{idol.group_name}</p>
                  )}
                  <p className="font-bebas text-xl tracking-[0.1em] text-[#CCFF00]">{idol.name}</p>
                  <p className="mt-1 text-xs tracking-widest text-white/40">SCHEDULE →</p>
                </div>

                {/* bottom lime line on hover */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#CCFF00] scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
