'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LoginRequired() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white px-8 py-10 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
          <svg
            className="h-8 w-8 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-lg font-bold text-gray-900">로그인이 필요합니다</h2>
        <p className="mb-7 text-sm text-gray-500">로그인 후 이용해 주세요.</p>
        <Link
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
          className="block w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          로그인하기
        </Link>
      </div>
    </div>
  );
}
