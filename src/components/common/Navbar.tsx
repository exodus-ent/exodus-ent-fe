'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const NAV_LINKS = [
  { label: '아이돌', href: '/' },
  { label: '스케줄', href: '/schedule' },
  { label: '후기', href: '/reviews' },
  { label: '마이페이지', href: '/mypage' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          엑소더스<span className="text-red-500">Ent</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === href ? 'text-white' : 'text-gray-400'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                <span className="font-semibold text-white">{user.nickname}</span>님
              </span>
              <button
                onClick={logout}
                className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-white"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-gray-800 bg-black px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-900 ${
                  pathname === href ? 'text-white' : 'text-gray-400'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-gray-800 pt-3">
            {user ? (
              <>
                <span className="px-3 text-sm text-gray-400">
                  <span className="font-semibold text-white">{user.nickname}</span>님
                </span>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="rounded-md border border-gray-700 px-3 py-2 text-sm text-gray-400 hover:border-gray-500 hover:text-white"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-3 py-2 text-center text-sm font-medium text-gray-400 hover:text-white"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
