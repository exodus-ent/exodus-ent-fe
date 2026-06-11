'use client';

import Link from 'next/link';

const RECT_COUNT = 6;
const STAGGER_S = 0.9;
const DURATION_S = RECT_COUNT * STAGGER_S;

export default function HomePage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-black">
      {/* zoom-in rectangle animation */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {Array.from({ length: RECT_COUNT }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-white/20"
            style={{
              width: '45vmin',
              height: '62vmin',
              animationName: 'zoom-rect',
              animationDuration: `${DURATION_S}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: `${-i * STAGGER_S}s`,
            }}
          />
        ))}
      </div>

      {/* content */}
      <div className="relative z-10 select-none px-6 text-center">
        <p className="mb-3 text-xs font-light tracking-[0.5em] text-white/40 uppercase">K-POP ARTIST COMMUNITY</p>
        <h1 className="font-bebas text-[18vw] leading-none text-[#CCFF00] sm:text-[14vw] lg:text-[11vw]">
          EXODUS
        </h1>
        <h2 className="font-bebas -mt-2 text-[6vw] leading-none tracking-[0.25em] text-white/80 sm:text-[4vw] lg:text-[3vw]">
          ENTERTAINMENT
        </h2>
        <p className="mt-6 text-sm font-light tracking-widest text-white/40">
          아티스트 스케줄 · 공연 후기 · 팬 커뮤니티
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/artists"
            className="border border-[#CCFF00] px-8 py-3 text-xs font-medium tracking-[0.2em] text-[#CCFF00] transition-colors hover:bg-[#CCFF00] hover:text-black"
          >
            ARTISTS
          </Link>
          <Link
            href="/schedule"
            className="border border-white/30 px-8 py-3 text-xs font-medium tracking-[0.2em] text-white/60 transition-colors hover:border-white hover:text-white"
          >
            SCHEDULE
          </Link>
        </div>
      </div>
    </div>
  );
}
